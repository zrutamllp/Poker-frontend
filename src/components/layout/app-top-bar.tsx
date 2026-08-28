import { NavLink } from "react-router-dom";
import { Spade } from "lucide-react";
import { CURRENT_ROUND, PLAYER_COINS, PLAYER_TEAM } from "@/data/social-data";
import { TOTAL_ROUNDS } from "@/data/game-data";
import { cn } from "@/lib/utils";
import type { AppNavTab } from "@/types/social";

const navTabs: { id: AppNavTab; label: string; path: string }[] = [
  { id: "rules", label: "Game Rules", path: "/instructions" },
  { id: "inbox", label: "Inbox", path: "/inbox" },
  { id: "chat", label: "Chat", path: "/chat" },
  { id: "funds", label: "Funds", path: "/funds" },
];

interface AppTopBarProps {
  activeTab?: AppNavTab;
}

export function AppTopBar({ activeTab }: AppTopBarProps) {
  return (
    <header className="shrink-0 border-b border-border bg-[#0d0e15] px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Spade className="size-8 shrink-0 text-gold sm:size-9" />
          <div className="min-w-0">
            <h1 className="truncate font-serif text-lg font-black text-gold-light sm:text-xl lg:text-[26px]">
              THE CULTURE TABLE
            </h1>
            <p className="truncate text-[10px] font-bold uppercase tracking-wide text-gold-muted">
              Gamified Team Performance Tracker
            </p>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-1 rounded-xl bg-[#161922] p-1 sm:gap-2">
          {navTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:px-5 sm:py-2.5 sm:text-sm",
                activeTab === tab.id
                  ? "bg-gold font-extrabold text-text-dark"
                  : "text-[#9ca3af] hover:text-white",
              )}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
          <span className="rounded border border-gold-muted bg-bg-elevated px-3 py-1.5 text-xs font-bold text-gold">
            ROUND {CURRENT_ROUND} OF {TOTAL_ROUNDS}
          </span>
          <div className="hidden text-right sm:block">
            <p className="text-[10px] font-medium text-[#6b7280]">PLAYING AS</p>
            <p className="font-serif text-base font-black text-[#f3f4f6] lg:text-lg">
              {PLAYER_TEAM.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border-[1.5px] border-gold bg-[#1a1f2d] px-3 py-1.5 sm:px-4 sm:py-2">
            <span className="flex size-4 items-center justify-center rounded-lg border border-white bg-gold font-serif text-[9px] font-black text-text-dark sm:size-[18px] sm:text-[11px]">
              $
            </span>
            <span className="text-sm font-bold text-white">
              {PLAYER_COINS}{" "}
              <span className="hidden text-xs text-gold sm:inline">Culture Coins</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
