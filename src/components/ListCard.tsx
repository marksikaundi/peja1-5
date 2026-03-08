import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

interface ListCardProps {
  title: string;
  subtitle?: string;
  rightLabel?: string;
  onPress?: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

export function ListCard({
  title,
  subtitle,
  rightLabel,
  onPress,
  disabled,
  children,
}: ListCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9E2EC",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 13,
    gap: 8,
    shadowColor: "#102A43",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.998 }],
  },
  disabled: {
    opacity: 0.45,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#102A43",
  },
  subtitle: {
    fontSize: 13,
    color: "#486581",
  },
  rightLabel: {
    fontSize: 11,
    color: "#0F766E",
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    backgroundColor: "#EBFDF9",
    borderWidth: 1,
    borderColor: "#C4EFE6",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
