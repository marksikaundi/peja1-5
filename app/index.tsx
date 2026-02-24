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
  const {
    papers,
    source,
    lastUpdatedAt,
    loading,
    error,
    refreshManifest,
    downloads,
  } = usePapers();

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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Text style={styles.heroBadge}>ZAMBIA PAST PAPERS</Text>
            <Pressable onPress={refreshManifest} style={styles.syncButton}>
              <Text style={styles.syncButtonText}>Sync Data</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>Study Faster, Even Offline</Text>
          <Text style={styles.subtitle}>
            Form 1 to Form 5 papers by subject and year. Browse quickly and download only what you
            need.
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricChip}>
              <Text style={styles.metricLabel}>Papers</Text>
              <Text style={styles.metricValue}>{papers.length}</Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricLabel}>Offline</Text>
              <Text style={styles.metricValue}>{Object.keys(downloads).length}</Text>
            </View>
          </View>
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

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Choose Form</Text>
          <Text style={styles.sectionMeta}>1 - 5</Text>
        </View>

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
    gap: 14,
    paddingBottom: 24,
  },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D8E2ED",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
    shadowColor: "#12324A",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  heroBadge: {
    fontSize: 10,
    letterSpacing: 0.9,
    fontWeight: "800",
    color: "#0C5D95",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#152A40",
  },
  subtitle: {
    fontSize: 14,
    color: "#587086",
    lineHeight: 21,
  },
  syncButton: {
    borderWidth: 1,
    borderColor: "#BDD9EE",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#EFF8FF",
  },
  syncButtonText: {
    color: "#0D68A8",
    fontWeight: "700",
    fontSize: 12,
  },
  metricsRow: {
    marginTop: 4,
    flexDirection: "row",
    gap: 10,
  },
  metricChip: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6E5F2",
    backgroundColor: "#F7FBFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 2,
  },
  metricLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#56708A",
    fontWeight: "700",
  },
  metricValue: {
    fontSize: 18,
    color: "#16324B",
    fontWeight: "800",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3448",
  },
  sectionMeta: {
    fontSize: 12,
    color: "#6A7F92",
    fontWeight: "700",
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#D8E2ED",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 14,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F3648",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D5DFE9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: "#0F2537",
    backgroundColor: "#FAFCFF",
  },
  searchResult: {
    borderWidth: 1,
    borderColor: "#D2E6F7",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F1F8FF",
  },
  searchResultText: {
    color: "#14558A",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyHint: {
    fontSize: 12,
    color: "#6E7E8D",
  },
  fullSearchButton: {
    marginTop: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#0D68A8",
    alignItems: "center",
  },
  fullSearchText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  error: {
    fontSize: 12,
    color: "#8E2430",
  },
});
