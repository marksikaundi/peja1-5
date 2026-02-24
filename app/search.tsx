import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen } from "@/src/components/AppScreen";
import { ListCard } from "@/src/components/ListCard";
import { usePapers } from "@/src/context/PapersContext";
import { searchPapersBySubject } from "@/src/lib/manifest";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState<string>(params.q ?? "");
  const { papers, downloads } = usePapers();

  const results = useMemo(() => searchPapersBySubject(papers, query), [papers, query]);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.badge}>Search</Text>
          <Text style={styles.title}>Find by Subject</Text>
          <Text style={styles.subtitle}>Search through locally cached papers by subject name.</Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search e.g. Mathematics"
            placeholderTextColor="#7A8C9D"
            style={styles.input}
            autoFocus
            autoCapitalize="words"
          />
          <Text style={styles.resultMeta}>{results.length} result(s)</Text>
        </View>

        {results.map((paper) => (
          <ListCard
            key={paper.id}
            title={paper.subject}
            subtitle={`Form ${paper.form} | ${paper.year} | ${paper.title}`}
            rightLabel={downloads[paper.id] ? "Offline" : "Open"}
            onPress={() =>
              router.push({
                pathname: "/papers/[paperId]",
                params: { paperId: paper.id },
              })
            }
          />
        ))}

        {query.trim() && !results.length ? (
          <View style={styles.emptyCard}>
            <Text style={styles.empty}>No results found in local cache.</Text>
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
  searchBox: {
    borderWidth: 1,
    borderColor: "#D8E2ED",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 12,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3DEE8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: "#0F2537",
    backgroundColor: "#FAFCFF",
  },
  resultMeta: {
    fontSize: 12,
    color: "#607487",
    fontWeight: "700",
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
