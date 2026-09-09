/** Shared culture-table minigame palette (instructions, crossword, market rush, arcade games) */
export const minigameTheme = {
  pageBg:
    "bg-[radial-gradient(ellipse_at_center,#0b2d1e_0%,#05130a_100%)]",
  header: "border-border bg-[#0c1f16]/40",
  card: "rounded-2xl border border-gold-muted/80 bg-[#0c1f16]/95 shadow-[0_8px_24px_rgba(0,0,0,0.24)] backdrop-blur-sm",
  cardAccent: "from-gold/15 via-transparent to-transparent",
  panel: "rounded-2xl border border-gold-muted/80 bg-[#0c1f16]/95 backdrop-blur-sm",
  heading: "text-gold-light",
  body: "text-text-muted",
  emphasis: "text-[#f3f4f6]",
  label: "text-green-muted",
  statLabel: "text-text-muted",
  statValue: "text-gold-light",
  accent: "text-green",
  highlight: "text-[#06b6d4]",
  warn: "text-[#f59e0b]",
  divider: "border-border",
  tabList: "flex rounded-lg border border-gold-muted/50 bg-[#0c1f16]/90 p-0.5",
  tabActive:
    "bg-green/20 text-gold-light shadow-[0_0_12px_rgba(33,150,83,0.2)]",
  tabInactive: "text-text-muted hover:text-gold-light",
  btnPrimary:
    "rounded-lg border border-green/60 bg-green/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-green transition-colors hover:bg-green/20 disabled:opacity-40",
  btnGhost:
    "rounded-lg border border-gold-muted/50 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold-light transition-colors hover:bg-gold/20 disabled:opacity-40",
  btnGold:
    "rounded-lg border border-green/60 bg-green/10 px-5 py-3 text-sm font-bold uppercase tracking-wide text-green transition-colors hover:bg-green/20 disabled:cursor-not-allowed disabled:opacity-40",
  tileBorder: "border-gold-muted/40",
  tileBg: "bg-[#0c1f16]",
  tileEmpty: "border-gold-muted/30 bg-[#05130a]",
  tileHover: "hover:border-gold/50 hover:shadow-[0_0_12px_rgba(212,175,55,0.2)]",
  keyCorrect: "border-green bg-green/20 text-green",
  keyWrong: "border-gold-muted/30 bg-[#05130a] text-text-muted line-through opacity-60",
  keyUnused:
    "border-gold-muted/40 bg-[#0c1f16] text-[#f3f4f6] hover:border-green/50 hover:bg-green/10",
} as const;
