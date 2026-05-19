import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { SafeScreen } from "@/components/layout/Safescreen";
import { CaixinhaCard } from "@/components/caixinha/CaixinhaCard";
import { useCaixinhasStore } from "@/store/useCaixinhasStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatarMoeda } from "@/lib/formatters";
import type { Caixinha } from "@/types";

export default function Home() {
  const { colors, spacing, radius, fontSize, fontWeight, shadow } = useTheme();
  const { user } = useAuthStore();
  const { caixinhas } = useCaixinhasStore();
 
  const ativas = caixinhas.filter((c) => c.estado === "ativa");
  const totalPoupado = caixinhas.reduce((acc, c) => acc + c.valorAcumulado, 0);
 
  const primeiroNome = user?.nome?.split(" ")[0] ?? "Utilizador";
 
  const renderHeader = () => (
    <View>
      {/* Saudação */}
      <View style={[styles.greeting, { marginBottom: spacing.md }]}>
        {/* Avatar + texto */}
        <View style={styles.greetLeft}>
          {/* Avatar do utilizador */}
          <Pressable
            onPress={() => router.push("/(app)/perfil")}
            style={[
              styles.avatar,
              {
                borderRadius: radius.full,
                borderWidth: 2,
                borderColor: colors.primary,
                backgroundColor: colors.surfaceSecondary,
                overflow: "hidden",
              },
            ]}
          >
            {user?.fotoUrl ? (
              <Image
                source={{ uri: user.fotoUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <Text
                style={{
                  color: colors.primary,
                  fontSize: fontSize.lg,
                  fontWeight: fontWeight.bold,
                }}
              >
                {primeiroNome.charAt(0).toUpperCase()}
              </Text>
            )}
          </Pressable>

          {/* Nome */}
          <View>
            <Text style={[styles.greetSub, { color: colors.textSecondary, fontSize: fontSize.sm }]}>
              Bem-vindo 👋
            </Text>
            <Text style={[styles.greetName, { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: fontWeight.bold }]}>
              {primeiroNome}
            </Text>
          </View>
        </View>

        {/* Botão de suporte */}
        {/* <Pressable
          style={[styles.notifBtn, { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border }]}
          onPress={() => router.push("/(app)/home")}
        >
          <Ionicons name="help-circle-outline" size={22} color={colors.textPrimary} />
        </Pressable> */}
      </View>
 
      {/* Card resumo */}
      <View
        style={[
          styles.resumoCard,
          {
            backgroundColor: colors.primary,
            borderRadius: radius.xxl,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            ...shadow.lg,
          },
        ]}
      >
        {/* Círculo decorativo */}
        <View style={[styles.circle, { backgroundColor: colors.primaryLight, opacity: 0.2 }]} />
 
        <Text style={[styles.resumoLabel, { color: "rgba(255,255,255,0.75)", fontSize: fontSize.sm }]}>
          Total poupado
        </Text>
        <Text style={[styles.resumoValor, { color: colors.white, fontSize: fontSize.xxxl, fontWeight: fontWeight.extrabold }]}>
          {formatarMoeda(totalPoupado)}
        </Text>
 
        <View style={[styles.resumoRow, { marginTop: spacing.lg }]}>
          <View style={styles.resumoStat}>
            <Ionicons name="layers-outline" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={[styles.resumoStatText, { color: "rgba(255,255,255,0.85)", fontSize: fontSize.sm }]}>
              {ativas.length} caixinha{ativas.length !== 1 ? "s" : ""} activa{ativas.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <View style={[styles.resumoStat]}>
            <Ionicons name="checkmark-circle-outline" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={[styles.resumoStatText, { color: "rgba(255,255,255,0.85)", fontSize: fontSize.sm }]}>
              {caixinhas.filter((c) => c.estado === "concluida").length} concluída{caixinhas.filter((c) => c.estado === "concluida").length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>
 
      {/* Título da lista */}
      <View style={[styles.listHeader, { marginBottom: spacing.md }]}>
        <Text style={[styles.listTitle, { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
          As minhas caixinhas
        </Text>
        {caixinhas.length > 0 && (
          <Text style={[styles.listCount, { color: colors.textMuted, fontSize: fontSize.sm }]}>
            {caixinhas.length} no total
          </Text>
        )}
      </View>
    </View>
  );
 
  const renderEmpty = () => (
    <View style={[styles.empty, { paddingTop: spacing.xxxl }]}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceSecondary, borderRadius: radius.xxl }]}>
        <Ionicons name="wallet-outline" size={40} color={colors.textMuted} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
        Nenhuma caixinha ainda
      </Text>
      <Text style={[styles.emptySub, { color: colors.textSecondary, fontSize: fontSize.md }]}>
        Cria a tua primeira caixinha e começa a poupar com objectivo.
      </Text>
      <Pressable
        style={[styles.emptyBtn, { backgroundColor: colors.primaryMuted, borderRadius: radius.lg, marginTop: spacing.lg }]}
        onPress={() => router.push("/(app)/nova-caixinha")}
      >
        <Ionicons name="add-outline" size={20} color={colors.primary} />
        <Text style={[{ color: colors.primary, fontSize: fontSize.md, fontWeight: fontWeight.semibold }]}>
          Criar caixinha
        </Text>
      </Pressable>
      
    </View>
    
  );
 
  return (
    <SafeScreen edges={["top"]} contentStyle={{ paddingHorizontal: 0 }}>
      <FlatList
        data={caixinhas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
        ]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }: { item: Caixinha }) => (
          <CaixinhaCard
            caixinha={item}
            onPress={() =>
              router.push({
                pathname: "/(app)/caixinha/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
 
      {/* FAB — botão flutuante */}
      {caixinhas.length > 0 && (
        <Pressable
          style={[
            styles.fab,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.full,
              ...shadow.lg,
            },
          ]}
          onPress={() => router.push("/(app)/nova-caixinha")}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </Pressable>
      )}
    </SafeScreen>
  );
}
 
const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingTop: 16,
  },
  greeting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  greetSub: {},
  greetName: {},
  notifBtn: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  resumoCard: {
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -50,
    right: -40,
  },
  resumoLabel: {},
  resumoValor: {
    letterSpacing: -1,
    marginTop: 4,
  },
  resumoRow: {
    flexDirection: "row",
    gap: 20,
  },
  resumoStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resumoStatText: {},
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {},
  listCount: {},
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
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});