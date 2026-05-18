import { View, Text, Pressable, StyleSheet, type ViewStyle } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
  transparent?: boolean;
}

export function Header({
  title,
  showBack = false,
  onBack,
  rightElement,
  style,
  transparent = false,
}: HeaderProps) {
  const { colors, spacing, fontSize, radius } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          backgroundColor: transparent ? colors.transparent : colors.background,
        },
        style,
      ]}
    >
      {/* Lado esquerdo */}
      <View style={styles.side}>
        {showBack && (
          <Pressable
            onPress={handleBack}
            hitSlop={8}
            style={[
              styles.backBtn,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="arrow-back-outline" size={20} color={colors.textPrimary} />
          </Pressable>
        )}
      </View>

      {/* Centro */}
      {title && (
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontSize: fontSize.lg,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}

      {/* Lado direito */}
      <View style={[styles.side, styles.right]}>
        {rightElement ?? null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  side: {
    width: 40,
    alignItems: "flex-start",
  },
  right: {
    alignItems: "flex-end",
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
});