import { minigameTheme } from "@/components/minigames/minigame-theme";

/** Crossword-specific tokens; base palette shared with all minigames */
export const crosswordTheme = {
  pageBg: minigameTheme.pageBg,
  card: minigameTheme.card,
  cardAccent: "from-[#06b6d4]/15 via-transparent to-transparent",
  heading: "text-gold-light",
  body: "text-text-muted",
  emphasis: "text-[#f3f4f6]",
  label: "text-green-muted",
  gridFrame: "border-2 border-gold-muted/60 bg-[#05130a]",
  gridBlock: "bg-[#05130a]",
  gridCell: "border border-gold-muted/30 bg-[#0c1f16]",
  gridCellWord: "bg-[#06b6d4]/10",
  gridCellSelected: "bg-gold/35 ring-2 ring-inset ring-gold/60",
  gridCellError: "bg-[#3a1616]/80",
  gridCellCorrect: "bg-green/20",
  gridLetter: "text-[#f3f4f6]",
  gridNumber: "text-gold-muted",
  btnPrimary:
    "rounded-lg border border-green/60 bg-green/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green transition-colors hover:bg-green/20",
  btnGold:
    "rounded-full border border-white bg-gold px-8 py-3 font-serif text-sm font-black text-text-dark shadow-[0_8px_12px_rgba(212,175,55,0.25)]",
  btnGhost:
    "rounded-lg border border-gold-muted/50 bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-light transition-colors hover:bg-gold/20",
  clueActive: "bg-gold/20 text-gold-light",
  clueDone: "text-green",
  divider: "border-border",
} as const;
