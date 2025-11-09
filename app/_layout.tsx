import { AppColorModeProvider } from "@/src/theme/colorModeManager";
import { ToastProvider } from "@gluestack-ui/toast";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <AppColorModeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade_from_bottom",
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="result" />
            <Stack.Screen name="history" />
          </Stack>
        </AppColorModeProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}
