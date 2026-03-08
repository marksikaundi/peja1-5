import { router } from "expo-router";
import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";

interface BackNavProps {
  style?: ViewStyle;
  label?: string;
}

export function BackNav({ style, label = "Back" }: BackNavProps) {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  return (
    <Pressable onPress={handleBack} style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}>
      <Text style={styles.arrow}>←</Text>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#C8D8E8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.8,
  },
  arrow: {
    fontSize: 14,
    color: "#0F5B73",
    fontWeight: "800",
  },
  text: {
    fontSize: 12,
    color: "#0F5B73",
    fontWeight: "800",
  },
});
