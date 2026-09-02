import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckCircle, CircleX, Edit } from "lucide-react";
import { AuthScene } from "@/components/layout/auth-scene";
import { BrandHeader } from "@/components/layout/brand-header";
import { StaggerIn } from "@/components/layout/game-ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  playerClues,
  suggestedTeamNames,
  TABLE_CODE,
} from "@/data/game-data";
import { cn } from "@/lib/utils";

function LoadingDots() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="game-loading-dot size-2 rounded-full bg-gold" />
      ))}
    </div>
  );
}

export default function TeamSetupPage() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("The Aces");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/lobby");
  }

  return (
    <AuthScene>
      <div className="flex w-full max-w-4xl flex-col items-center gap-8 sm:gap-10 lg:gap-12">
        <BrandHeader size="sm" edition={`TABLE 7 LOBBY`} />

        <div className="flex w-full flex-col gap-6 sm:gap-8">
          {/* Team members row */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase">
              <span className="text-green-muted">
                TEAM MEMBERS JOINED ({playerClues.length})
              </span>
              <span className="text-gold">TABLE CODE: {TABLE_CODE}</span>
            </div>

            <StaggerIn className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4" stepMs={50}>
              {playerClues.map((member) => (
                <div
                  key={member.id}
                  className="game-card flex flex-col items-center gap-3 rounded-xl border-[1.5px] border-border bg-bg-input p-4"
                >
                  <span
                    className="flex size-14 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initials}
                  </span>
                  <p className="text-center text-[15px] font-bold text-white">{member.name}</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-green bg-green/10 px-2.5 py-1 text-[11px] font-bold text-green">
                    <Check className="size-3" />
                    READY
                  </span>
                </div>
              ))}
            </StaggerIn>
          </section>

          {/* Team name panel */}
          <form
            onSubmit={handleSubmit}
            className="rounded-[20px] border-[1.5px] border-gold bg-bg-card-alt/95 p-6 shadow-[0_16px_32px_rgba(0,0,0,0.65)] sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <CircleX className="size-6 shrink-0 text-gold" />
              <h2 className="font-serif text-xl font-black text-white sm:text-[22px]">
                CHOOSE YOUR TEAM NAME
              </h2>
            </div>

            <hr className="mb-6 border-border" />

            <div className="mb-6">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-green-muted">
                <span className="size-1.5 rounded-full bg-green-muted" />
                Selected Team Name
              </label>
              <Input
                icon={<Edit className="size-5 text-gold-muted" />}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>

            <div className="mb-8">
              <p className="mb-3 text-[11px] font-bold uppercase text-green-muted">
                Or select a suggested name:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {suggestedTeamNames.map((name) => {
                  const selected = teamName === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setTeamName(name)}
                      className={cn(
                        "game-btn-sm rounded-[20px] border-[1.5px] px-[18px] py-2.5 text-sm font-semibold transition-colors",
                        selected
                          ? "border-gold bg-gold-light text-[#091d14]"
                          : "border-border bg-bg-input text-text-muted hover:border-gold-muted/60",
                      )}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full font-serif font-black">
              <CheckCircle className="size-5" />
              ENTER THE GAME
            </Button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-text-muted">Waiting for host to start the game...</p>
          <LoadingDots />
        </div>
      </div>
    </AuthScene>
  );
}
