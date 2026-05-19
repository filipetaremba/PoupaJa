import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useCaixinhasStore } from "@/store/useCaixinhasStore";
import { formatarMoeda, formatarDataRelativa } from "@/lib/formatters";
import type { Contribuicao } from "@/types";

export default function Historico() {
  const { colors, spacing, radius, fontSize, fontWeight, shadow } = useTheme();
  const { contribuicoes, caixinhas } = useCaixinhasStore();

  // Ordena do mais recente para o mais antigo
  const sorted = [...contribuicoes].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  // Agrupa por data relativa
  const grouped: { titulo: string; dados: Contribuicao[] }[] = [];
  for (const c of sorted) {
    const titulo = formatarDataRelativa(c.data);
    const ultimo = grouped[grouped.length - 1];
    if (ultimo && ultimo.titulo === titulo) {
      ultimo.dados.push(c);
    } else {
      grouped.push({ titulo, dados: [c] });
    }
  }

  const getNomeCaixinha = (id: string) =>
    caixinhas.find((c) => c.id === id)?.nome ?? "Caixinha";

  const totalEntradas = sorted
    .filter((c) => c.valor > 0)
    .reduce((acc, c) => acc + c.valor, 0);

  const totalSaidas = sorted
    .filter((c) => c.valor < 0)
    .reduce((acc, c) => acc + Math.abs(c.valor), 0);

  const renderItem = ({ item }: { item: { titulo: string; dados: Contribuicao[] } }) => (
    <View style={{ marginBottom: spacing.xl }}>
      {/* Título do grupo */}
      <Text
        style={[
          styles.groupTitle,
          {
            color: colors.textMuted,
            fontSize: fontSize.xs,
            fontWeight: fontWeight.semibold,
            marginBottom: spacing.sm,
            letterSpacing: 0.5,
          },
        ]}
      >
        {item.titulo.toUpperCase()}
      </Text>

      {/* Items do grupo */}
      <View
        style={[
          styles.groupCard,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.border,
            ...shadow.sm,
          },
        ]}
      >
        {item.dados.map((c, i) => {
          const isEntrada = c.valor > 0;
          const isUltimo = i === item.dados.length - 1;

          return (
            <View key={c.id}>
              <View
                style={[
                  styles.row,
                  { padding: spacing.lg },
                ]}
              >
                {/* Ícone */}
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: isEntrada
                        ? colors.successMuted
                        : colors.dangerMuted,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Ionicons
                    name={isEntrada ? "arrow-down-outline" : "arrow-up-outline"}
                    size={18}
                    color={isEntrada ? colors.success : colors.danger}
                  />
                </View>

                {/* Info */}
                <View style={styles.info}>
                  <Text
                    style={[
                      styles.descricao,
                      {
                        color: colors.textPrimary,
                        fontSize: fontSize.sm,
                        fontWeight: fontWeight.medium,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {getNomeCaixinha(c.caixinhaId)}
                  </Text>
                  <Text
                    style={[
                      styles.tipo,
                      { color: colors.textMuted, fontSize: fontSize.xs },
                    ]}
                  >
                    {c.tipo === "debito_automatico"
                      ? "Débito automático"
                      : c.tipo === "manual"
                      ? "Contribuição manual"
                      : "Levantamento"}
                  </Text>
                </View>

                {/* Valor */}
                <Text
                  style={[
                    styles.valor,
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

              {/* Separador */}
              {!isUltimo && (
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: colors.border, marginLeft: 68 },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={{ marginBottom: spacing.xl }}>
      {/* Título */}
      <Text
        style={[
          styles.titulo,
          {
            color: colors.textPrimary,
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            marginBottom: spacing.xl,
          },
        ]}
      >
        Histórico
      </Text>

      {/* Resumo */}
      <View style={styles.resumoRow}>
        <View
          style={[
            styles.resumoCard,
            {
              backgroundColor: colors.successMuted,
              borderRadius: radius.xl,
              padding: spacing.lg,
              flex: 1,
            },
          ]}
        >
          <Ionicons name="arrow-down-outline" size={18} color={colors.success} />
          <Text
            style={[
              styles.resumoLabel,
              { color: colors.successText, fontSize: fontSize.xs, marginTop: spacing.xs },
            ]}
          >
            Total entradas
          </Text>
          <Text
            style={[
              styles.resumoValor,
              { color: colors.success, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
            ]}
          >
            {formatarMoeda(totalEntradas)}
          </Text>
        </View>

        <View
          style={[
            styles.resumoCard,
            {
              backgroundColor: colors.dangerMuted,
              borderRadius: radius.xl,
              padding: spacing.lg,
              flex: 1,
            },
          ]}
        >
          <Ionicons name="arrow-up-outline" size={18} color={colors.danger} />
          <Text
            style={[
              styles.resumoLabel,
              { color: colors.dangerText, fontSize: fontSize.xs, marginTop: spacing.xs },
            ]}
          >
            Total saídas
          </Text>
          <Text
            style={[
              styles.resumoValor,
              { color: colors.danger, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
            ]}
          >
            {formatarMoeda(totalSaidas)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={[styles.empty, { paddingTop: spacing.xxxl }]}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: colors.surfaceSecondary, borderRadius: radius.xxl },
        ]}
      >
        <Ionicons name="receipt-outline" size={40} color={colors.textMuted} />
      </View>
      <Text
        style={[
          styles.emptyTitle,
          {
            color: colors.textPrimary,
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
          },
        ]}
      >
        Sem movimentos ainda
      </Text>
      <Text
        style={[
          styles.emptySub,
          { color: colors.textSecondary, fontSize: fontSize.md },
        ]}
      >
        As tuas contribuições e levantamentos vão aparecer aqui.
      </Text>
    </View>
  );

  return (
    <SafeScreen edges={["top"]} contentStyle={{ paddingHorizontal: 0 }}>
      <FlatList
        data={grouped}
        keyExtractor={(item) => item.titulo}
        contentContainerStyle={[
          styles.list,
          { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
        ]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingTop: 16,
  },
  titulo: {},
  resumoRow: {
    flexDirection: "row",
    gap: 12,
  },
  resumoCard: {},
  resumoLabel: {},
  resumoValor: {},
  groupTitle: {},
  groupCard: {
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  descricao: {},
  tipo: {},
  valor: {},
  separator: {
    height: 1,
  },
  empty: {
    alignItems: "center",
    gap: 10,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptySub: {
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260,
  },
});