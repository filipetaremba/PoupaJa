const palette = {
  // Vermelho — cor principal
  red50: "#FFF0F1",
  red100: "#FFD6D9",
  red200: "#FF9AA2",
  red400: "#ff505eff",
  red500: "#FF9AA2",
  red600: "#C0121F",
  red700: "#8F0B16",

  // Neutros claros
  white: "#FFFFFF",
  gray50: "#F5F6FA",
  gray100: "#EDEDF2",
  gray200: "#E0E1EA",
  gray300: "#C4C6D4",
  gray400: "#9096A8",
  gray500: "#6B7080",
  gray600: "#4A4F60",
  gray700: "#2E3244",

  // Neutros escuros
  dark50: "#1E2030",
  dark100: "#181A28",
  dark200: "#13151F",
  dark300: "#0E1018",
  dark400: "#090A10",

  // Sucesso
  green400: "#12B76A",
  green50: "#ECFDF3",
  green800: "#054F35",
  greenDark: "#0D9457",
  greenDarkMuted: "#0B3D28",

  // Aviso
  amber400: "#F79009",
  amber50: "#FFFAEB",
  amber800: "#7A2E0E",
  amberDark: "#DC6803",
  amberDarkMuted: "#3D2200",

  // Transparências
  black: "#000000",
  transparent: "transparent",
} as const;

export type ColorScheme = "light" | "dark";

export interface ColorTokens {
  // Marca
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryMuted: string;

  // Fundos
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;

  // Texto
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  textOnDark: string;

  // Bordas
  border: string;
  borderStrong: string;

  // Estados
  success: string;
  successMuted: string;
  successText: string;
  warning: string;
  warningMuted: string;
  warningText: string;
  danger: string;
  dangerMuted: string;
  dangerText: string;

  // Utilitários
  overlay: string;
  white: string;
  black: string;
  transparent: string;
}

const light: ColorTokens = {
  primary: palette.red500,
  primaryDark: palette.red600,
  primaryLight: palette.red400,
  primaryMuted: "rgba(232, 25, 44, 0.10)",

  background: palette.gray50,
  surface: palette.white,
  surfaceSecondary: palette.gray100,
  surfaceElevated: palette.white,

  textPrimary: palette.gray700,
  textSecondary: palette.gray500,
  textMuted: palette.gray400,
  textOnPrimary: palette.white,
  textOnDark: palette.white,

  border: palette.gray200,
  borderStrong: palette.gray300,

  success: palette.green400,
  successMuted: palette.green50,
  successText: palette.green800,
  warning: palette.amber400,
  warningMuted: palette.amber50,
  warningText: palette.amber800,
  danger: palette.red500,
  dangerMuted: "rgba(232, 25, 44, 0.10)",
  dangerText: palette.red700,

  overlay: "rgba(0, 0, 0, 0.40)",
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
};

const dark: ColorTokens = {
  primary: palette.red500,
  primaryDark: palette.red600,
  primaryLight: palette.red400,
  primaryMuted: "rgba(232, 25, 44, 0.15)",

  background: palette.dark300,
  surface: palette.dark100,
  surfaceSecondary: palette.dark200,
  surfaceElevated: palette.dark50,

  textPrimary: palette.gray50,
  textSecondary: palette.gray400,
  textMuted: palette.gray500,
  textOnPrimary: palette.white,
  textOnDark: palette.white,

  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",

  success: palette.greenDark,
  successMuted: palette.greenDarkMuted,
  successText: palette.green400,
  warning: palette.amberDark,
  warningMuted: palette.amberDarkMuted,
  warningText: palette.amber400,
  danger: palette.red500,
  dangerMuted: "rgba(232, 25, 44, 0.15)",
  dangerText: palette.red200,

  overlay: "rgba(0, 0, 0, 0.60)",
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
};

export const colorSchemes = { light, dark } as const;
export { palette };
export default { light, dark };