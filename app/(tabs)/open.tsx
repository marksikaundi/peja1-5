import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppScreen } from "@/src/components/AppScreen";
import { ListCard } from "@/src/components/ListCard";
import {
  clearRecentDocuments,
  loadRecentDocuments,
  openRecentDocument,
  pickAndOpenDocument,
  type RecentDocument,
} from "@/src/lib/documents";
import { formatBytes } from "@/src/lib/format";

function toDocumentKind(mimeType: string): string {
  if (mimeType.includes("pdf")) {
    return "PDF";
  }

  if (mimeType.includes("word") || mimeType.includes("document")) {
    return "Word";
  }

  if (mimeType.includes("sheet") || mimeType.includes("excel")) {
    return "Spreadsheet";
  }

  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
    return "Slides";
  }

  if (mimeType.includes("image")) {
    return "Image";
  }

  if (mimeType.includes("text")) {
    return "Text file";
  }

  return "Document";
}

export default function OpenScreen() {
  const [recent, setRecent] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [lastOpenedName, setLastOpenedName] = useState<string | null>(null);

  const loadRecent = useCallback(async () => {
    setLoading(true);
    try {
      const documents = await loadRecentDocuments();
      setRecent(documents);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  const handlePickAndOpen = async () => {
    setOpening(true);

    try {
      const result = await pickAndOpenDocument();
      setRecent(result.recent);
      if (result.opened) {
        setLastOpenedName(result.opened.name);
      }
    } catch {
      Alert.alert("Open failed", "Could not open that document.");
    } finally {
      setOpening(false);
    }
  };

  const handleOpenRecent = async (document: RecentDocument) => {
    setOpening(true);

    try {
      const next = await openRecentDocument(document);
      setRecent(next);
      setLastOpenedName(document.name);
    } catch {
      Alert.alert("Open failed", "Could not reopen that document.");
    } finally {
      setOpening(false);
    }
  };

  const handleClearHistory = async () => {
    await clearRecentDocuments();
    setRecent([]);
  };

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>Quick Access</Text>
          <Text style={styles.title}>Open Any Document</Text>
          <Text style={styles.subtitle}>
            Pick files directly from your device and open them with installed apps.
          </Text>

          <Pressable
            onPress={handlePickAndOpen}
            style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
            disabled={opening}
          >
            <Text style={styles.primaryButtonText}>Choose Document</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/search")}
            style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.secondaryButtonText}>Browse Past Papers</Text>
          </Pressable>

          {lastOpenedName ? (
            <View style={styles.successCard}>
              <Text style={styles.successText}>Last opened: {lastOpenedName}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.recentHeaderRow}>
          <Text style={styles.recentTitle}>Recent Documents</Text>
          {recent.length ? (
            <Pressable onPress={handleClearHistory}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        {loading ? <ActivityIndicator size="small" color="#0F766E" /> : null}
        {opening ? <ActivityIndicator size="small" color="#0F766E" /> : null}

        {recent.map((document) => (
          <ListCard
            key={document.id}
            title={document.name}
            subtitle={`${toDocumentKind(document.mimeType)} • ${formatBytes(document.sizeBytes)}`}
            rightLabel="Open"
            onPress={() => handleOpenRecent(document)}
            disabled={opening}
          >
            <Text style={styles.recentMeta}>
              {new Date(document.lastOpenedAt).toLocaleString()}
            </Text>
          </ListCard>
        ))}

        {!loading && !recent.length ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No recent documents yet. Tap "Choose Document" to get started.
            </Text>
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
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#D5E4EA",
    backgroundColor: "#FFFFFF",
    padding: 18,
    gap: 10,
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0F766E",
    letterSpacing: 0.45,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    color: "#102A43",
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#486581",
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: "center",
    backgroundColor: "#0F766E",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B8D8D5",
    backgroundColor: "#F4FFFD",
  },
  secondaryButtonText: {
    color: "#145A53",
    fontWeight: "800",
    fontSize: 14,
  },
  successCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B8E0D5",
    backgroundColor: "#ECFFF8",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  successText: {
    fontSize: 12,
    color: "#1D6F57",
    fontWeight: "700",
  },
  recentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#102A43",
  },
  clearText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F766E",
  },
  pressed: {
    opacity: 0.88,
  },
  recentMeta: {
    fontSize: 11,
    color: "#829AB1",
    fontWeight: "600",
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9E2EC",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#627D98",
  },
});
