import { View, Text, StyleSheet, type ViewStyle } from "react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "@/constants/theme";
import { formatarPercentagem } from "@/lib/formatters";

interface ProgressBarProps {
  value: number;        // 0–100
  showLabel?: boolean;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function ProgressBar({
  value,
  showLabel = false,
  height = 8,
  animated = true,
  style,
}: ProgressBarProps) {
  const { colors, radius, spacing } = useTheme();
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedValue,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedValue);
    }
  }, [clampedValue, animated]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  // Cor da barra muda conforme o progresso
  const barColor =
    clampedValue >= 100
      ? colors.success
      : clampedValue >= 60
      ? colors.primary
      : clampedValue >= 30
      ? colors.warning
      : colors.danger;

  return (
    <View style={[styles.wrapper, style]}>
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: barColor, marginBottom: spacing.xs },
          ]}
        >
          {formatarPercentagem(clampedValue)}
        </Text>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceSecondary,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolated,
              height,
              borderRadius: radius.full,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
  },
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {},
});