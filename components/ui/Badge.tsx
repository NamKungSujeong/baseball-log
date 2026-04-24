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
    bg: "#f0fdf4",
    text: "#047857",
    border: "#a7f3d0",
    dot: "#34d399",
  },
  lose: {
    label: "패배",
    bg: "#fff1f2",
    text: "#be123c",
    border: "#fecdd3",
    dot: "#fb7185",
  },
  draw: {
    label: "무",
    bg: "#f8fafc",
    text: "#64748b",
    border: "#cbd5e1",
    dot: "#94a3b8",
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
