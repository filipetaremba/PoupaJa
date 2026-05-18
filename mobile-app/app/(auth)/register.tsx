import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { Button} from "@/components/Button";
import { Input } from "@/components/Input";
import { SafeScreen } from "@/components/layout/Safescreen";
import { Header } from "@react-navigation/elements";

export default function Register() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmarPin, setConfirmarPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (nome.trim().length < 2)
      novosErros.nome = "Insere o teu nome completo.";
    if (telefone.length < 9)
      novosErros.telefone = "Número de telemóvel inválido.";
    if (pin.length < 4)
      novosErros.pin = "O PIN deve ter pelo menos 4 dígitos.";
    if (pin !== confirmarPin)
      novosErros.confirmarPin = "Os PINs não coincidem.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleRegister = async () => {
    if (!validar()) return;

    setLoading(true);

    // TODO: integrar com API e enviar OTP
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: "/(auth)/otp",
        params: { telefone },
      });
    }, 1500);
  };

  return (
    <SafeScreen scroll>
      <Header showBack title="" />

      {/* Cabeçalho */}
      <View style={[styles.heading, { marginBottom: spacing.xxl }]}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryMuted, borderRadius: 16 }]}>
          <Ionicons name="person-add-outline" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: fontWeight.bold }]}>
          Criar conta
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary, fontSize: fontSize.md }]}>
          Começa a poupar com objectivo hoje mesmo.
        </Text>
      </View>

      {/* Formulário */}
      <View style={{ gap: spacing.lg }}>
        <Input
          label="Nome completo"
          placeholder="Ex: João Machava"
          leftIcon="person-outline"
          value={nome}
          onChangeText={(v) => { setNome(v); setErros((e) => ({ ...e, nome: "" })); }}
          error={erros.nome}
          autoCapitalize="words"
        />

        <Input
          label="Número de telemóvel (M-Pesa)"
          placeholder="84 000 0000"
          keyboardType="phone-pad"
          leftIcon="call-outline"
          value={telefone}
          onChangeText={(v) => { setTelefone(v); setErros((e) => ({ ...e, telefone: "" })); }}
          error={erros.telefone}
          maxLength={9}
        />

        <Input
          label="Criar PIN"
          placeholder="••••"
          keyboardType="number-pad"
          leftIcon="lock-closed-outline"
          secureTextEntry
          value={pin}
          onChangeText={(v) => { setPin(v); setErros((e) => ({ ...e, pin: "" })); }}
          error={erros.pin}
          maxLength={6}
          hint="Mínimo 4 dígitos. Usa um PIN fácil de memorizar."
        />

        <Input
          label="Confirmar PIN"
          placeholder="••••"
          keyboardType="number-pad"
          leftIcon="shield-checkmark-outline"
          secureTextEntry
          value={confirmarPin}
          onChangeText={(v) => { setConfirmarPin(v); setErros((e) => ({ ...e, confirmarPin: "" })); }}
          error={erros.confirmarPin}
          maxLength={6}
        />
      </View>

      {/* Botão */}
      <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
        <Button
          label="Continuar"
          variant="primary"
          size="lg"
          loading={loading}
          onPress={handleRegister}
        />

        <View style={styles.loginRow}>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>
            Já tens conta?{" "}
          </Text>
          <Text
            style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold }}
            onPress={() => router.replace("/(auth)/login")}
          >
            Entrar
          </Text>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: 10,
    paddingTop: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    letterSpacing: -0.3,
  },
  sub: {
    lineHeight: 22,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});