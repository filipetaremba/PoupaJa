import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { SafeScreen } from "@/components/layout/Safescreen";
import { Header } from "@react-navigation/elements";
import { useCaixinhasStore } from "@/store/useCaixinhasStore";
import { useAuthStore } from "@/store/useAuthStore";
import { calcularDiasParaObjetivo } from "@/lib/calculos";
import { formatarMoeda, formatarDias } from "@/lib/formatters";
import type { Caixinha } from "@/types";

function gerarId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Sugestões rápidas de objectivos
const SUGESTOES = [
  { nome: "Telefone", icon: "phone-portrait-outline" },
  { nome: "Viagem", icon: "airplane-outline" },
  { nome: "Televisão", icon: "tv-outline" },
  { nome: "Portátil", icon: "laptop-outline" },
  { nome: "Mota", icon: "bicycle-outline" },
  { nome: "Outro", icon: "ellipsis-horizontal-outline" },
];

export default function NovaCaixinha() {
  const { colors, spacing, radius, fontSize, fontWeight, shadow } = useTheme();
  const { addCaixinha } = useCaixinhasStore();
  const { user } = useAuthStore();

  const [nome, setNome] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorDiario, setValorDiario] = useState("");
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  const objetivo = parseFloat(valorObjetivo) || 0;
  const diario = parseFloat(valorDiario) || 0;
  const diasEstimados = calcularDiasParaObjetivo(objetivo, diario);
  const mostrarPrevisao = objetivo > 0 && diario > 0 && diario <= objetivo;

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};
    if (nome.trim().length < 2)
      novosErros.nome = "Dá um nome à tua caixinha.";
    if (objetivo <= 0)
      novosErros.valorObjetivo = "Insere o valor que queres poupar.";
    if (diario <= 0)
      novosErros.valorDiario = "Insere o valor diário a debitar.";
    if (diario > objetivo)
      novosErros.valorDiario = "O valor diário não pode ser maior que o objectivo.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCriar = () => {
    if (!validar()) return;
    setLoading(true);
    const novaCaixinha: Caixinha = {
      id: gerarId(),
      userId: user?.id ?? "local",
      nome: nome.trim(),
      emoji: "💰",
      valorObjetivo: objetivo,
      valorDiario: diario,
      valorAcumulado: 0,
      estado: "ativa",
      criadaEm: new Date().toISOString(),
      ultimoDebitoEm: null,
    };
    setTimeout(() => {
      addCaixinha(novaCaixinha);
      setLoading(false);
      router.replace("/(app)/home");
    }, 800);
  };

  return (
    <SafeScreen contentStyle={{ paddingHorizontal: 0 }}>
      <Header showBack title="Nova Caixinha" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Sugestões rápidas */}
        {/* <Text
          style={[
            styles.sectionLabel,
            { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: fontWeight.semibold, marginBottom: spacing.sm },
          ]}
        >
          ESCOLHE UM OBJECTIVO
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.md }}
        >
          {SUGESTOES.map((s) => {
            const activo = nome === s.nome;
            return (
              <Pressable
                key={s.nome}
                onPress={() => { setNome(s.nome); setErros((e) => ({ ...e, nome: "" })); }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: activo ? colors.primary : colors.surface,
                    borderRadius: radius.full,
                    borderWidth: 1.5,
                    borderColor: activo ? colors.primary : colors.border,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.lg,
                  },
                ]}
              >
                <Ionicons
                  name={s.icon as any}
                  size={16}
                  color={activo ? colors.white : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: activo ? colors.white : colors.textSecondary,
                      fontSize: fontSize.sm,
                      fontWeight: activo ? fontWeight.semibold : fontWeight.regular,
                    },
                  ]}
                >
                  {s.nome}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView> */}

        {/* Formulário */}
        <View style={{ gap: spacing.lg, marginTop: spacing.md }}>
          <Input
            label="Nome do objectivo"
            placeholder="Ex: Novo Telefone, Viagem, TV..."
            leftIcon="flag-outline"
            value={nome}
            onChangeText={(v) => { setNome(v); setErros((e) => ({ ...e, nome: "" })); }}
            error={erros.nome}
            autoCapitalize="words"
          />

          <Input
            label="Valor total a poupar (MT)"
            placeholder="Ex: 10.000"
            keyboardType="numeric"
            leftIcon="cash-outline"
            value={valorObjetivo}
            onChangeText={(v) => { setValorObjetivo(v); setErros((e) => ({ ...e, valorObjetivo: "" })); }}
            error={erros.valorObjetivo}
            hint="Quanto precisas no total para atingir o objectivo?"
          />

          <Input
            label="Valor diário a poupar (MT)"
            placeholder="Ex: 50"
            keyboardType="numeric"
            leftIcon="calendar-outline"
            value={valorDiario}
            onChangeText={(v) => { setValorDiario(v); setErros((e) => ({ ...e, valorDiario: "" })); }}
            error={erros.valorDiario}
            hint="Debitado do teu M-Pesa todos os dias."
          />
        </View>

        {/* Previsão */}
        {mostrarPrevisao && (
          <View
            style={[
              styles.previsao,
              {
                backgroundColor: colors.primaryMuted,
                borderRadius: radius.xl,
                padding: spacing.lg,
                marginTop: spacing.xl,
                borderWidth: 1,
                borderColor: colors.primary + "30",
              },
            ]}
          >
            <View style={styles.previsaoRow}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold }}>
                Previsão calculada
              </Text>
            </View>

            {/* Stats da previsão */}
            <View style={[styles.previsaoStats, { marginTop: spacing.md, gap: spacing.sm }]}>
              {[
                { label: "Objectivo",   valor: formatarMoeda(objetivo) },
                { label: "Por dia",     valor: formatarMoeda(diario) },
                { label: "Duração",     valor: formatarDias(diasEstimados) },
              ].map((item, i) => (
                <View key={i} style={styles.previsaoStatRow}>
                  <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>
                    {item.label}
                  </Text>
                  <Text style={{ color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold }}>
                    {item.valor}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.md, lineHeight: 18 }}>
              * Se não for debitado num dia, o prazo estende-se — nunca são cobrados dias em atraso.
            </Text>
          </View>
        )}

        {/* Botão */}
        <View style={{ marginTop: spacing.xxl }}>
          <Button
            label="Criar caixinha"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleCriar}
          />
        </View>

      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
  },
  sectionLabel: {
    letterSpacing: 0.6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipText: {},
  previsao: {},
  previsaoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previsaoStats: {},
  previsaoStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
});