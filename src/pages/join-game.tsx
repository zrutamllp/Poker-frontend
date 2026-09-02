import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Key, User, Users } from "lucide-react";
import { AuthScene } from "@/components/layout/auth-scene";
import { BrandHeader } from "@/components/layout/brand-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleSelect } from "@/components/common/role-select";
import type { PlayerRole } from "@/types/game";

export default function JoinGamePage() {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [role, setRole] = useState<PlayerRole | "">("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/team-setup");
  }

  return (
    <AuthScene>
      <div className="flex w-full max-w-md flex-col items-center gap-6 sm:gap-8 lg:gap-12">
        <BrandHeader size="sm" className="gap-2 sm:gap-3" />

        <form
          onSubmit={handleSubmit}
          className="game-card game-stagger-in game-animate relative w-full rounded-2xl border-2 border-gold p-6 shadow-[0_24px_48px_rgba(0,0,0,0.65)] sm:rounded-3xl sm:p-10"
          style={{ animationDelay: "80ms" }}
        >
          <div className="absolute inset-0 rounded-2xl bg-bg-card-alt/95 sm:rounded-3xl" />
          <div className="relative flex flex-col gap-5 sm:gap-8">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-black text-white sm:text-[28px]">
                Enter the Table
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                Secure your buy-in and sit down at the team table
              </p>
            </div>

            <hr className="border-border" />

            <div className="flex flex-col gap-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-green-muted">
                  <span className="size-1.5 rounded-full bg-green-muted" />
                  Game Code
                </label>
                <Input
                  icon={<Key className="size-5 text-gold-muted" />}
                  placeholder="Enter 6-digit game code"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  maxLength={6}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-green-muted">
                  <span className="size-1.5 rounded-full bg-green-muted" />
                  Your Name
                </label>
                <Input
                  icon={<User className="size-5 text-gold-muted" />}
                  placeholder="Enter your display name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-green-muted">
                  <span className="size-1.5 rounded-full bg-green-muted" />
                  Team Code
                </label>
                <Input
                  icon={<Users className="size-5 text-gold-muted" />}
                  placeholder="Enter your team code"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                />
              </div>

              <RoleSelect value={role} onChange={setRole} />
            </div>

            <Button type="submit" size="lg" className="w-full font-serif font-black">
              <ArrowRight className="size-5" />
              JOIN TABLE
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-text-muted">
          Don&apos;t have a game code?{" "}
          <a href="#" className="font-semibold text-gold underline">
            Contact your game host
          </a>
        </p>
      </div>
    </AuthScene>
  );
}
