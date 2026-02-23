import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

import { AppScreen } from "@/src/components/AppScreen";
import { ListCard } from "@/src/components/ListCard";
import { usePapers } from "@/src/context/PapersContext";
import { listSubjectsByForm } from "@/src/lib/manifest";
import type { FormLevel } from "@/src/types/papers";

function parseForm(form: string | string[] | undefined): FormLevel | null {
  const raw = Array.isArray(form) ? form[0] : form;
  const parsed = Number(raw);

  if (parsed >= 1 && parsed <= 5) {
    return parsed as FormLevel;
  }

  return null;
}

export default function FormSubjectsScreen() {
  const params = useLocalSearchParams<{ form?: string }>();
  const { papers } = usePapers();

  const form = parseForm(params.form);
  if (!form) {
    return (
      <AppScreen>
        <Text style={styles.error}>Invalid form selected.</Text>
      </AppScreen>
    );
  }

  const subjects = listSubjectsByForm(papers, form);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Form {form} Subjects</Text>
        <Text style={styles.subtitle}>Select a subject to view available years.</Text>

        {subjects.map((subject) => (
          <ListCard
            key={subject}
            title={subject}
            subtitle={`Form ${form}`}
            rightLabel="Years"
            onPress={() =>
              router.push({
                pathname: "/forms/[form]/subjects/[subject]",
                params: {
                  form: String(form),
                  subject,
                },
              })
            }
          />
        ))}

        {!subjects.length ? <Text style={styles.empty}>No subjects cached for this form yet.</Text> : null}
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
