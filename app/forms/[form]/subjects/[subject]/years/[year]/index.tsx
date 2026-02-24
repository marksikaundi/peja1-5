import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/src/components/AppScreen";
import { ListCard } from "@/src/components/ListCard";
import { usePapers } from "@/src/context/PapersContext";
import { listPapersByFormSubjectYear } from "@/src/lib/manifest";
import type { FormLevel } from "@/src/types/papers";

function parseForm(form: string | string[] | undefined): FormLevel | null {
  const raw = Array.isArray(form) ? form[0] : form;
  const parsed = Number(raw);

  if (parsed >= 1 && parsed <= 5) {
    return parsed as FormLevel;
  }

  return null;
}

function parseSubject(subject: string | string[] | undefined): string {
  const raw = Array.isArray(subject) ? subject[0] : subject;
  return raw ?? "";
}

function parseYear(year: string | string[] | undefined): number | null {
  const raw = Array.isArray(year) ? year[0] : year;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function YearPapersScreen() {
  const params = useLocalSearchParams<{ form?: string; subject?: string; year?: string }>();
  const { papers, downloads } = usePapers();

  const form = parseForm(params.form);
  const subject = parseSubject(params.subject);
  const year = parseYear(params.year);

  if (!form || !subject || !year) {
    return (
      <AppScreen>
        <View style={styles.errorCard}>
          <Text style={styles.error}>Invalid year route.</Text>
        </View>
      </AppScreen>
    );
  }

  const yearPapers = listPapersByFormSubjectYear(papers, form, subject, year);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.badge}>Form {form}</Text>
          <Text style={styles.title}>{subject}</Text>
          <Text style={styles.subtitle}>Papers for {year}</Text>
          <Text style={styles.countLabel}>{yearPapers.length} papers available</Text>
        </View>

        {yearPapers.map((paper) => (
          <ListCard
            key={paper.id}
            title={paper.title}
            subtitle={downloads[paper.id] ? "Saved offline" : "Online preview"}
            rightLabel="Open"
            onPress={() =>
              router.push({
                pathname: "/papers/[paperId]",
                params: { paperId: paper.id },
              })
            }
          />
        ))}

        {!yearPapers.length ? (
          <View style={styles.emptyCard}>
            <Text style={styles.empty}>No papers found for this year.</Text>
          </View>
        ) : null}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 24,
  },
  headerCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D8E2ED",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 6,
  },
  badge: {
    fontSize: 11,
    color: "#0C5D95",
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#162D43",
  },
  subtitle: {
    fontSize: 14,
    color: "#5A6F84",
    lineHeight: 20,
  },
  countLabel: {
    marginTop: 2,
    fontSize: 12,
    color: "#6A7F92",
    fontWeight: "700",
  },
  errorCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3D0D6",
    backgroundColor: "#FFF6F8",
    padding: 14,
  },
  error: {
    fontSize: 14,
    color: "#8E2430",
  },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D8E2ED",
    backgroundColor: "#F8FBFF",
    padding: 14,
  },
  empty: {
    fontSize: 13,
    color: "#667788",
  },
});
