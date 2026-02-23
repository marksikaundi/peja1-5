import { SafeAreaView, StyleSheet, View, type ViewStyle } from "react-native";
import type { PropsWithChildren } from "react";

interface AppScreenProps extends PropsWithChildren {
  style?: ViewStyle;
}

export function AppScreen({ children, style }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
});
