import { config } from "@/gluestack-ui.config";
import { set as setGlobalColorMode } from "@gluestack-style/react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";

const STORAGE_KEY = "@global-qr-scanner/color-mode";

type ColorMode = "light" | "dark";

interface AppColorModeContextValue {
  colorMode: ColorMode;
  hydrated: boolean;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

const AppColorModeContext = createContext<AppColorModeContextValue | undefined>(
  undefined
);

export function AppColorModeProvider({ children }: { children: ReactNode }) {
  const systemPreference: ColorMode =
    Appearance.getColorScheme() === "dark" ? "dark" : "light";

  const [colorMode, setColorModeState] = useState<ColorMode>(systemPreference);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark") {
          setColorModeState(stored);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    setGlobalColorMode(colorMode);
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, colorMode).catch((error) =>
        console.warn("Failed to persist color mode", error)
      );
    }
  }, [colorMode, hydrated]);

  const value = useMemo<AppColorModeContextValue>(
    () => ({
      colorMode,
      hydrated,
      setColorMode: (mode: ColorMode) => setColorModeState(mode),
      toggleColorMode: () =>
        setColorModeState((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [colorMode, hydrated]
  );

  return (
    <AppColorModeContext.Provider value={value}>
      <GluestackUIProvider config={config} colorMode={colorMode}>
        {children}
      </GluestackUIProvider>
    </AppColorModeContext.Provider>
  );
}

export function useAppColorMode() {
  const context = useContext(AppColorModeContext);
  if (!context) {
    throw new Error("useAppColorMode must be used within AppColorModeProvider");
  }
  return context;
}
