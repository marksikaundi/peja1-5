import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/src/components/AppScreen";

const APP_VERSION = "v1 (MVP)";

export default function AboutScreen() {
  const openUploadThing = async () => {
    await Linking.openURL("https://uploadthing.com");
  };

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>About</Text>
          <Text style={styles.title}>Zambia Past Papers</Text>
          <Text style={styles.subtitle}>
            Offline-first paper access for Form 1 to Form 5, designed for simple navigation and low
            data usage.
          </Text>
          <Text style={styles.version}>{APP_VERSION}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What this app does</Text>
          <Text style={styles.infoItem}>• Browse by Form, Subject, and Year</Text>
          <Text style={styles.infoItem}>• Preview PDFs inside the app</Text>
          <Text style={styles.infoItem}>• Save papers for offline access</Text>
          <Text style={styles.infoItem}>• Search by subject instantly</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Powered By</Text>
          <Text style={styles.infoItem}>• Expo + React Native</Text>
          <Text style={styles.infoItem}>• Peja backend manifest API</Text>
          <Text style={styles.infoItem}>• UploadThing for file storage</Text>

          <Pressable style={styles.linkButton} onPress={openUploadThing}>
            <Text style={styles.linkButtonText}>Visit UploadThing</Text>
          </Pressable>
        </View>
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
  version: {
    marginTop: 4,
    fontSize: 12,
    color: "#6A7F92",
    fontWeight: "700",
  },
  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8E2ED",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3448",
  },
  infoItem: {
    fontSize: 14,
    color: "#556D83",
    lineHeight: 20,
  },
  linkButton: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0D68A8",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#F1F8FF",
  },
  linkButtonText: {
    color: "#0D68A8",
    fontSize: 13,
    fontWeight: "800",
  },
});
