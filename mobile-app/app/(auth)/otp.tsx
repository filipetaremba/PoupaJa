import { View, Text, StyleSheet, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { Button } from "@/components/Button";
import { SafeScreen } from "@/components/layout/Safescreen";
import { Header } from "@react-navigation/elements";
import { formatarTelefone } from "@/lib/formatters";

const OTP_LENGTH = 6;

export default function Otp() {
  const { colors, spacing, fontSize, fontWeight, radius } = useTheme();
  const { telefone } = useLocalSearchParams<{ telefone: string }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (value: string, index: number) => {
    const novo = [...otp];
    novo[index] = value.replace(/\D/g, "").slice(-1);
    setOtp(novo);
    setErro("");

    // Avança para o próximo campo
    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerificar = () => {
    const codigo = otp.join("");
    if (codigo.length < OTP_LENGTH) {
      setErro("Insere o código completo de 6 dígitos.");
      return;
    }

    setLoading(true);

    // TODO: validar OTP com API
    setTimeout(() => {
      setLoading(false);
      router.replace("/(app)/home");
    }, 1500);
  };

  const handleReenviar = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setErro("");
    inputs.current[0]?.focus();
    // TODO: reenviar OTP via API
  };

  const otpCompleto = otp.every((d) => d !== "");

  return (
    <SafeScreen>
      <Header showBack title="" />

      <View style={[styles.body, { paddingHorizontal: spacing.screen }]}>

        {/* Ícone */}
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryMuted, borderRadius: 20 }]}>
          <Ionicons name="chatbubble-ellipses-outline" size={36} color={colors.primary} />
        </View>

        {/* Textos */}
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: fontWeight.bold }]}>
          Verificar número
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary, fontSize: fontSize.md }]}>
          Enviámos um código SMS para{"\n"}
          <Text style={{ color: colors.textPrimary, fontWeight: fontWeight.semibold }}>
            {formatarTelefone(telefone ?? "")}
          </Text>
        </Text>

        {/* Campos OTP */}
        <View style={[styles.otpRow, { marginTop: spacing.xxl }]}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => { if (ref) inputs.current[i] = ref; }}
              style={[
                styles.otpInput,
                {
                  borderColor: digit ? colors.primary : colors.border,
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  fontSize: fontSize.xl,
                  borderRadius: radius.md,
                  fontWeight: fontWeight.bold,
                  borderWidth: digit ? 2 : 1.5,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              autoFocus={i === 0}
              textAlign="center"
            />
          ))}
        </View>

        {/* Erro */}
        {erro ? (
          <Text style={[styles.erro, { color: colors.danger, fontSize: fontSize.sm, marginTop: spacing.md }]}>
            {erro}
          </Text>
        ) : null}

        {/* Reenviar */}
        <Pressable onPress={handleReenviar} style={{ marginTop: spacing.xl }}>
          <Text style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.medium, textAlign: "center" }}>
            Não recebi o código — Reenviar
          </Text>
        </Pressable>

        {/* Botão */}
        <View style={{ marginTop: spacing.xxl }}>
          <Button
            label="Verificar"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!otpCompleto}
            onPress={handleVerificar}
          />
        </View>

      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 16,
  },
  iconWrap: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  sub: {
    lineHeight: 24,
  },
  otpRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  otpInput: {
    width: 48,
    height: 56,
  },
  erro: {
    textAlign: "center",
  },
});