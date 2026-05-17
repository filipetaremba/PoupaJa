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

  const containerStyles: Record<Variant, ViewStyle> = {
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.primaryMuted,
    },
    outline: {
      backgroundColor: colors.transparent,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: colors.transparent,
    },
    danger: {
      backgroundColor: colors.dangerMuted,
    },
  };

  const textColors: Record<Variant, string> = {
    primary: colors.textOnPrimary,
    secondary: colors.primary,
    outline: colors.primary,
    ghost: colors.primary,
    danger: colors.danger,
  };

  const sizeStyles: Record<Size, { container: ViewStyle; text: TextStyle }> = {
    sm: {
      container: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.md },
      text: { fontSize: fontSize.sm },
    },
    md: {
      container: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: radius.lg },
      text: { fontSize: fontSize.md },
    },
    lg: {
      container: { paddingVertical: 18, paddingHorizontal: 24, borderRadius: radius.xl },
      text: { fontSize: fontSize.lg },
    },
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        containerStyles[variant],
        sizeStyles[size].container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColors[variant]}
        />
      ) : (
        <Text
          style={[
            styles.label,
            { color: textColors[variant], fontWeight: fontWeight.semibold },
            sizeStyles[size].text,
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
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  label: {
    letterSpacing: 0.2,
  },
});