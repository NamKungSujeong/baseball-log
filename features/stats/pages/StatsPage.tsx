"use client";

import balllogMascotWithNote from "@/assets/images/mascot/balllog-mascot-with-note.png";
import winMascot from "@/assets/images/mascot/win-mascot.png";
import loseMascot from "@/assets/images/mascot/lose-mascot.png";
import { KBO_STADIUMS } from "@/utils/constants/kbo";
import { useLogs } from "@/features/logs/hooks/useLogs";
import type { StadiumId } from "@/types/game-log";
import { PenLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const DIVIDER = (
  <div className="my-5" style={{ borderTop: "1px solid #f0ece6" }} />
);

export default function StatsPage() {
  const { data: logs = [] } = useLogs();

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--theme-primary-light)" }}
        >
          <Image
            src={balllogMascotWithNote}
            alt="mascot"
            width={0}
            height={0}
            className="w-auto h-[60px]"
          />
        </div>
        <p className="text-gray-600 font-bold text-base">
          아직 직관 기록이 없어요
        </p>
        <p className="text-gray-400 text-sm mt-1">첫 번째 직관을 기록해봐요!</p>
        <Link
          href="/logs/new"
          className="mt-5 px-7 py-3 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
          style={{ background: "var(--theme-primary)" }}
        >
          <span className="flex items-center gap-1.5">
            <PenLine size={15} />
            직관 기록하기
          </span>
        </Link>
      </div>
    );
  }

  const total = logs.length;
  const wins = logs.filter((l) => l.result === "win").length;
  const loses = logs.filter((l) => l.result === "lose").length;
  const draws = logs.filter((l) => l.result === "draw").length;
  const winRate = Math.round((wins / total) * 100);
  const isFairy = winRate >= 50;

  // 구장별 통계
  const stadiumCount = logs.reduce<
    Record<StadiumId, { win: number; total: number }>
  >(
    (acc, log) => {
      if (!acc[log.stadiumId]) acc[log.stadiumId] = { win: 0, total: 0 };
      acc[log.stadiumId].total += 1;
      if (log.result === "win") acc[log.stadiumId].win += 1;
      return acc;
    },
    {} as Record<StadiumId, { win: number; total: number }>,
  );

  const stadiumStats = KBO_STADIUMS.filter((s) => stadiumCount[s.id])
    .map((s) => ({ ...s, ...stadiumCount[s.id] }))
    .sort((a, b) => b.total - a.total);

  // 연도별 통계
  const yearMap = logs.reduce<
    Record<string, { win: number; lose: number; draw: number; total: number }>
  >((acc, log) => {
    const y = log.date.slice(0, 4);
    if (!acc[y]) acc[y] = { win: 0, lose: 0, draw: 0, total: 0 };
    acc[y].total += 1;
    if (log.result === "win") acc[y].win += 1;
    else if (log.result === "lose") acc[y].lose += 1;
    else acc[y].draw += 1;
    return acc;
  }, {});

  const yearStats = Object.entries(yearMap).sort((a, b) =>
    b[0].localeCompare(a[0]),
  );

  const maxStadiumTotal = stadiumStats[0]?.total ?? 1;

  return (
    <div className="flex flex-col pb-10">
      {/* ── 히어로 ── */}
      <div className="flex flex-col items-center text-center pt-2 pb-2">
        <div className="relative w-36 h-36 mb-3">
          <Image
            src={isFairy ? winMascot : loseMascot}
            alt={isFairy ? "승리요정" : "패배요정"}
            fill
            className="object-contain"
          />
        </div>

        <p className="text-sm font-bold text-gray-500 mb-1">
          나는 직관 {isFairy ? "승리요정" : "패배요정"} ✦
        </p>

        {/* 승률 — 유일하게 테마 컬러 사용 */}
        <p
          className="text-6xl font-black tabular-nums leading-none mb-1"
          style={{ color: "var(--theme-primary)" }}
        >
          {winRate}
          <span className="text-3xl">%</span>
        </p>
        <p className="text-xs text-gray-400 mb-4">직관 승률</p>

        {/* 승 · 무 · 패 한 줄 */}
        <div className="flex items-center gap-3 text-sm">
          <span>
            <span className="font-black text-gray-800">{wins}</span>
            <span className="text-gray-400 ml-0.5 text-xs">승</span>
          </span>
          <span className="text-gray-200">·</span>
          <span>
            <span className="font-black text-gray-800">{loses}</span>
            <span className="text-gray-400 ml-0.5 text-xs">패</span>
          </span>
          {draws > 0 && (
            <>
              <span className="text-gray-200">·</span>
              <span>
                <span className="font-black text-gray-800">{draws}</span>
                <span className="text-gray-400 ml-0.5 text-xs">무</span>
              </span>
            </>
          )}
          <span className="text-gray-200">·</span>
          <span>
            <span className="font-black text-gray-800">{total}</span>
            <span className="text-gray-400 ml-0.5 text-xs">경기</span>
          </span>
        </div>
      </div>

      {/* {DIVIDER} */}

      {/* ── 결과 비율 ── */}
      {/* <div>
        <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">
          결과 비율
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "승리",
              value: wins,
              color: "var(--theme-primary)",
              bg: "var(--theme-primary-light)",
            },
            { label: "패배", value: loses, color: "#fb7185", bg: "#fff1f2" },
            { label: "무승부", value: draws, color: "#94a3b8", bg: "#f1f5f9" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="flex flex-1 items-center gap-3">
              <span className="text-xs text-gray-500 w-12 shrink-0">
                {label}
              </span>
              <div
                className="flex-1 rounded-full h-2 overflow-hidden"
                style={{ background: bg }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${total > 0 ? (value / total) * 100 : 0}%`,
                    background: color,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-gray-600 ">
                {value}회 · {total > 0 ? Math.round((value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div> */}

      {yearStats.length > 0 && (
        <>
          {DIVIDER}

          {/* ── 연도별 요약 ── */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">
              연도별 요약
            </p>
            <div className="flex flex-col gap-3">
              {yearStats.map(([year, s]) => {
                const yr = Math.round((s.win / s.total) * 100);
                const monthLabel = format(
                  new Date(Number(year), 0, 1),
                  "yyyy년",
                  { locale: ko },
                );
                return (
                  <div key={year} className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-700 w-14 shrink-0">
                      {monthLabel}
                    </span>
                    <div className="flex-1 flex items-center gap-1.5 text-xs text-gray-400">
                      <span>{s.total}경기</span>
                      <span className="text-gray-200">·</span>
                      <span
                        style={{ color: "var(--theme-primary)" }}
                        className="font-semibold"
                      >
                        {s.win}승
                      </span>
                      <span>{s.lose}패</span>
                      {s.draw > 0 && <span>{s.draw}무</span>}
                    </div>
                    <span
                      className="text-xs font-black w-10 text-right shrink-0"
                      style={{
                        color: yr >= 50 ? "var(--theme-primary)" : "#fb7185",
                      }}
                    >
                      {yr}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {stadiumStats.length > 0 && (
        <>
          {DIVIDER}

          {/* ── 구장별 방문 ── */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">
              구장별 방문
            </p>
            <div className="flex flex-col gap-3.5">
              {stadiumStats.map((s, i) => {
                const winPct = Math.round((s.win / s.total) * 100);
                return (
                  <div key={s.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300 font-bold w-4 shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          {s.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{s.total}회</span>
                        <span
                          className="font-bold"
                          style={{
                            color:
                              winPct >= 50 ? "var(--theme-primary)" : "#fb7185",
                          }}
                        >
                          {winPct}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ background: "#f0ece6" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(s.total / maxStadiumTotal) * 100}%`,
                          background: "var(--theme-primary)",
                          opacity: 0.5,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
