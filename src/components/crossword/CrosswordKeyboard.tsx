import { Delete, ChevronLeft, ChevronRight, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

interface CrosswordKeyboardProps {
  onKey: (key: string) => void;
  onBackspace: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleDirection: () => void;
  disabled?: boolean;
}

export function CrosswordKeyboard({
  onKey,
  onBackspace,
  onPrev,
  onNext,
  onToggleDirection,
  disabled,
}: CrosswordKeyboardProps) {
  return (
    <div className="w-full px-2 py-2 lg:hidden">
      <div className="mb-2 flex justify-center gap-2">
        <KeyButton onClick={onPrev} disabled={disabled} wide>
          <ChevronLeft className="size-4" />
        </KeyButton>
        <KeyButton onClick={onToggleDirection} disabled={disabled} wide>
          <ArrowDownUp className="size-4" />
        </KeyButton>
        <KeyButton onClick={onNext} disabled={disabled} wide>
          <ChevronRight className="size-4" />
        </KeyButton>
      </div>
      {ROWS.map((row, ri) => (
        <div key={ri} className="mb-1 flex justify-center gap-1">
          {row.map((key) => (
            <KeyButton key={key} onClick={() => onKey(key)} disabled={disabled}>
              {key}
            </KeyButton>
          ))}
          {ri === 2 && (
            <KeyButton onClick={onBackspace} disabled={disabled} wide>
              <Delete className="size-4" />
            </KeyButton>
          )}
        </div>
      ))}
    </div>
  );
}

function KeyButton({
  children,
  onClick,
  disabled,
  wide,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-10 items-center justify-center rounded-lg border border-gold-muted/40 bg-[#0c1f16]",
        "font-sans text-sm font-semibold text-gold-light active:bg-gold/20",
        wide ? "min-w-[44px] px-2" : "min-w-[32px] flex-1 max-w-[36px]",
        disabled && "opacity-40",
      )}
    >
      {children}
    </button>
  );
}
