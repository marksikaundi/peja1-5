import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PropsWithChildren } from "react";

interface AppScreenProps extends PropsWithChildren {
  style?: ViewStyle;
}

export function AppScreen({ children, style }: AppScreenProps) {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View pointerEvents="none" style={styles.backgroundGlowTop} />
      <View pointerEvents="none" style={styles.backgroundGlowBottom} />
      <View style={styles.container}>
        <View style={[styles.content, style]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7F7",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 98 : 86,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    gap: 14,
  },
  backgroundGlowTop: {
    position: "absolute",
    top: -110,
    right: -20,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "#D8F4F0",
  },
  backgroundGlowBottom: {
    position: "absolute",
    bottom: 10,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#E2EEF9",
  },
});
