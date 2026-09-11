import { useState } from "react";
import {
  Coins,
  TrendingUp,
  Handshake,
  Wallet,
  Gem,
  Crown,
  ChevronDown,
} from "lucide-react";
import { SocialShell } from "@/components/layout/social-shell";
import { StaggerIn } from "@/components/layout/game-ui";
import {
  fundRequests,
  PLAYER_COINS,
} from "@/data/social-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const requestIcons = {
  wallet: Wallet,
  gem: Gem,
  crown: Crown,
};

export default function FundsPage() {
  const [lendAmount, setLendAmount] = useState(10);

  return (
    <SocialShell activeTab="funds">
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Summary cards */}
        <StaggerIn className="mb-6 grid gap-4 sm:grid-cols-2 lg:mb-8 lg:grid-cols-3 lg:gap-5" stepMs={70}>
          <StatCard
            label="Total Balance"
            value={`${PLAYER_COINS} Coins`}
            sub="Available for betting and lending"
            icon={Coins}
            borderColor="border-gold"
          />
          <StatCard
            label="Coins Earned This Round"
            value="+15 Coins"
            sub="From correct Round 2 predictions"
            icon={TrendingUp}
            borderColor="border-green"
            valueClass="text-[#f3f4f6]"
          />
          <StatCard
            label="Coins Lent Out"
            value="20 Coins"
            sub="Committed to active team contracts"
            icon={Handshake}
            borderColor="border-gold"
            className="sm:col-span-2 lg:col-span-1"
          />
        </StaggerIn>

        <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
          {/* Incoming requests */}
          <section className="min-w-0 flex-1">
            <h2 className="font-serif text-xl font-black text-gold-light sm:text-[22px]">
              Incoming Fund Requests
            </h2>
            <p className="mt-1 text-[13px] text-[#9ca3af]">
              Authorise active loans to partner teams at the table
            </p>
            <ul className="mt-4 space-y-3">
              {fundRequests.map((req) => {
                const Icon = requestIcons[req.icon];
                return (
                  <li
                    key={req.id}
                    className="rounded-xl border border-border bg-[rgba(17,21,32,0.95)] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 items-center justify-center rounded-xl border border-gold bg-[#1e2436]">
                          <Icon className="size-3.5 text-gold" />
                        </span>
                        <span className="font-bold text-[#f3f4f6]">{req.team}</span>
                      </div>
                      <span className="font-extrabold text-gold">{req.amount} Coins</span>
                    </div>
                    <p className="mt-3 text-[13px] text-[#9ca3af]">
                      Note: <span className="text-[#f3f4f6]">&quot;{req.note}&quot;</span>
                    </p>
                    <p className="mt-1 text-[11px] text-[#6b7280]">
                      Contract Terms: {req.contractTerms}
                    </p>
                    {/* {req.status === "pending" ? (
                      <div className="mt-3 flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-full border-border"
                        >
                          Decline
                        </Button>
                        <Button size="sm" className="flex-1 rounded-full font-extrabold">
                          Approve & Send
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-md bg-[#2a1f13] py-1.5 text-center text-[11px] font-semibold text-gold">
                        Sent (Pending Return)
                      </div>
                    )} */}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* History + lend form */}
          <section className="w-full shrink-0 xl:w-[500px]">
            {/* <h2 className="font-serif text-xl font-black text-gold-light sm:text-[22px]">
              Lending & Transactions History
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-[rgba(17,21,32,0.95)]">
              <div className="grid grid-cols-4 gap-2 bg-[#161922] p-3 text-[11px] font-bold uppercase text-[#9ca3af]">
                <span>Date</span>
                <span className="col-span-1">Team</span>
                <span>Type</span>
                <span className="text-right">Amount</span>
              </div>
              {fundTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-4 gap-2 border-b border-border/50 p-3 text-sm last:border-0"
                >
                  <span className="text-xs text-[#6b7280]">{tx.date}</span>
                  <span className="truncate font-semibold text-[#f3f4f6]">{tx.team}</span>
                  <span className="text-xs text-[#9ca3af]">{tx.type}</span>
                  <span
                    className={cn(
                      "text-right font-bold",
                      tx.amount > 0 ? "text-green" : "text-[#f3f4f6]",
                    )}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </span>
                </div>
              ))}
            </div> */}

            {/* Lend form */}
            <div className="mt-5 rounded-2xl border-[1.5px] border-gold bg-[#0f2116] p-5 shadow-[0_0_6px_rgba(212,175,55,0.15)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg font-black text-gold-light">
                  LEND TO TEAM
                </h3>
                <span className="rounded-md border border-gold bg-[#291f0b] px-1.5 py-0.5 text-[10px] font-extrabold text-gold">
                  CONTRACT PRO
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase text-[#9ca3af]">
                    Target Team
                  </label>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-gold-muted bg-[#061a0e] p-3 text-left"
                  >
                    <span className="flex items-center gap-2 text-[13px] font-bold text-[#f3f4f6]">
                      <span className="size-4 rounded-lg bg-gold" />
                      Royal Flush
                    </span>
                    <ChevronDown className="size-3 text-[#9ca3af]" />
                  </button>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase text-[#9ca3af]">
                    Amount to Lend
                  </label>
                  <div className="flex items-end gap-3">
                    <div className="flex-1 rounded-lg border border-border bg-[#061a0e] p-2.5">
                      <span className="text-sm font-bold text-[#f3f4f6]">
                        {lendAmount} Coins
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setLendAmount(Math.max(5, lendAmount - 5))}
                        className="flex size-9 items-center justify-center rounded-md border border-border bg-[#061a0e] font-bold text-[#9ca3af]"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setLendAmount(lendAmount + 5)}
                        className="flex size-9 items-center justify-center rounded-md border border-border bg-[#061a0e] font-bold text-[#9ca3af]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase text-[#9ca3af]">
                    Optional Contract Memo
                  </label>
                  <div className="rounded-lg border border-border bg-[#061a0e] p-3 text-[13px] text-[#6b7280]">
                    e.g. Terms discussed in Round 3 chat...
                  </div>
                </div>
                <Button className="w-full rounded-full py-3 font-extrabold">
                  SEND SECURE FUNDS
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SocialShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  borderColor,
  valueClass,
  className,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  borderColor: string;
  valueClass?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "game-card rounded-2xl border-[1.5px] bg-bg-card p-5 sm:p-6",
        borderColor,
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] text-[#9ca3af]">{label}</p>
        <Icon className="size-5 text-gold-muted" />
      </div>
      <p className={cn("font-serif text-2xl font-black sm:text-[28px]", valueClass ?? "text-[#f3f4f6]")}>
        {value}
      </p>
      <p className="mt-1 text-xs text-[#6b7280]">{sub}</p>
    </div>
  );
}
