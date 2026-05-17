import { View, Text, StyleSheet, type ViewStyle } from "react-native";
import { useTheme } from "@/constants/theme";

type BadgeVariant = "success" | "warning" | "danger" | "primary" | "neutral";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = "neutral", style }: BadgeProps) {
  const { colors, radius, fontSize } = useTheme();

  const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
    success: { bg: colors.successMuted, text: colors.successText },
    warning: { bg: colors.warningMuted, text: colors.warningText },
    danger:  { bg: colors.dangerMuted,  text: colors.dangerText },
    primary: { bg: colors.primaryMuted, text: colors.primary },
    neutral: { bg: colors.surfaceSecondary, text: colors.textSecondary },
  };

  const { bg, text } = variantStyles[variant];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, borderRadius: radius.full },
        style,
      ]}
    >
      <Text style={[styles.label, { color: text, fontSize: fontSize.xs }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});