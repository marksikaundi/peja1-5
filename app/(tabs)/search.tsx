import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen } from "@/src/components/AppScreen";
import { BackNav } from "@/src/components/BackNav";
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
          <BackNav style={styles.backButton} />
          <Text style={styles.badge}>Find</Text>
          <Text style={styles.title}>Find by Subject</Text>
          <Text style={styles.subtitle}>Search through cached papers, or open your own files.</Text>
          <Pressable style={styles.openDocsButton} onPress={() => router.push("/open")}>
            <Text style={styles.openDocsText}>Open Any Document</Text>
          </Pressable>
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
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D5E4EA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 6,
  },
  backButton: {
    marginBottom: 2,
  },
  badge: {
    fontSize: 11,
    color: "#0F766E",
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#102A43",
  },
  subtitle: {
    fontSize: 14,
    color: "#486581",
    lineHeight: 20,
  },
  openDocsButton: {
    marginTop: 6,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#B8D8D5",
    backgroundColor: "#F3FFFC",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  openDocsText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#145A53",
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#D9E2EC",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 12,
    gap: 8,
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
  resultMeta: {
    fontSize: 12,
    color: "#627D98",
    fontWeight: "700",
  },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9E2EC",
    backgroundColor: "#FFFFFF",
    padding: 14,
  },
  empty: {
    fontSize: 13,
    color: "#627D98",
  },
});
