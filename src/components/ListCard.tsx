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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8E2ED",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    shadowColor: "#17324A",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
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
    fontSize: 16.5,
    fontWeight: "700",
    color: "#162B40",
  },
  subtitle: {
    fontSize: 13.5,
    color: "#5A6F84",
  },
  rightLabel: {
    fontSize: 11,
    color: "#0B5D95",
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    backgroundColor: "#E9F4FD",
    borderWidth: 1,
    borderColor: "#C9E2F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
