import { useState, useRef, useEffect } from "react";
import { ChevronDown, Crown } from "lucide-react";
import type { PlayerRole } from "@/types/game";
import { playerRoles } from "@/data/game-data";
import { cn } from "@/lib/utils";

interface RoleSelectProps {
  value: PlayerRole | "";
  onChange: (role: PlayerRole) => void;
}

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-green-muted">
        <span className="size-1.5 rounded-full bg-green-muted" />
        Role
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 rounded-md border-[1.5px] border-border bg-bg-input p-3 text-left focus:border-gold-muted outline-none sm:gap-3 sm:p-4"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Crown className="size-5 shrink-0 text-gold-muted" />
        <span className={cn("flex-1 text-[15px]", value ? "text-white" : "text-text-muted")}>
          {value || "Select your role"}
        </span>
        <ChevronDown className={cn("size-5 text-text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border-[1.5px] border-border bg-bg-input shadow-xl"
        >
          {playerRoles.map((role) => (
            <li key={role} role="option" aria-selected={value === role}>
              <button
                type="button"
                onClick={() => {
                  onChange(role);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-[15px] transition-colors last:border-0 hover:bg-bg-card-alt",
                  value === role ? "bg-bg-card-alt text-gold" : "text-text-muted",
                )}
              >
                <span className="size-1.5 rounded-full bg-green-muted" />
                {role}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
