import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { ProgressBar } from "../ProgressBar";
import { Badge } from "../Badge";
import { formatarMoeda, formatarDias } from "@/lib/formatters";
import { calcularProgresso } from "@/lib/calculos";
import type { Caixinha } from "@/types";

interface CaixinhaCardProps {
  caixinha: Caixinha;
  onPress: () => void;
}

export function CaixinhaCard({ caixinha, onPress }: CaixinhaCardProps) {
  const { colors, spacing, radius, fontSize, fontWeight, shadow } = useTheme();
  const progresso = calcularProgresso(caixinha);

  const badgeVariant =
    caixinha.estado === "concluida"
      ? "success"
      : caixinha.estado === "cancelada"
      ? "danger"
      : "primary";

  const badgeLabel =
    caixinha.estado === "concluida"
      ? "Concluída"
      : caixinha.estado === "cancelada"
      ? "Cancelada"
      : "Activa";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          // surfaceSecondary é mais escuro que surface em light, mais claro em dark
          // dá esse efeito de "card delimitado" sem cor fixa
          backgroundColor: colors.surfaceSecondary,
          borderRadius: radius.xl,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadow.sm,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      onPress={onPress}
    >
      {/* Topo */}
      <View style={styles.top}>
        <View
          style={[
            styles.iconWrap,
            {
              // surface (mais claro) contrasta com o fundo surfaceSecondary
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="wallet-outline" size={22} color={colors.primary} />
        </View>

        <View style={styles.titleWrap}>
          <Text
            style={[
              styles.nome,
              {
                color: colors.textPrimary,
                fontSize: fontSize.lg,
                fontWeight: fontWeight.semibold,
              },
            ]}
            numberOfLines={1}
          >
            {caixinha.nome}
          </Text>
          <Text
            style={[
              styles.diario,
              { color: colors.textMuted, fontSize: fontSize.sm },
            ]}
          >
            {formatarMoeda(caixinha.valorDiario)}/dia
          </Text>
        </View>

        <Badge label={badgeLabel} variant={badgeVariant} />
      </View>

      {/* Progresso */}
      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <ProgressBar value={progresso.percentagem} animated />

        <View style={styles.statsRow}>
          <Text
            style={[
              styles.stat,
              { color: colors.textSecondary, fontSize: fontSize.sm },
            ]}
          >
            {formatarMoeda(caixinha.valorAcumulado)} de{" "}
            {formatarMoeda(caixinha.valorObjetivo)}
          </Text>
          <View style={styles.diasWrap}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text
              style={[
                styles.stat,
                { color: colors.textMuted, fontSize: fontSize.sm },
              ]}
            >
              {formatarDias(progresso.diasRestantesEstimados)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {},
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  nome: {},
  diario: {},
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stat: {},
  diasWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});