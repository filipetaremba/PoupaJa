import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";

import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { SafeScreen } from "@/components/layout/Safescreen";
import { Header } from "@react-navigation/elements";
import { ProgressBar } from "@/components/ProgressBar";
import { useCaixinha } from "@/hooks/useCaixinha";
import { useDebito } from "@/hooks/useDebito";
import {
  formatarMoeda,
  formatarPercentagem,
  formatarDias,
  formatarDataRelativa,
} from "@/lib/formatters";

export default function CaixinhaDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, radius, fontSize, fontWeight, shadow } = useTheme();
  const {
    caixinha,
    contribuicoes,
    progresso,
    concluida,
    simularLevantamentoAtual,
  } = useCaixinha(id);
  const { contribuirManual, levantarAntecipado } = useDebito();

  if (!caixinha || !progresso) {
    return (
      <SafeScreen>
        <Header showBack title="Caixinha" />
        <View style={styles.notFound}>
          <Text style={{ color: colors.textSecondary }}>
            Caixinha não encontrada.
          </Text>
        </View>
      </SafeScreen>
    );
  }

  const handleLevantamento = () => {
    if (caixinha.valorAcumulado <= 0) return;

    const sim = simularLevantamentoAtual(caixinha.valorAcumulado);

    Alert.alert(
      "Levantar antecipadamente?",
      `Valor bruto: ${formatarMoeda(sim.valorBruto)}\nPenalização (10%): ${formatarMoeda(sim.valorPenalizacao)}\nVai receber: ${formatarMoeda(sim.valorLiquido)}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar levantamento",
          style: "destructive",
          onPress: () => {
            levantarAntecipado(
              caixinha,
              caixinha.valorAcumulado,
              sim.valorPenalizacao
            );
            router.back();
          },
        },
      ]
    );
  };

  const handleContribuicaoManual = () => {
    Alert.prompt(
      "Contribuição manual",
      "Insere o valor que queres adicionar (MT):",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Adicionar",
          onPress: (valor: string | undefined) => {
            const num = parseFloat(valor ?? "0");
            if (num > 0) contribuirManual(caixinha, num);
          },
        },
      ],
      "plain-text",
      "",
      "numeric"
    );
  };

  return (
    <SafeScreen edges={["top"]}>
      <Header showBack title={caixinha.nome} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: spacing.screen,
            paddingBottom: spacing.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card principal */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.xxl,
              padding: spacing.xl,
              marginBottom: spacing.xl,
              ...shadow.lg,
              overflow: "hidden",
            },
          ]}
        >
          <View
            style={[
              styles.circle,
              { backgroundColor: colors.primaryLight, opacity: 0.2 },
            ]}
          />

          <View style={styles.heroTop}>
            <View
              style={[
                styles.heroIcon,
                {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: radius.md,
                },
              ]}
            >
              <Ionicons name="wallet-outline" size={24} color={colors.white} />
            </View>
            <Badge
              label={concluida ? "Concluída 🎉" : "Activa"}
              variant={concluida ? "success" : "neutral"}
            />
          </View>

          <Text
            style={[
              styles.heroValor,
              {
                color: colors.white,
                fontSize: fontSize.xxxl,
                fontWeight: fontWeight.extrabold,
              },
            ]}
          >
            {formatarMoeda(caixinha.valorAcumulado)}
          </Text>
          <Text
            style={[
              styles.heroSub,
              { color: "rgba(255,255,255,0.7)", fontSize: fontSize.sm },
            ]}
          >
            de {formatarMoeda(caixinha.valorObjetivo)} ·{" "}
            {formatarPercentagem(progresso.percentagem)}
          </Text>

          <View style={{ marginTop: spacing.lg }}>
            <ProgressBar value={progresso.percentagem} height={10} animated />
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsGrid, { marginBottom: spacing.xl }]}>
          {[
            {
              icon: "calendar-outline",
              label: "Valor diário",
              valor: formatarMoeda(caixinha.valorDiario),
            },
            {
              icon: "time-outline",
              label: "Dias restantes",
              valor: formatarDias(progresso.diasRestantesEstimados),
            },
            {
              icon: "trending-up-outline",
              label: "Em falta",
              valor: formatarMoeda(progresso.valorEmFalta),
            },
            {
              icon: "layers-outline",
              label: "Contribuições",
              valor: `${contribuicoes.length}`,
            },
          ].map((item, i) => (
            <View
              key={i}
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  ...shadow.sm,
                },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={colors.primary}
              />
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.textMuted,
                    fontSize: fontSize.xs,
                    marginTop: spacing.sm,
                  },
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.statValor,
                  {
                    color: colors.textPrimary,
                    fontSize: fontSize.md,
                    fontWeight: fontWeight.semibold,
                  },
                ]}
              >
                {item.valor}
              </Text>
            </View>
          ))}
        </View>

        {/* Acções */}
        {!concluida && (
          <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
            <Button
              label="Adicionar dinheiro"
              variant="primary"
              size="lg"
              onPress={handleContribuicaoManual}
            />
            <Button
              label="Levantar antecipadamente"
              variant="outline"
              size="md"
              onPress={handleLevantamento}
            />
          </View>
        )}

        {/* Histórico */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontSize: fontSize.lg,
              fontWeight: fontWeight.semibold,
              marginBottom: spacing.md,
            },
          ]}
        >
          Histórico
        </Text>

        {contribuicoes.length === 0 ? (
          <View
            style={[
              styles.emptyHistory,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: spacing.xl,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="receipt-outline"
              size={28}
              color={colors.textMuted}
            />
            <Text
              style={{
                color: colors.textMuted,
                fontSize: fontSize.sm,
                marginTop: spacing.sm,
              }}
            >
              Ainda sem movimentos.
            </Text>
          </View>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {contribuicoes.map((c) => {
              const isEntrada = c.valor > 0;
              return (
                <View
                  key={c.id}
                  style={[
                    styles.histItem,
                    {
                      backgroundColor: colors.surface,
                      borderRadius: radius.lg,
                      padding: spacing.lg,
                      borderWidth: 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.histIcon,
                      {
                        backgroundColor: isEntrada
                          ? colors.successMuted
                          : colors.dangerMuted,
                        borderRadius: radius.md,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        isEntrada ? "arrow-down-outline" : "arrow-up-outline"
                      }
                      size={18}
                      color={isEntrada ? colors.success : colors.danger}
                    />
                  </View>
                  <View style={styles.histInfo}>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontSize: fontSize.sm,
                        fontWeight: fontWeight.medium,
                      }}
                    >
                      {c.descricao}
                    </Text>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontSize: fontSize.xs,
                      }}
                    >
                      {formatarDataRelativa(c.data)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.histValor,
                      {
                        color: isEntrada ? colors.success : colors.danger,
                        fontSize: fontSize.md,
                        fontWeight: fontWeight.semibold,
                      },
                    ]}
                  >
                    {isEntrada ? "+" : ""}
                    {formatarMoeda(Math.abs(c.valor))}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingTop: 8,
  },
  heroCard: {},
  circle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -50,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heroIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  heroValor: {
    letterSpacing: -1,
  },
  heroSub: {
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47%",
  },
  statLabel: {},
  statValor: {},
  sectionTitle: {},
  emptyHistory: {
    alignItems: "center",
    gap: 4,
  },
  histItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  histIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  histInfo: {
    flex: 1,
    gap: 2,
  },
  histValor: {},
});