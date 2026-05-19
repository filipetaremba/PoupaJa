import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { SafeScreen } from "@/components/layout/Safescreen";
import { Header } from "@react-navigation/elements";

const ITEMS = [
  {
    icon: "notifications-outline" as const,
    titulo: "Débito diário",
    descricao:
      "Recebes uma notificação sempre que o PoupaJá debita o valor diário da tua caixinha.",
  },
  {
    icon: "flag-outline" as const,
    titulo: "Marcos de progresso",
    descricao:
      "Serás notificado quando atingires 25%, 50%, 75% e 100% do teu objectivo.",
  },
  {
    icon: "checkmark-circle-outline" as const,
    titulo: "Objectivo concluído",
    descricao:
      "Quando a tua caixinha estiver cheia recebes uma celebração e o dinheiro é libertado para o teu M-Pesa.",
  },
  {
    icon: "warning-outline" as const,
    titulo: "Saldo insuficiente",
    descricao:
      "Se o teu M-Pesa não tiver saldo suficiente para o débito diário, serás avisado para recarregar.",
  },
];

export default function Notificacoes() {
  const { colors, spacing, radius, fontSize, fontWeight, shadow } = useTheme();

  return (
    <SafeScreen>
      <Header showBack title="Notificações" />

      <View style={{ gap: spacing.md, paddingTop: spacing.md }}>
        {ITEMS.map((item, i) => (
          <View
            key={i}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.xl,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: colors.border,
                ...shadow.sm,
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: colors.primaryMuted,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Ionicons name={item.icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.textWrap}>
              <Text
                style={[
                  styles.titulo,
                  {
                    color: colors.textPrimary,
                    fontSize: fontSize.md,
                    fontWeight: fontWeight.semibold,
                    marginBottom: spacing.xs,
                  },
                ]}
              >
                {item.titulo}
              </Text>
              <Text
                style={[
                  styles.descricao,
                  {
                    color: colors.textSecondary,
                    fontSize: fontSize.sm,
                    lineHeight: 20,
                  },
                ]}
              >
                {item.descricao}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
  },
  titulo: {},
  descricao: {},
});