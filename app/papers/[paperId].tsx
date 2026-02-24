import { useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
        <View style={styles.errorCard}>
          <Text style={styles.error}>Paper not found.</Text>
        </View>
      </AppScreen>
    );
  }

  const previewInApp = async () => {
    try {
      await WebBrowser.openBrowserAsync(paper.pdfUrl, {
        showTitle: true,
        enableBarCollapsing: true,
      });
    } catch {
      Alert.alert("Preview failed", "Could not open in-app preview.");
    }
  };

  const openWithExternalApp = async () => {
    try {
      await Linking.openURL(paper.pdfUrl);
    } catch {
      Alert.alert("Open failed", "Could not open with external app.");
    }
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.badge}>Paper Detail</Text>
          <Text style={styles.title}>{paper.title}</Text>
          <Text style={styles.subtitle}>Preview opens in app first. Offline save is optional.</Text>
        </View>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Form</Text>
            <Text style={styles.metaValue}>{paper.form}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Subject</Text>
            <Text style={styles.metaValue}>{paper.subject}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Year</Text>
            <Text style={styles.metaValue}>{paper.year}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Size</Text>
            <Text style={styles.metaValue}>{formatBytes(downloadRecord?.sizeBytes ?? paper.sizeBytes)}</Text>
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={previewInApp}>
          <Text style={styles.primaryButtonText}>Preview PDF (In App)</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={openWithExternalApp}>
          <Text style={styles.secondaryButtonText}>Open with External App</Text>
        </Pressable>

        {downloadRecord ? (
          <>
            <Pressable style={styles.secondaryMutedButton} onPress={openOffline}>
              <Text style={styles.secondaryMutedButtonText}>Open Offline Copy</Text>
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
          <View style={styles.savedCard}>
            <Text style={styles.savedMeta}>
              Saved on: {new Date(downloadRecord.downloadedAt).toLocaleString()}
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
  metaCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8E2ED",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D9E4EE",
  },
  metaLabel: {
    fontSize: 13,
    color: "#5A6F84",
    fontWeight: "700",
  },
  metaValue: {
    fontSize: 14,
    color: "#1C3349",
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "right",
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: "center",
    backgroundColor: "#0D68A8",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0D68A8",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#0D68A8",
    fontWeight: "800",
    fontSize: 14,
  },
  secondaryMutedButton: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8AA3B7",
    backgroundColor: "#FFFFFF",
  },
  secondaryMutedButtonText: {
    color: "#36556D",
    fontWeight: "800",
    fontSize: 14,
  },
  dangerButton: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4B7BE",
    backgroundColor: "#FFF5F7",
  },
  dangerButtonText: {
    color: "#9D2630",
    fontWeight: "800",
    fontSize: 14,
  },
  savedCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFE5D8",
    backgroundColor: "#F1FBF6",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  savedMeta: {
    fontSize: 12,
    color: "#3B6A56",
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
});
