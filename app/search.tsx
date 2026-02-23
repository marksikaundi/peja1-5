import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput } from "react-native";

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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Subject Search</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search e.g. Mathematics"
          placeholderTextColor="#7A8C9D"
          style={styles.input}
          autoFocus
          autoCapitalize="words"
        />

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
          <Text style={styles.empty}>No results found in local cache.</Text>
        ) : null}
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
  input: {
    borderWidth: 1,
    borderColor: "#CDD8E2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F2537",
    backgroundColor: "#FFFFFF",
  },
  empty: {
    fontSize: 13,
    color: "#667788",
  },
});
