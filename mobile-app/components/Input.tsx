import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  ...rest
}: InputProps) {
  const { colors, spacing, radius, fontSize } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

  const hasError = !!error;
  const isPassword = secureTextEntry;

  const borderColor = hasError
    ? colors.danger
    : isFocused
    ? colors.primary
    : colors.border;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.lg,
          },
          isFocused && {
            shadowColor: hasError ? colors.danger : colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 2,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontSize: fontSize.md,
              flex: 1,
            },
          ]}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          {...rest}
        />

        {isPassword ? (
          <Pressable onPress={() => setIsSecure((prev) => !prev)} hitSlop={8}>
            <Ionicons
              name={isSecure ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={8}>
            <Ionicons name={rightIcon} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {(error || hint) && (
        <Text
          style={[
            styles.helperText,
            {
              color: hasError ? colors.danger : colors.textMuted,
              fontSize: fontSize.xs,
              marginTop: spacing.sm,
            },
          ]}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    height: 52,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    paddingVertical: 0,
  },
  helperText: {
    fontWeight: "400",
  },
});