import { useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { AppScreen } from "@/src/components/AppScreen";
import { usePapers } from "@/src/context/PapersContext";
import { formatBytes } from "@/src/lib/format";

function parsePaperId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default function PaperDetailScreen() {
  const params = useLocalSearchParams<{ paperId?: string }>();
  const paperId = parsePaperId(params.paperId);
  const {
    getPaperById,
    downloads,
    savePaperOffline,
    removeOfflinePaper,
    activeDownloadIds,
  } = usePapers();
  const [busy, setBusy] = useState(false);

  const paper = getPaperById(paperId);
  const downloadRecord = downloads[paperId];
  const isDownloading = useMemo(
    () => activeDownloadIds.includes(paperId),
    [activeDownloadIds, paperId],
  );

  if (!paper) {
    return (
      <AppScreen>
        <Text style={styles.error}>Paper not found.</Text>
      </AppScreen>
    );
  }

  const openOnline = async () => {
    await Linking.openURL(paper.pdfUrl);
  };

  const openOffline = async () => {
    if (!downloadRecord) {
      return;
    }

    await Linking.openURL(downloadRecord.localUri);
  };

  const handleSaveOffline = async () => {
    setBusy(true);
    try {
      await savePaperOffline(paper);
      Alert.alert("Saved", "Paper downloaded for offline access.");
    } catch {
      Alert.alert("Download failed", "Could not save this paper offline.");
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveOffline = async () => {
    setBusy(true);
    try {
      await removeOfflinePaper(paper.id);
      Alert.alert("Removed", "Offline copy has been deleted.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{paper.title}</Text>
        <Text style={styles.meta}>Form {paper.form}</Text>
        <Text style={styles.meta}>Subject: {paper.subject}</Text>
        <Text style={styles.meta}>Year: {paper.year}</Text>
        <Text style={styles.meta}>Size: {formatBytes(downloadRecord?.sizeBytes ?? paper.sizeBytes)}</Text>

        <Pressable style={styles.primaryButton} onPress={openOnline}>
          <Text style={styles.primaryButtonText}>View PDF (Online)</Text>
        </Pressable>

        {downloadRecord ? (
          <>
            <Pressable style={styles.secondaryButton} onPress={openOffline}>
              <Text style={styles.secondaryButtonText}>Open Offline Copy</Text>
            </Pressable>
            <Pressable style={styles.dangerButton} onPress={handleRemoveOffline} disabled={busy}>
              <Text style={styles.dangerButtonText}>Remove Offline Copy</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={styles.secondaryButton}
            onPress={handleSaveOffline}
            disabled={busy || isDownloading}
          >
            <Text style={styles.secondaryButtonText}>Save for Offline</Text>
          </Pressable>
        )}

        {busy || isDownloading ? <ActivityIndicator size="small" color="#0D68A8" /> : null}

        {downloadRecord ? (
          <Text style={styles.savedMeta}>
            Saved on: {new Date(downloadRecord.downloadedAt).toLocaleString()}
          </Text>
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
  meta: {
    fontSize: 14,
    color: "#3D556B",
  },
  primaryButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    backgroundColor: "#0D68A8",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0D68A8",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#0D68A8",
    fontWeight: "700",
    fontSize: 14,
  },
  dangerButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A11A1A",
    backgroundColor: "#FFF5F5",
  },
  dangerButtonText: {
    color: "#A11A1A",
    fontWeight: "700",
    fontSize: 14,
  },
  savedMeta: {
    fontSize: 12,
    color: "#526578",
  },
  error: {
    fontSize: 14,
    color: "#8E2430",
  },
});
