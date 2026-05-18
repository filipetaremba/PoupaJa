import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { Sora_400Regular, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from "@expo-google-fonts/sora";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colorSchemes } from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = isDark ? colorSchemes.dark : colorSchemes.light;

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </SafeAreaProvider>
  );
}