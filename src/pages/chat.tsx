import { useState } from "react";
import { Hash, Paperclip, Send, Gem, Spade, Trophy, Swords, Target } from "lucide-react";
import { SocialShell } from "@/components/layout/social-shell";
import { StaggerIn } from "@/components/layout/game-ui";
import {
  chatChannels,
  chatMessages,
} from "@/data/social-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/social";

const avatarIcons = {
  gem: Gem,
  spade: Spade,
  trophy: Trophy,
  swords: Swords,
  target: Target,
};

const borderColors = {
  gold: "border-gold",
  silver: "border-[#b3c1d1]",
  bronze: "border-[#e09c6a]",
  default: "border-border",
};

export default function ChatPage() {
  const [draft, setDraft] = useState("");

  return (
    <SocialShell activeTab="chat">
      <div className="flex min-h-0 flex-1">
        {/* Left sidebar */}
        <aside className="hidden shrink-0 flex-col gap-5 border-r border-border bg-[#0d0e15] p-4 md:flex md:w-56 lg:w-64 xl:p-6">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase text-gold">Channels</p>
            <ul className="space-y-1">
              {chatChannels.map((ch) => (
                <li key={ch.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13px]",
                      ch.active
                        ? "bg-[#1c1f2b] font-bold text-[#f3f4f6]"
                        : "font-medium text-[#9ca3af] hover:bg-[#1c1f2b]/50",
                    )}
                  >
                    <Hash className="size-3.5 shrink-0" />
                    {ch.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {/* <p className="mb-2 text-[11px] font-bold uppercase text-gold">Direct Messages</p>
            <ul className="space-y-0.5">
              {directMessages.map((dm) => (
                <li key={dm.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-[#9ca3af] hover:text-white"
                  >
                    <span
                      className={cn(
                        "size-2.5 shrink-0 rounded-sm",
                        dm.online ? "bg-green" : "bg-[#6b7280]",
                      )}
                    />
                    {dm.team}
                  </button>
                </li>
              ))}
            </ul> */}
          </div>
        </aside>

        {/* Main chat */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-bg-card px-4 py-4 sm:px-5">
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="font-serif text-lg font-black text-gold-light sm:text-xl">
                # General Chat
              </h2>
              <span className="hidden size-1.5 rounded-full bg-green sm:inline-block" />
              <p className="text-xs text-[#9ca3af] sm:text-[13px]">
                Open forum for table banter and live trading
              </p>
            </div>
            {/* <span className="rounded-md bg-[#1f2535] px-3 py-1.5 text-xs text-[#9ca3af]">
              13 Teams Connected
            </span> */}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <StaggerIn className="space-y-4" stepMs={40}>
              {chatMessages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </StaggerIn>
          </div>

          <div className="shrink-0 border-t border-border bg-bg-card p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex min-w-0 flex-1 items-center rounded-lg border border-border bg-bg-input px-3 py-2.5 sm:px-4 sm:py-3">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message to the table..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-text-muted outline-none"
                />
                <Paperclip className="ml-2 size-4 shrink-0 text-[#9ca3af]" />
              </div>
              <Button size="md" className="size-10 shrink-0 rounded-full p-0 sm:size-11">
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Online teams */}
        {/* <aside className="hidden shrink-0 flex-col border-l border-border bg-[#0d0e15] p-4 xl:flex xl:w-48">
          <p className="mb-3 text-[11px] font-bold uppercase text-gold">
            Online Teams ({onlineTeams.length})
          </p>
          <ul className="space-y-1 overflow-y-auto">
            {onlineTeams.map((team) => (
              <li
                key={team}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-[13px]",
                  team.includes("(You)") ? "font-bold text-gold" : "text-[#9ca3af]",
                )}
              >
                <span className="size-2 shrink-0 rounded-full bg-green" />
                <span className="truncate">{team}</span>
              </li>
            ))}
          </ul>
        </aside> */}
      </div>
    </SocialShell>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const Icon = avatarIcons[message.icon];
  const border = borderColors[message.borderColor ?? "default"];
  return (
    <div className="flex gap-3">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border bg-[#1c1f2b]",
          border,
        )}
      >
        <Icon className="size-4 text-gold-muted" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
          <span className="text-[13px] font-bold text-[#f3f4f6]">{message.team}</span>
          <span className="rounded bg-[#1f2535] px-1.5 py-0.5 text-[9px] text-[#9ca3af]">
            #{message.rank}
          </span>
          <span className="text-[11px] text-[#6b7280]">{message.time}</span>
        </div>
        <div className="inline-block max-w-full rounded-lg border border-border bg-[#141722] px-3 py-2.5 sm:max-w-[700px]">
          <p className="text-[13px] leading-relaxed text-[#f3f4f6]">{message.text}</p>
        </div>
      </div>
    </div>
  );
}
