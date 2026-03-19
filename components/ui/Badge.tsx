import type { GameResult } from "@/types/game-log";

interface ResultBadgeProps {
  result: GameResult;
  size?: "sm" | "md";
}

const resultConfig: Record<
  GameResult,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  win: {
    label: "승리",
    bg: "#DCFCE7",
    text: "#16A34A",
    border: "#86EFAC",
    dot: "#4ADE80",
  },
  lose: {
    label: "패배",
    bg: "#FEE2E2",
    text: "#DC2626",
    border: "#FCA5A5",
    dot: "#F87171",
  },
  draw: {
    label: "무",
    bg: "#F3F4F6",
    text: "#6B7280",
    border: "#D1D5DB",
    dot: "#9CA3AF",
  },
};

export function ResultBadge({ result, size = "md" }: ResultBadgeProps) {
  const cfg = resultConfig[result];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-bold border"
      style={{
        background: cfg.bg,
        color: cfg.text,
        borderColor: cfg.border,
        padding: size === "sm" ? "2px 10px" : "4px 14px",
        fontSize: size === "sm" ? "11px" : "13px",
      }}
    >
      <span
        className="rounded-full shrink-0"
        style={{
          width: size === "sm" ? 6 : 7,
          height: size === "sm" ? 6 : 7,
          background: cfg.dot,
          display: "inline-block",
        }}
      />
      {cfg.label}
    </span>
  );
}
