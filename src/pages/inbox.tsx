import { useState } from "react";
import {
  Crown,
  Wallet,
  Cpu,
  Swords,
  Gem,
  Coins,
  Mail,
  Trophy,
  Shield,
  Settings,
} from "lucide-react";
import { SocialShell } from "@/components/layout/social-shell";
import { inboxCategories, inboxMessages } from "@/data/social-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InboxMessage } from "@/types/social";

const messageIcons = {
  crown: Crown,
  wallet: Wallet,
  chip: Cpu,
  swords: Swords,
  gem: Gem,
  coins: Coins,
  trophy: Trophy,
  shield: Shield,
  settings: Settings,
};

const categoryIcons = {
  mail: Mail,
  trophy: Trophy,
  shield: Shield,
  settings: Settings,
};

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState("2");
  const selected = inboxMessages.find((m) => m.id === selectedId) ?? inboxMessages[0];

  return (
    <SocialShell activeTab="inbox">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Categories sidebar */}
        <aside className="shrink-0 border-b border-border bg-[#0d0e15] p-4 lg:w-64 lg:border-b-0 lg:border-r xl:w-72">
          <p className="mb-3 text-[11px] font-bold uppercase text-gold">Categories</p>
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
            {inboxCategories.map((cat) => {
              const Icon = categoryIcons[cat.icon];
              return (
                <li key={cat.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors lg:min-w-0",
                      cat.id === "all"
                        ? "border-gold bg-[#1c1f2b]"
                        : "border-transparent hover:bg-[#1c1f2b]/50",
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-gold-muted" />
                    <span className="flex-1 truncate text-sm font-bold text-[#f3f4f6] lg:text-base">
                      {cat.label}
                    </span>
                    {cat.count != null && (
                      <span className="rounded bg-gold px-1.5 py-0.5 text-[10px] font-extrabold text-text-dark">
                        {cat.count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Message list */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-4 lg:p-6">
          <div className="flex shrink-0 items-center justify-between">
            <p className="text-sm text-[#9ca3af]">Showing {inboxMessages.length} Messages</p>
            <button type="button" className="text-xs text-gold underline">
              Mark all as read
            </button>
          </div>
          <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {inboxMessages.map((msg) => (
              <MessageListItem
                key={msg.id}
                message={msg}
                selected={msg.id === selectedId}
                onSelect={() => setSelectedId(msg.id)}
              />
            ))}
          </ul>
        </section>

        {/* Detail panel */}
        <aside className="hidden min-h-0 w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-border bg-[#0d0e15] p-5 lg:flex lg:w-96 lg:border-l lg:border-t-0 xl:w-[420px] xl:p-7">
          <MessageDetail message={selected} />
        </aside>
      </div>
    </SocialShell>
  );
}

function MessageListItem({
  message,
  selected,
  onSelect,
}: {
  message: InboxMessage;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = messageIcons[message.icon];
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full gap-3 rounded-xl border p-3 text-left transition-colors sm:gap-4 sm:p-4",
          selected
            ? "border-[1.5px] border-gold bg-[#1a2238]"
            : "border-border bg-bg-card hover:border-gold/30",
        )}
      >
        <span
          className={cn(
            "mt-2 size-2 shrink-0 rounded-full",
            message.unread ? "bg-gold" : "border border-[#6b7280]",
          )}
        />
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-[#1c1f2b]">
          <Icon className="size-4 text-gold-muted" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-extrabold text-[#f3f4f6]">
                {message.sender}
              </span>
              {message.senderTag && (
                <span className="shrink-0 rounded bg-[#1f2535] px-1.5 py-0.5 text-[9px] font-bold text-[#9ca3af]">
                  {message.senderTag}
                </span>
              )}
            </div>
            <span className="shrink-0 text-xs text-[#6b7280]">{message.timeAgo}</span>
          </div>
          <p className="truncate text-[13px] font-bold text-[#f3f4f6]">{message.subject}</p>
          <p className="truncate text-xs text-[#9ca3af]">{message.preview}</p>
        </div>
      </button>
    </li>
  );
}

function MessageDetail({ message }: { message: InboxMessage }) {
  const Icon = messageIcons[message.icon];
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full border border-gold bg-[#1e2436]">
          <Icon className="size-5 text-gold" />
        </span>
        <div>
          <p className="font-serif text-lg font-black text-[#f3f4f6]">{message.sender}</p>
          <p className="text-[11px] text-[#9ca3af]">
            {message.teamRank ? `Team Rank #${message.teamRank} • active_pot` : "System"}
          </p>
        </div>
      </div>
      <hr className="border-border" />
      <div>
        <h2 className="font-serif text-xl font-black text-gold-light">{message.subject}</h2>
        <p className="mt-1 text-xs text-[#6b7280]">Received {message.timeAgo}</p>
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-[#f3f4f6]">{message.body}</p>
      {message.requestAmount != null && (
        <div className="rounded-xl border border-gold-muted bg-[#141926] p-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#9ca3af]">Total Request Amount:</span>
            <span className="font-extrabold text-gold">{message.requestAmount} Coins</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-[#9ca3af]">Contracted Return:</span>
            <span className="font-bold text-green">
              {message.returnAmount} Coins (Round {message.returnRound})
            </span>
          </div>
        </div>
      )}
      {message.requestAmount != null && (
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 rounded-full border-border py-3">
            Decline
          </Button>
          <Button className="flex-1 rounded-full py-3 font-extrabold">Accept & Send</Button>
        </div>
      )}
    </>
  );
}
