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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D5DDE5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2733",
  },
  subtitle: {
    fontSize: 13,
    color: "#4D5E70",
  },
  rightLabel: {
    fontSize: 12,
    color: "#0D68A8",
    fontWeight: "700",
  },
});
