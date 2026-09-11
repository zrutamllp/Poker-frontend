import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Rules", path: "/instructions", icon: "♠", activePaths: ["/instructions"] },
  { label: "Inbox", path: "/inbox", icon: "✉", activePaths: ["/inbox"] },
  { label: "Chat", path: "/chat", icon: "♦", activePaths: ["/chat"] },
  { label: "Funds", path: "/funds", icon: "₿", activePaths: ["/funds"] },
];

interface NavIconBarProps {
  className?: string;
}

/** Compact icon nav — Rules / Inbox / Chat / Funds (Figma nav-icon-bar) */
export function NavIconBar({ className }: NavIconBarProps) {
  return (
    <nav
      className={cn(
        "game-stagger-in game-animate flex gap-1 rounded-xl border border-gold/50 bg-[rgba(20,20,31,0.92)] p-1.5 shadow-lg backdrop-blur-sm",
        className,
      )}
    >
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path} className="group">
          {({ isActive }) => (
            <span className="flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1 sm:px-2">
              <span
                className={cn(
                  "game-nav-icon flex size-7 items-center justify-center rounded-xl border-[1.5px] text-sm text-gold",
                  isActive
                    ? "border-gold/60 bg-[rgba(43,79,23,0.9)] shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                    : "border-gold/60 bg-[rgba(64,46,13,0.9)] group-hover:bg-[rgba(43,79,23,0.7)]",
                )}
              >
                {item.icon}
              </span>
              <span className="text-[8px] font-semibold tracking-wide text-[#bf9e4d]">
                {item.label}
              </span>
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
