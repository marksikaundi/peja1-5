import { StyleSheet, Text, View } from "react-native";

interface StatusBannerProps {
  source: string;
  updatedAt: string;
}

export function StatusBanner({ source, updatedAt }: StatusBannerProps) {
  const normalizedSource =
    source === "remote"
      ? "Live"
      : source === "cache"
        ? "Cached"
        : "Seed";

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Dataset</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{normalizedSource}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : "Unknown"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: "#F2F8FD",
    borderWidth: 1,
    borderColor: "#D1E5F5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    color: "#1D405E",
    fontWeight: "800",
  },
  badge: {
    borderWidth: 1,
    borderColor: "#BFD9EE",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    color: "#0C5E96",
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    color: "#4D6983",
  },
});
