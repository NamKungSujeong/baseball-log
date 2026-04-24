"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameLog, GameResult } from "@/types/game-log";

interface LogCalendarProps {
  logs: GameLog[];
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

const TODAY = new Date();
const TODAY_STR = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, "0")}-${String(TODAY.getDate()).padStart(2, "0")}`;
const MIN_YEAR = TODAY.getFullYear() - 10;
const MAX_YEAR = TODAY.getFullYear() + 10;

function getResultLabel(result: GameResult): string {
  if (result === "win") return "승";
  if (result === "lose") return "패";
  return "무";
}

function getResultStyle(result: GameResult): React.CSSProperties {
  if (result === "win") {
    return { color: "#34d399", borderColor: "#34d399", backgroundColor: "rgba(52,211,153,0.12)" };
  }
  if (result === "lose") {
    return { color: "#fb7185", borderColor: "#fb7185", backgroundColor: "rgba(251,113,133,0.12)" };
  }
  return { color: "#94a3b8", borderColor: "#94a3b8", backgroundColor: "rgba(148,163,184,0.12)" };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function LogCalendar({ logs }: LogCalendarProps) {
  const router = useRouter();
  const [year, setYear] = useState(TODAY.getFullYear());
  const [month, setMonth] = useState(TODAY.getMonth()); // 0-indexed

  // date → log 매핑
  const logByDate = new Map<string, GameLog>();
  logs.forEach((log) => {
    logByDate.set(log.date, log);
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // 달력 셀 배열 (빈칸 + 날짜)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // 6행으로 맞추기
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (month === 0) {
      if (year - 1 < MIN_YEAR) return;
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      if (year + 1 > MAX_YEAR) return;
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  function isPrevDisabled() {
    return year === MIN_YEAR && month === 0;
  }

  function isNextDisabled() {
    return year === MAX_YEAR && month === 11;
  }

  function handleDateClick(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const log = logByDate.get(dateStr);
    if (log) {
      router.push(`/logs/${log.id}`);
    } else {
      router.push(`/logs/new?date=${dateStr}`);
    }
  }

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div
      className="rounded-3xl overflow-hidden shadow-sm"
      style={{ background: "var(--theme-bg-card)" }}
    >
      {/* 헤더 */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "var(--theme-primary)" }}
      >
        <button
          onClick={prevMonth}
          disabled={isPrevDisabled()}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.2)" }}
          aria-label="이전 달"
        >
          <ChevronLeft size={16} className="text-white" />
        </button>

        <div className="text-center">
          <p className="text-white font-bold text-base tracking-wide">
            {year}년 {month + 1}월
          </p>
          {year === TODAY.getFullYear() && month === TODAY.getMonth() && (
            <p className="text-white/70 text-xs mt-0.5">이번 달 ✦</p>
          )}
        </div>

        <button
          onClick={nextMonth}
          disabled={isNextDisabled()}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.2)" }}
          aria-label="다음 달"
        >
          <ChevronRight size={16} className="text-white" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 px-2 pt-3 pb-1">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className="text-center text-xs font-bold py-1"
            style={{
              color:
                i === 0
                  ? "#ef4444"
                  : i === 6
                  ? "var(--theme-primary)"
                  : "#9ca3af",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="px-2 pb-4">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              if (!day) {
                return <div key={di} className="aspect-square" />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const log = logByDate.get(dateStr);
              const isToday = dateStr === TODAY_STR;
              const isSunday = di === 0;
              const isSaturday = di === 6;

              return (
                <button
                  key={di}
                  onClick={() => handleDateClick(day)}
                  className="aspect-square flex flex-col items-center justify-center relative rounded-xl active:scale-90 transition-transform"
                  style={
                    isToday
                      ? {
                          background: "var(--theme-primary)",
                        }
                      : undefined
                  }
                >
                  {/* 승/패/무 스탬프 (배경에 깔리게) */}
                  {log && (
                    <span
                      className="absolute inset-1 flex items-center justify-center rounded-lg text-base font-black opacity-30 select-none pointer-events-none"
                      style={{
                        ...getResultStyle(log.result),
                        fontSize: "1.1rem",
                        letterSpacing: "-0.05em",
                        border: `2px solid`,
                        borderColor: getResultStyle(log.result).borderColor,
                        transform: "rotate(-12deg)",
                      }}
                    >
                      {getResultLabel(log.result)}
                    </span>
                  )}

                  {/* 날짜 숫자 */}
                  <span
                    className="text-sm font-semibold leading-none relative z-10"
                    style={{
                      color: isToday
                        ? "white"
                        : isSunday
                        ? "#ef4444"
                        : isSaturday
                        ? "var(--theme-primary)"
                        : "var(--theme-text, #374151)",
                    }}
                  >
                    {day}
                  </span>

                  {/* 기록 있는 날 점 표시 */}
                  {log && (
                    <span
                      className="w-1 h-1 rounded-full mt-0.5 relative z-10"
                      style={{
                        background: isToday
                          ? "rgba(255,255,255,0.8)"
                          : getResultStyle(log.result).color,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-4 pb-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded border-2 flex items-center justify-center font-black text-[9px]" style={{ color: "#22c55e", borderColor: "#22c55e" }}>승</span>
          승리
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded border-2 flex items-center justify-center font-black text-[9px]" style={{ color: "#ef4444", borderColor: "#ef4444" }}>패</span>
          패배
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded border-2 flex items-center justify-center font-black text-[9px]" style={{ color: "#9ca3af", borderColor: "#9ca3af" }}>무</span>
          무승부
        </span>
      </div>
    </div>
  );
}
