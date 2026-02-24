import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/src/components/AppScreen";
import { BackNav } from "@/src/components/BackNav";
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
        <View style={styles.errorCard}>
          <Text style={styles.error}>Invalid form selected.</Text>
        </View>
      </AppScreen>
    );
  }

  const subjects = listSubjectsByForm(papers, form);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <BackNav style={styles.backButton} />
          <Text style={styles.badge}>Form {form}</Text>
          <Text style={styles.title}>Choose a Subject</Text>
          <Text style={styles.subtitle}>Select a subject to view available exam years.</Text>
          <Text style={styles.countLabel}>{subjects.length} subjects available</Text>
        </View>

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

        {!subjects.length ? (
          <View style={styles.emptyCard}>
            <Text style={styles.empty}>No subjects cached for this form yet.</Text>
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
  backButton: {
    marginBottom: 2,
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
