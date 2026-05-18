import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/constants/theme";

interface SafeScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export function SafeScreen({
  children,
  scroll = false,
  style,
  contentStyle,
  edges = ["top", "bottom"],
}: SafeScreenProps) {
  const { colors, spacing } = useTheme();

  const content = scroll ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        { paddingHorizontal: spacing.xl },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }, style]}
      edges={edges}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
});