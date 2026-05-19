import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { useTheme } from "@/constants/theme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = true,
  disabled,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const { colors, radius, fontSize, fontWeight } = useTheme();

  const isDisabled = disabled || loading;

  const bgColor: Record<Variant, string> = {
    primary:   colors.primary,
    secondary: colors.primaryMuted,
    outline:   colors.transparent,
    ghost:     colors.transparent,
    danger:    colors.dangerMuted,
  };

  const textColor: Record<Variant, string> = {
    primary:   colors.textOnPrimary,
    secondary: colors.primary,
    outline:   colors.primary,
    ghost:     colors.primary,
    danger:    colors.danger,
  };

  const sizeContainer: Record<Size, ViewStyle> = {
    sm: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.md },
    md: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: radius.lg },
    lg: { paddingVertical: 18, paddingHorizontal: 24, borderRadius: radius.xl },
  };

  const sizeText: Record<Size, TextStyle> = {
    sm: { fontSize: fontSize.sm },
    md: { fontSize: fontSize.md },
    lg: { fontSize: fontSize.lg },
  };

  // Estilo estático — backgroundColor aqui, fora da função pressed
  const staticStyle: ViewStyle = {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: bgColor[variant],   // ← sempre aplicado
    ...sizeContainer[size],
    ...(variant === "outline" ? { borderWidth: 1.5, borderColor: colors.primary } : {}),
    ...(fullWidth ? { width: "100%" } : {}),
    ...(isDisabled ? { opacity: 0.5 } : {}),
    ...style,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        staticStyle,
        // só opacity/scale mudam com pressed — não toca no backgroundColor
        pressed && !isDisabled && { opacity: 0.85, transform: [{ scale: 0.985 }] },
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor[variant]} />
      ) : (
        <Text
          style={[
            styles.label,
            { color: textColor[variant], fontWeight: fontWeight.semibold },
            sizeText[size],
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    letterSpacing: 0.2,
  },
});