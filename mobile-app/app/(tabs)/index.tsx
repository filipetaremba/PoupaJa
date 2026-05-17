import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";

import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function Index() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.top}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>M-Pesa integrado</Text>
        </View>

        <Text style={styles.title}>
          Poupa com{"\n"}
          <Text style={styles.titleGreen}>Objectivo.</Text>
          {"\n"}Realiza com{"\n"}Propósito.
        </Text>

        <Text style={styles.subtitle}>
          Define quanto queres guardar por dia — o PoupaJá trata do resto.
        </Text>
      </View>

      {/* Caixinha de demonstração */}
      <View style={styles.cards}>
        <View style={styles.cardMain}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardLabel}>Caixinha activa</Text>
              <Text style={styles.cardName}>Novo Telefone</Text>
              <Text style={styles.cardMeta}>50 MT/dia · 47 dias restantes</Text>
            </View>
            <View style={styles.cardIcon}>
              <Text style={{ fontSize: 20 }}>📱</Text>
            </View>
          </View>

          {/* Barra de progresso */}
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressVal}>6.300 MT de 10.000 MT</Text>
            <Text style={styles.progressPct}>63%</Text>
          </View>
        </View>

        {/* Grid de estatísticas */}
        <View style={styles.smGrid}>
          {[
            { icon: "💰", label: "Total poupado", val: "6.300 MT", green: true },
            { icon: "📅", label: "Débito diário", val: "50 MT", green: false },
            { icon: "🎯", label: "Objectivo", val: "10.000 MT", green: false },
            { icon: "⏳", label: "Previsão", val: "47 dias", green: false },
          ].map((item, i) => (
            <View key={i} style={styles.smItem}>
              <Text style={styles.smIco}>{item.icon}</Text>
              <Text style={styles.smLabel}>{item.label}</Text>
              <Text style={[styles.smVal, item.green && styles.smValGreen]}>
                {item.val}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Botões */}
      <View style={styles.bottom}>
       

        <Text style={styles.footer}>
          PoupaJá · M-Pesa Finckathon 3.ª Edição
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a1628",
  },

  // Header
  top: {
    paddingTop: 60,
    paddingHorizontal: 28,
    paddingBottom: 0,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(34,197,94,0.12)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.25)",
    borderRadius: 99,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 28,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  badgeText: {
    fontSize: 12,
    color: "#4ade80",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 42,
    marginBottom: 12,
  },
  titleGreen: {
    color: "#22c55e",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 280,
  },

  // Cards
  cards: {
    paddingHorizontal: 28,
    gap: 14,
    flex: 1,
  },
  cardMain: {
    backgroundColor: "#0f1f0f",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.2)",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 13,
    color: "#4ade80",
    fontWeight: "500",
    marginBottom: 4,
  },
  cardName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: "#475569",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(34,197,94,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 99,
    height: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#22c55e",
    width: "63%",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressVal: {
    fontSize: 13,
    color: "#94a3b8",
  },
  progressPct: {
    fontSize: 13,
    color: "#4ade80",
    fontWeight: "600",
  },

  // Grid pequeno
  smGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  smItem: {
    width: (width - 56 - 12) / 2,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
  },
  smIco: {
    fontSize: 20,
    marginBottom: 8,
  },
  smLabel: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 3,
  },
  smVal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e2e8f0",
  },
  smValGreen: {
    color: "#4ade80",
  },

  // Bottom
  bottom: {
    padding: 28,
    paddingBottom: 40,
  },
  btn: {
    backgroundColor: "#22c55e",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 10,
  },
  btnPressed: {
    backgroundColor: "#16a34a",
    transform: [{ scale: 0.99 }],
  },
  btnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#052e16",
  },
  btnSec: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  btnSecPressed: {
    borderColor: "rgba(255,255,255,0.2)",
  },
  btnSecText: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#1e3a2f",
  },
});