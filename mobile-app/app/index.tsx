import { Redirect } from "expo-router";

// Durante o desenvolvimento redirecciona directamente para home
// Para activar o auth, substitui por: <Redirect href="/(auth)/login" />
export default function Index() {
  return <Redirect href="/(app)/home" />;
}