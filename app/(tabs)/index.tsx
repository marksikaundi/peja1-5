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
            <Text style={styles.heroBadge}>Document Hub</Text>
            <Pressable onPress={refreshManifest} style={styles.syncButton}>
              <Text style={styles.syncButtonText}>Refresh</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>Clean, Fast, and Ready to Open Files</Text>
          <Text style={styles.subtitle}>
            Open any document from your device or browse past papers by form, subject, and year.
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricChip}>
              <Text style={styles.metricLabel}>Catalog</Text>
              <Text style={styles.metricValue}>{papers.length}</Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricLabel}>Offline</Text>
              <Text style={styles.metricValue}>{Object.keys(downloads).length}</Text>
            </View>
          </View>
        </View>

        <StatusBanner source={source} updatedAt={lastUpdatedAt} />

        <View style={styles.actionsRow}>
          <Pressable style={styles.primaryAction} onPress={() => router.push("/open")}>
            <Text style={styles.primaryActionText}>Open Any Document</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={() => router.push("/search")}>
            <Text style={styles.secondaryActionText}>Search Papers</Text>
          </Pressable>
        </View>

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
          <Text style={styles.sectionTitle}>Browse by Form</Text>
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

        {loading ? <ActivityIndicator size="small" color="#0F766E" /> : null}
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#D5E4EA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 10,
    shadowColor: "#12343B",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 14,
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
    color: "#0F766E",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    color: "#102A43",
  },
  subtitle: {
    fontSize: 14,
    color: "#486581",
    lineHeight: 21,
  },
  syncButton: {
    borderWidth: 1,
    borderColor: "#B8D8D5",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F3FFFC",
  },
  syncButtonText: {
    color: "#145A53",
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
    borderColor: "#DBE7F3",
    backgroundColor: "#F8FCFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 2,
  },
  metricLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#627D98",
    fontWeight: "700",
  },
  metricValue: {
    fontSize: 18,
    color: "#102A43",
    fontWeight: "800",
  },
  actionsRow: {
    gap: 10,
  },
  primaryAction: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#0F766E",
    alignItems: "center",
  },
  primaryActionText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  secondaryAction: {
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#B6D0CC",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  secondaryActionText: {
    fontSize: 14,
    color: "#145A53",
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
    color: "#102A43",
  },
  sectionMeta: {
    fontSize: 12,
    color: "#627D98",
    fontWeight: "700",
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#D9E2EC",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 14,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#102A43",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D9E2EC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: "#102A43",
    backgroundColor: "#F8FBFC",
  },
  searchResult: {
    borderWidth: 1,
    borderColor: "#CFE6E2",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F3FFFC",
  },
  searchResultText: {
    color: "#145A53",
    fontSize: 13,
    fontWeight: "800",
  },
  emptyHint: {
    fontSize: 12,
    color: "#627D98",
  },
  error: {
    fontSize: 12,
    color: "#8E2430",
  },
});
