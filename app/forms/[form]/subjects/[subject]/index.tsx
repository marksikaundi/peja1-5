import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

import { AppScreen } from "@/src/components/AppScreen";
import { ListCard } from "@/src/components/ListCard";
import { usePapers } from "@/src/context/PapersContext";
import { listYearsByFormSubject } from "@/src/lib/manifest";
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

export default function SubjectYearsScreen() {
  const params = useLocalSearchParams<{ form?: string; subject?: string }>();
  const { papers } = usePapers();

  const form = parseForm(params.form);
  const subject = parseSubject(params.subject);

  if (!form || !subject) {
    return (
      <AppScreen>
        <Text style={styles.error}>Invalid subject route.</Text>
      </AppScreen>
    );
  }

  const years = listYearsByFormSubject(papers, form, subject);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{subject}</Text>
        <Text style={styles.subtitle}>Form {form} papers by year</Text>

        {years.map((year) => (
          <ListCard
            key={`${subject}-${year}`}
            title={`${year}`}
            subtitle="Open papers"
            rightLabel="Papers"
            onPress={() =>
              router.push({
                pathname: "/forms/[form]/subjects/[subject]/years/[year]",
                params: {
                  form: String(form),
                  subject,
                  year: String(year),
                },
              })
            }
          />
        ))}

        {!years.length ? <Text style={styles.empty}>No papers found for this subject yet.</Text> : null}
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
