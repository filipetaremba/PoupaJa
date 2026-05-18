import { View, Text, StyleSheet, ScrollView } from "react-native";
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
  const mostrarPrevisao = objetivo > 0 && diario > 0;
 
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
    <SafeScreen>
      <Header showBack title="Nova Caixinha" />
 
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícone */}
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryMuted, borderRadius: radius.xxl, marginBottom: spacing.xl }]}>
          <Ionicons name="wallet-outline" size={36} color={colors.primary} />
        </View>
 
        {/* Formulário */}
        <View style={{ gap: spacing.lg }}>
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
            placeholder="Ex: 10000"
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
            hint="Este valor será debitado do teu M-Pesa todos os dias."
          />
        </View>
 
        {/* Previsão calculada automaticamente */}
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
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.previsaoTitle, { color: colors.primary, fontSize: fontSize.md, fontWeight: fontWeight.semibold }]}>
                Previsão calculada
              </Text>
            </View>
            <Text style={[styles.previsaoText, { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.sm }]}>
              Poupando{" "}
              <Text style={{ color: colors.textPrimary, fontWeight: fontWeight.semibold }}>
                {formatarMoeda(diario)}/dia
              </Text>
              {" "}vais atingir{" "}
              <Text style={{ color: colors.textPrimary, fontWeight: fontWeight.semibold }}>
                {formatarMoeda(objetivo)}
              </Text>
              {" "}em aproximadamente{" "}
              <Text style={{ color: colors.primary, fontWeight: fontWeight.bold }}>
                {formatarDias(diasEstimados)}
              </Text>
              .
            </Text>
            <Text style={[{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.sm }]}>
              * Se não for debitado num dia, o prazo estende-se automaticamente — nunca são cobrados dias em atraso.
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
  iconWrap: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
  },
  previsao: {},
  previsaoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previsaoTitle: {},
  previsaoText: {
    lineHeight: 22,
  },
});