import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import { Button} from "@/components/Button";
import { Input } from "@/components/Input";
import { SafeScreen } from "@/components/layout/Safescreen";
import { Header } from "@react-navigation/elements";

export default function Login() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  const [telefone, setTelefone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    if (telefone.length < 9) {
      setErro("Insere um número de telemóvel válido.");
      return;
    }
    if (pin.length < 4) {
      setErro("O PIN deve ter pelo menos 4 dígitos.");
      return;
    }

    setErro("");
    setLoading(true);

    // TODO: integrar com API / M-Pesa auth
    setTimeout(() => {
      setLoading(false);
      router.replace("/(app)/home");
    }, 1500);
  };

  return (
    <SafeScreen scroll>
      <Header showBack title="" />

      {/* Cabeçalho */}
      <View style={[styles.heading, { marginBottom: spacing.xxl }]}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryMuted, borderRadius: 16 }]}>
          <Ionicons name="wallet-outline" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: fontWeight.bold }]}>
          Entrar
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary, fontSize: fontSize.md }]}>
          Bem-vindo de volta! Insere os teus dados para continuar.
        </Text>
      </View>

      {/* Formulário */}
      <View style={{ gap: spacing.lg }}>
        <Input
          label="Número de telemóvel"
          placeholder="84 000 0000"
          keyboardType="phone-pad"
          leftIcon="call-outline"
          value={telefone}
          onChangeText={(t) => { setTelefone(t); setErro(""); }}
          maxLength={9}
        />

        <Input
          label="PIN"
          placeholder="••••"
          keyboardType="number-pad"
          leftIcon="lock-closed-outline"
          secureTextEntry
          value={pin}
          onChangeText={(p) => { setPin(p); setErro(""); }}
          maxLength={6}
          error={erro}
        />
      </View>

      {/* Esqueci o PIN */}
      <Text
        style={[styles.forgot, { color: colors.primary, fontSize: fontSize.sm, marginTop: spacing.md }]}
        onPress={() => {}}
      >
        Esqueci o PIN
      </Text>

      {/* Botão */}
      <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
        <Button
          label="Entrar"
          variant="primary"
          size="lg"
          loading={loading}
          onPress={handleLogin}
        />

        <View style={styles.registerRow}>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>
            Ainda não tens conta?{" "}
          </Text>
          <Text
            style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold }}
            onPress={() => router.replace("/(auth)/register")}
          >
            Criar conta
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
  forgot: {
    alignSelf: "flex-end",
    fontWeight: "500",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});