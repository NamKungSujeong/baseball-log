import type { GameResult } from "@/types/game-log";

interface ResultBadgeProps {
  result: GameResult;
  size?: "sm" | "md";
}

const resultStyle: Record<GameResult, string> = {
  win: "bg-green-100 text-green-700",
  lose: "bg-red-100 text-red-600",
  draw: "bg-gray-100 text-gray-600",
};

const resultLabel: Record<GameResult, string> = {
  win: "승",
  lose: "패",
  draw: "무",
};

export function ResultBadge({ result, size = "md" }: ResultBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-bold
        ${resultStyle[result]}
        ${size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-base"}
      `}
    >
      {resultLabel[result]}
    </span>
  );
}
