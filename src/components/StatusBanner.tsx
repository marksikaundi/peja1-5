import { StyleSheet, Text, View } from "react-native";

interface StatusBannerProps {
  source: string;
  updatedAt: string;
}

export function StatusBanner({ source, updatedAt }: StatusBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Source: {source.toUpperCase()}</Text>
      <Text style={styles.subtitle}>
        Last Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : "Unknown"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: "#E9F5FF",
    borderWidth: 1,
    borderColor: "#BEDFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  title: {
    fontSize: 12,
    color: "#0E4E85",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    color: "#2F5D82",
  },
});
