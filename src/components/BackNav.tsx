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
    borderColor: "#D2DFEC",
    backgroundColor: "#F7FBFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.85,
  },
  arrow: {
    fontSize: 14,
    color: "#195887",
    fontWeight: "800",
  },
  text: {
    fontSize: 12,
    color: "#195887",
    fontWeight: "800",
  },
});
