"use client";

/**
 * Theme-Tokens für die UI-Modernisierung (Bento-Grid + Glassmorphism)
 *
 * Dark-Mode-Spec (AUFTRAG, 2026-09-21):
 *   Background #090d16 | Paper rgba(15,23,42,0.75) | Primary #6366f1 (Indigo)
 *   Secondary #10b981 (Emerald) | Border 1px solid rgba(255,255,255,0.08) | Radius 14px
 *
 * Die CSS-Variablen leben in app/globals.css (.dark-Block). Diese Konstanten
 * sind die TypeScript-Seite für Framer-Motion-Varianten und Bento-Komponenten.
 * Werte synchron halten: eine Änderung → in beiden Dateien.
 */

export const THEME = {
  /** Dark-Mode Hintergrund (tieferes Blau als bisheriges #030712) */
  background: "#090d16",

  /** Bento/Glass-Paper: dunkles Blau-Glas mit 75% Deckkraft */
  paper: "rgba(15, 23, 42, 0.75)",

  /** Primärfarbe (Indigo-500) */
  primary: "#6366f1",

  /** Sekundärfarbe (Emerald-500) */
  secondary: "#10b981",

  /** Card-Border: 1px, 8% Weiß */
  border: "1px solid rgba(255, 255, 255, 0.08)",

  /** Border-Radius für Bento-Cards */
  borderRadius: 14,

  /** Border nur als Farbe (für borderColor-Slots) */
  borderColor: "rgba(255, 255, 255, 0.08)",

  /** Glass-Blur-Stärke für Bento-Paper */
  backdropBlur: "16px",

  /** Text-Vordergrund im Dark-Mode */
  foreground: "#f1f5f9",

  /** Gedämpfter Text */
  mutedForeground: "#94a3b8",
} as const;

export type ThemeTokens = typeof THEME;

/** Framer-Motion-Varianten für Bento-Grid-Karten (staggered Reveal) */
export const bentoCardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

/** Inline-Style für eine Bento-Glass-Card (Nutzen ohne Tailwind-Abhängigkeit) */
export function bentoCardStyle(): React.CSSProperties {
  return {
    background: THEME.paper,
    border: THEME.border,
    borderRadius: THEME.borderRadius,
    backdropFilter: `blur(${THEME.backdropBlur})`,
  };
}