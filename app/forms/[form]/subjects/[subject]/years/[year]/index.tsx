import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

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
        <Text style={styles.error}>Invalid year route.</Text>
      </AppScreen>
    );
  }

  const yearPapers = listPapersByFormSubjectYear(papers, form, subject, year);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{subject}</Text>
        <Text style={styles.subtitle}>
          Form {form} | {year}
        </Text>

        {yearPapers.map((paper) => (
          <ListCard
            key={paper.id}
            title={paper.title}
            subtitle={downloads[paper.id] ? "Saved offline" : "Online only"}
            rightLabel="Open"
            onPress={() =>
              router.push({
                pathname: "/papers/[paperId]",
                params: { paperId: paper.id },
              })
            }
          />
        ))}

        {!yearPapers.length ? <Text style={styles.empty}>No papers found for this year.</Text> : null}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#13283A",
  },
  subtitle: {
    fontSize: 13,
    color: "#4A6076",
  },
  error: {
    fontSize: 14,
    color: "#8E2430",
  },
  empty: {
    fontSize: 13,
    color: "#667788",
  },
});
