import { useMemo } from "react";

import { useAppColorMode } from "./colorModeManager";

type ColorMode = "light" | "dark";

type ThemeColorToken = Record<ColorMode, string>;

export const themeColorTokens = {
  appBackground: { light: "#F8FAFF", dark: "#040711" },
  modalOverlay: { light: "rgba(15,23,42,0.28)", dark: "rgba(3,7,18,0.76)" },
  haloCamera: { light: "rgba(99,102,241,0.08)", dark: "rgba(99,102,241,0.2)" },
  accentPrimary: { light: "#4338CA", dark: "#A5B4FC" },
  accentSecondary: { light: "#2563EB", dark: "#22D3EE" },
  accentScanLine: {
    light: "rgba(79,70,229,0.55)",
    dark: "rgba(56,189,248,0.72)",
  },
  torchBackground: {
    light: "rgba(255,255,255,0.92)",
    dark: "rgba(15,23,42,0.82)",
  },
  torchBorder: {
    light: "rgba(99,102,241,0.3)",
    dark: "rgba(148,163,184,0.35)",
  },
  torchGlow: { light: "#22D3EE", dark: "#22D3EE" },

  iconHaloPrimary: { light: "rgba(79,70,229,0.1)", dark: "rgba(79,70,229,0.18)" },
  iconHaloSecondary: {
    light: "rgba(99,102,241,0.12)",
    dark: "rgba(99,102,241,0.22)",
  },
  iconHaloDanger: {
    light: "rgba(248,113,113,0.12)",
    dark: "rgba(248,113,113,0.16)",
  },

  textPrimary: { light: "#111827", dark: "#F8FAFC" },
  textPrimaryStrong: { light: "#1F2937", dark: "#E2E8F0" },
  textPrimaryAlt: { light: "$surfaceDark700", dark: "$surfaceLight50" },
  textSecondary: { light: "#334155", dark: "rgba(226,232,240,0.72)" },
  textMuted: { light: "#64748B", dark: "rgba(148,163,184,0.8)" },
  textMutedSoft: { light: "#64748B", dark: "rgba(148,163,184,0.7)" },
  textMutedSofter: { light: "#475569", dark: "rgba(148,163,184,0.75)" },
  textMutedLow: { light: "#64748B", dark: "rgba(148,163,184,0.6)" },
  textMutedAlt: { light: "$surfaceDark500", dark: "$surfaceLight300" },
  textMutedAccent: { light: "$surfaceDark500", dark: "rgba(209,213,255,0.8)" },
  textAccentTitle: { light: "#1E1B4B", dark: "#EAECFF" },
  textAccentDetail: { light: "#312E81", dark: "#CBD5F5" },
  textAccentInverse: { light: "$surfaceDark700", dark: "$surfaceLight100" },
  textHighlight: { light: "#4338CA", dark: "#E0E7FF" },
  textEmptyState: { light: "#334155", dark: "#94A3B8" },

  infoLabel: { light: "#475569", dark: "rgba(226,232,240,0.7)" },
  infoValue: { light: "#0F172A", dark: "#E0E7FF" },

  accentIcon: { light: "#4F46E5", dark: "#C4B5FD" },
  valueHighlight: { light: "#4C1D95", dark: "#C084FC" },
  valueSoft: { light: "#1E293B", dark: "#F8FAFC" },

  sectionTitle: { light: "#1E293B", dark: "#E0E7FF" },
  sectionSubtitle: { light: "#475569", dark: "rgba(148,163,184,0.8)" },

  controlBorder: { light: "rgba(99,102,241,0.18)", dark: "rgba(148,163,184,0.32)" },
  outlinePrimary: { light: "rgba(99,102,241,0.24)", dark: "rgba(99,102,241,0.32)" },
  outlinePrimaryStrong: {
    light: "rgba(99,102,241,0.22)",
    dark: "rgba(99,102,241,0.3)",
  },
  outlineTile: { light: "rgba(99,102,241,0.14)", dark: "rgba(99,102,241,0.24)" },
  outlineSecondary: {
    light: "rgba(14,165,233,0.24)",
    dark: "rgba(14,165,233,0.32)",
  },
  outlineDivider: {
    light: "rgba(148,163,184,0.12)",
    dark: "rgba(99,102,241,0.18)",
  },
  outlineNeutralStrong: {
    light: "rgba(99,102,241,0.32)",
    dark: "rgba(148,163,184,0.32)",
  },
  outlineScan: { light: "rgba(99,102,241,0.18)", dark: "rgba(99,102,241,0.28)" },
  outlineDanger: {
    light: "rgba(248,113,113,0.18)",
    dark: "rgba(248,113,113,0.28)",
  },

  surfaceCard: { light: "rgba(255,255,255,0.92)", dark: "rgba(15,23,42,0.82)" },
  surfaceCardRaised: { light: "rgba(255,255,255,0.95)", dark: "rgba(15,23,42,0.9)" },
  surfaceControl: { light: "rgba(255,255,255,0.9)", dark: "rgba(15,23,42,0.82)" },
  surfaceAppTile: { light: "rgba(255,255,255,0.95)", dark: "rgba(15,23,42,0.86)" },
  surfaceAccent: { light: "rgba(99,102,241,0.12)", dark: "rgba(99,102,241,0.18)" },
  surfaceAccentAlt: {
    light: "rgba(99,102,241,0.12)",
    dark: "rgba(124,58,237,0.24)",
  },
  surfaceDanger: { light: "rgba(254,226,226,0.9)", dark: "rgba(248,113,113,0.18)" },
  surfaceDangerMuted: {
    light: "rgba(248,113,113,0.12)",
    dark: "rgba(248,113,113,0.16)",
  },

  backgroundGlowPrimary: {
    light: "rgba(99,102,241,0.28)",
    dark: "rgba(99,102,241,0.45)",
  },
  backgroundGlowSecondary: {
    light: "rgba(14,165,233,0.25)",
    dark: "rgba(14,165,233,0.35)",
  },
  backgroundGlowTertiary: {
    light: "rgba(147,51,234,0.2)",
    dark: "rgba(124,58,237,0.4)",
  },
  backgroundGlowAccent: {
    light: "rgba(236,72,153,0.18)",
    dark: "rgba(236,72,153,0.28)",
  },
  backgroundOverlay: {
    light: "rgba(244,246,255,0.75)",
    dark: "rgba(4,7,17,0.6)",
  },

  cardBorder: { light: "rgba(99,102,241,0.16)", dark: "rgba(99,102,241,0.28)" },

  toggleBackground: {
    light: "rgba(99,102,241,0.18)",
    dark: "rgba(15,23,42,0.85)",
  },
  toggleBorder: {
    light: "rgba(99,102,241,0.42)",
    dark: "rgba(148,163,184,0.42)",
  },
  toggleText: { light: "$surfaceDark700", dark: "$surfaceLight50" },
  knobShadow: { light: "#FBBF24", dark: "#818CF8" },
  knobBackground: { light: "#ffffff", dark: "#ffffff" },

  gradientBar: { light: "rgba(99,102,241,0.6)", dark: "rgba(125,211,252,0.6)" },

  shareIcon: { light: "#0EA5E9", dark: "#67E8F9" },
  shareText: { light: "#0369A1", dark: "#BAE6FD" },

  typeUPI: { light: "#16A34A", dark: "#4ADE80" },
  typeURL: { light: "#2563EB", dark: "#93C5FD" },
  typeWIFI: { light: "#D97706", dark: "#FBBF24" },
  typeVCARD: { light: "#DB2777", dark: "#F9A8D4" },
  typeEMAIL: { light: "#DC2626", dark: "#FCA5A5" },
  typePHONE: { light: "#0D9488", dark: "#5EEAD4" },
  typeFallback: { light: "#475569", dark: "#CBD5F5" },

  dangerIcon: { light: "#DC2626", dark: "#F87171" },

  accentShadow: { light: "#6366F1", dark: "#1E3A8A" },
  neutralShadow: { light: "#000000", dark: "#000000" },
  bottomCardShadow: { light: "#6366F1", dark: "#6366F1" },
  torchButtonShadow: { light: "#22D3EE", dark: "#22D3EE" },

  brandPrimary: { light: "#4338CA", dark: "#C7D2FE" },
  accentTertiary: { light: "#6366F1", dark: "#C084FC" },
  accentTileShadow: { light: "#38BDF8", dark: "#0EA5E9" },
} satisfies Record<string, ThemeColorToken>;

export type ThemeColorName = keyof typeof themeColorTokens;

export type ResolvedThemeColors = {
  [K in ThemeColorName]: string;
};

export function getThemeColor(mode: ColorMode, name: ThemeColorName) {
  return themeColorTokens[name][mode];
}

export function useThemedColors(): ResolvedThemeColors {
  const { colorMode } = useAppColorMode();

  return useMemo(() => {
    const resolved = {} as ResolvedThemeColors;
    (Object.keys(themeColorTokens) as ThemeColorName[]).forEach((name) => {
      resolved[name] = themeColorTokens[name][colorMode];
    });
    return resolved;
  }, [colorMode]);
}

