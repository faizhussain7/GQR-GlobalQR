import { config as defaultConfig } from "@gluestack-ui/config";

const brandColors = {
  brandPrimary50: "#EEF2FF",
  brandPrimary100: "#E0E7FF",
  brandPrimary200: "#C7D2FE",
  brandPrimary300: "#A5B4FC",
  brandPrimary400: "#818CF8",
  brandPrimary500: "#6366F1",
  brandPrimary600: "#4F46E5",
  brandPrimary700: "#4338CA",
  brandPrimary800: "#3730A3",
  brandPrimary900: "#312E81",
  brandAccent400: "#22D3EE",
  brandAccent500: "#0EA5E9",
  brandAccent600: "#0891B2",
  brandNeon400: "#7C3AED",
  brandNeon500: "#9333EA",
  brandNeon600: "#C026D3",
  surfaceDark950: "#040711",
  surfaceDark900: "#060B1A",
  surfaceDark800: "#0E1729",
  surfaceDark700: "#142042",
  surfaceDark600: "#1C2A5B",
  surfaceLight50: "#F8FAFF",
  surfaceLight100: "#F1F5FF",
  surfaceLight200: "#E4EBFF",
  surfaceLight300: "#D5DEF6",
  surfaceLight400: "#C5D2EF",
  success400: "#22C55E",
  warning400: "#F59E0B",
  danger400: "#F87171",
};

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens?.colors,
      ...brandColors,
    },
    radii: {
      ...defaultConfig.tokens?.radii,
      "3xl": 32,
      "4xl": 40,
      pill: 999,
    },
    space: {
      ...defaultConfig.tokens?.space,
      "3.5": 14,
      "7.5": 30,
      18: 72,
    },
    opacity: {
      ...defaultConfig.tokens?.opacity,
      16: 0.16,
      18: 0.18,
      24: 0.24,
      32: 0.32,
    },
    shadows: {
      ...defaultConfig.tokens?.shadows,
      focusGlow: {
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
      },
      neonSoft: {
        shadowColor: "#22D3EE",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
        elevation: 12,
      },
    },
  },
  components: {
    ...defaultConfig.components,
    Button: {
      ...defaultConfig.components?.Button,
      defaultProps: {
        ...defaultConfig.components?.Button?.defaultProps,
        size: "lg",
        rounded: "full",
      },
      variants: {
        ...defaultConfig.components?.Button?.variants,
        futuristic: ({ theme }: any) => {
          const colors = theme?.tokens?.colors;
          return {
            bg: "$brandPrimary600",
            _text: {
              color: "$surfaceLight50",
              fontWeight: "$semibold",
            },
            _hover: {
              bg: "$brandPrimary500",
            },
            _pressed: {
              bg: "$brandPrimary700",
            },
            shadowColor: colors?.brandAccent500,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 12,
          };
        },
        glass: () => ({
          bg: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.12)",
          _text: {
            color: "$surfaceLight50",
            fontWeight: "$medium",
          },
          _dark: {
            bg: "rgba(15,23,42,0.7)",
            borderColor: "rgba(148,163,184,0.24)",
          },
          _light: {
            bg: "rgba(255,255,255,0.7)",
            borderColor: "rgba(99,102,241,0.24)",
          },
        }),
      },
    },
    Pressable: {
      ...defaultConfig.components?.Pressable,
      variants: {
        ...defaultConfig.components?.Pressable?.variants,
        neon: {
          bg: "rgba(99, 102, 241, 0.12)",
          borderRadius: "$pill",
          borderWidth: 1,
          borderColor: "rgba(99, 102, 241, 0.32)",
          _hover: {
            borderColor: "$brandPrimary500",
          },
          _pressed: {
            bg: "rgba(99, 102, 241, 0.24)",
          },
          _dark: {
            bg: "rgba(30, 41, 59, 0.72)",
          },
        },
      },
    },
    Card: {
      ...defaultConfig.components?.Card,
      defaultProps: {
        ...defaultConfig.components?.Card?.defaultProps,
        size: "lg",
        borderRadius: "$3xl",
        bg: "$surfaceLight50",
        px: "$5",
        py: "$5",
        _dark: {
          bg: "$surfaceDark800",
        },
        shadow: "$neonSoft",
      },
    },
  },
};

