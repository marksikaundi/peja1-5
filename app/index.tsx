import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import { AppScreen } from "@/src/components/AppScreen";
import { ListCard } from "@/src/components/ListCard";
import { StatusBanner } from "@/src/components/StatusBanner";
import { usePapers } from "@/src/context/PapersContext";

const FORMS = [1, 2, 3, 4, 5] as const;

export default function IndexScreen() {
  const [query, setQuery] = useState("");
  const { papers, source, lastUpdatedAt, loading, error, refreshManifest } = usePapers();

  const matchedSubjects = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const uniqueSubjects = new Set(
      papers
        .map((paper) => paper.subject)
        .filter((subject) => subject.toLowerCase().includes(query.trim().toLowerCase())),
    );

    return [...uniqueSubjects].sort((a, b) => a.localeCompare(b)).slice(0, 8);
  }, [papers, query]);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>Zambia Past Papers</Text>
            <Text style={styles.subtitle}>Forms 1-5 | New Curriculum | Offline-first</Text>
          </View>
          <Pressable onPress={refreshManifest} style={styles.syncButton}>
            <Text style={styles.syncButtonText}>Sync</Text>
          </Pressable>
        </View>

        <StatusBanner source={source} updatedAt={lastUpdatedAt} />

        <View style={styles.searchBox}>
          <Text style={styles.sectionLabel}>Search by Subject</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Type subject name..."
            placeholderTextColor="#7A8C9D"
            style={styles.input}
            autoCapitalize="words"
          />
          {matchedSubjects.map((subject) => (
            <Pressable
              key={subject}
              style={styles.searchResult}
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: { q: subject },
                })
              }
            >
              <Text style={styles.searchResultText}>{subject}</Text>
            </Pressable>
          ))}
          {!!query.trim() && matchedSubjects.length === 0 ? (
            <Text style={styles.emptyHint}>No matching subject in local cache.</Text>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>Select Form</Text>
        {FORMS.map((form) => (
          <ListCard
            key={form}
            title={`Form ${form}`}
            subtitle="Browse subjects and exam years"
            rightLabel="Open"
            onPress={() =>
              router.push({
                pathname: "/forms/[form]",
                params: { form: String(form) },
              })
            }
          />
        ))}

        <Pressable onPress={() => router.push("/search")} style={styles.fullSearchButton}>
          <Text style={styles.fullSearchText}>Open Full Subject Search</Text>
        </Pressable>

        {loading ? <ActivityIndicator size="small" color="#0D68A8" /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#13283A",
  },
  subtitle: {
    fontSize: 13,
    color: "#496177",
  },
  syncButton: {
    borderWidth: 1,
    borderColor: "#0F6AAB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  syncButtonText: {
    color: "#0D68A8",
    fontWeight: "700",
    fontSize: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F3648",
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#D5DDE5",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CDD8E2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F2537",
    backgroundColor: "#FBFCFD",
  },
  searchResult: {
    borderWidth: 1,
    borderColor: "#CBE2F4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F2F9FF",
  },
  searchResultText: {
    color: "#14558A",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyHint: {
    fontSize: 12,
    color: "#6E7E8D",
  },
  fullSearchButton: {
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#0D68A8",
    alignItems: "center",
  },
  fullSearchText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  error: {
    fontSize: 12,
    color: "#8E2430",
  },
});
