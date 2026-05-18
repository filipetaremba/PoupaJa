import { useColorScheme } from "react-native";
import { colorSchemes, type ColorTokens } from "./colors";

// --- Tokens estáticos (independentes do tema) ---

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screen: 18, // padding horizontal de todos os ecrãs
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
} as const;

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

export const getShadow = (colors: ColorTokens) => ({
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
});

// --- Hook principal ---

export interface AppTheme {
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  shadow: ReturnType<typeof getShadow>;
  isDark: boolean;
}

export function useTheme(): AppTheme {
  const scheme = useColorScheme(); // deteta "light" | "dark" | null do sistema
  const isDark = scheme === "light";
  const colors = isDark ? colorSchemes.dark : colorSchemes.light;

  return {
    colors,
    spacing,
    radius,
    fontSize,
    fontWeight,
    shadow: getShadow(colors),
    isDark,
  };
}