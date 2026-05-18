import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { SafeScreen } from "@/components/layout/Safescreen";
import { useAuthStore } from "@/store/useAuthStore";
import { useCaixinhasStore } from "@/store/useCaixinhasStore";
import { formatarMoeda, formatarTelefone } from "@/lib/formatters";

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, onPress, danger = false }: MenuItemProps) {
  const { colors, spacing, radius, fontSize } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? colors.dangerMuted : colors.primaryMuted, borderRadius: radius.sm }]}>
        <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.menuLabel, { color: danger ? colors.danger : colors.textPrimary, fontSize: fontSize.md, flex: 1 }]}>
        {label}
      </Text>
      {!danger && <Ionicons name="chevron-forward-outline" size={18} color={colors.textMuted} />}
    </Pressable>
  );
}

export default function Perfil() {
  const { colors, spacing, radius, fontSize, fontWeight, shadow } = useTheme();
  const { user, logout } = useAuthStore();
  const { caixinhas } = useCaixinhasStore();

  const totalPoupado = caixinhas.reduce((acc, c) => acc + c.valorAcumulado, 0);
  const concluidas = caixinhas.filter((c) => c.estado === "concluida").length;

  const handleLogout = () => {
    Alert.alert("Terminar sessão", "Tens a certeza que queres sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <SafeScreen scroll>
      {/* Avatar e nome */}
      <View style={[styles.avatarSection, { marginBottom: spacing.xxl }]}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.full,
              ...shadow.lg,
            },
          ]}
        >
          <Text style={[styles.avatarLetter, { color: colors.white, fontSize: fontSize.xxl, fontWeight: fontWeight.bold }]}>
            {user?.nome?.charAt(0).toUpperCase() ?? "U"}
          </Text>
        </View>
        <Text style={[styles.nome, { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: fontWeight.bold }]}>
          {user?.nome ?? "Utilizador"}
        </Text>
        <Text style={[styles.telefone, { color: colors.textSecondary, fontSize: fontSize.md }]}>
          {formatarTelefone(user?.telefone ?? "")}
        </Text>

        {/* M-Pesa badge */}
        <View style={[styles.mpesaBadge, { backgroundColor: colors.successMuted, borderRadius: radius.full, marginTop: spacing.sm }]}>
          <Ionicons name="checkmark-circle-outline" size={14} color={colors.success} />
          <Text style={[{ color: colors.successText, fontSize: fontSize.xs, fontWeight: fontWeight.medium }]}>
            M-Pesa conectado
          </Text>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={[styles.statsRow, { marginBottom: spacing.xxl }]}>
        {[
          { label: "Total poupado",  valor: formatarMoeda(totalPoupado) },
          { label: "Caixinhas",      valor: `${caixinhas.length}` },
          { label: "Concluídas",     valor: `${concluidas}` },
        ].map((item, i) => (
          <View
            key={i}
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.border,
                flex: 1,
              },
            ]}
          >
            <Text style={[{ color: colors.primary, fontSize: fontSize.lg, fontWeight: fontWeight.bold, textAlign: "center" }]}>
              {item.valor}
            </Text>
            <Text style={[{ color: colors.textMuted, fontSize: fontSize.xs, textAlign: "center", marginTop: 2 }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={{ gap: spacing.sm, marginBottom: spacing.xxl }}>
        <MenuItem icon="notifications-outline"  label="Notificações"       onPress={() => {}} />
        <MenuItem icon="shield-outline"         label="Segurança e PIN"    onPress={() => {}} />
        <MenuItem icon="help-circle-outline"    label="Ajuda e suporte"    onPress={() => {}} />
        <MenuItem icon="information-circle-outline" label="Sobre o PoupaJá" onPress={() => {}} />
        <MenuItem icon="log-out-outline"        label="Terminar sessão"    onPress={handleLogout} danger />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    paddingTop: 16,
    gap: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarLetter: {},
  nome: {},
  telefone: {},
  mpesaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {},
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontWeight: "500",
  },
});