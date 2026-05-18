import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useRef, useState } from "react";
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
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const { colors, spacing, radius, fontSize } = useTheme();

  // Estado local — isolado por instância, não afecta outros inputs
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

  // Ref para não depender de re-renders do pai
  const inputRef = useRef<TextInput>(null);

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
            {
              color: colors.textSecondary,
              fontSize: fontSize.sm,
              marginBottom: spacing.sm,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.lg,
            borderWidth: isFocused ? 2 : 1.5,
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
          ref={inputRef}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontSize: fontSize.md,
              flex: 1,
            },
          ]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          // Garante que o teclado não interfere com outros inputs
          blurOnSubmit={false}
          {...rest}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setIsSecure((prev) => !prev)}
            hitSlop={8}
            // Evita que o press propague e active o input pai
            onStartShouldSetResponder={() => true}
          >
            <Ionicons
              name={isSecure ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            hitSlop={8}
            onStartShouldSetResponder={() => true}
          >
            <Ionicons name={rightIcon} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </Pressable>

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
    height: 52,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    paddingVertical: 0,
    // Garante que cada input é independente
    textAlignVertical: "center",
  },
  helperText: {
    fontWeight: "400",
  },
});