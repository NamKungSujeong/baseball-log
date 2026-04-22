"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useLogs } from "@/features/logs/hooks/useLogs";
import useAuthStore from "@/store/useAuthStore";
import LogCard from "@/features/logs/components/LogCard";
import LogCalendar from "@/features/logs/components/LogCalendar";
import { KBO_TEAMS } from "@/utils/constants/kbo";
import balllogLogo from "@/assets/images/balllog-logo.png";
import balllogMascotWithNote from "@/assets/images/mascot/balllog-mascot-with-note.png";
import { PenLine, List, CalendarDays } from "lucide-react";
import type { GameLog } from "@/types/game-log";

type ViewMode = "list" | "calendar";

function groupByMonth(logs: GameLog[]): [string, GameLog[]][] {
  const map: Record<string, GameLog[]> = {};
  for (const log of logs) {
    const key = log.date.slice(0, 7); // YYYY-MM
    if (!map[key]) map[key] = [];
    map[key].push(log);
  }
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}

export default function LogsPage() {
  const { data: logs = [], isLoading: loading } = useLogs();
  const user = useAuthStore((s) => s.user);
  const nickname = user?.nickname ?? "";
  const supportingTeamId = user?.supportingTeamId ?? null;
  const supportingTeam = KBO_TEAMS.find((t) => t.id === supportingTeamId);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const grouped = groupByMonth(logs);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Image
            src={balllogLogo}
            alt="logo"
            width={0}
            height={0}
            className="w-auto h-[30px]"
          />
          {supportingTeam ? (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-4 h-4 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={supportingTeam.logo}
                  alt={supportingTeam.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-500">
                나의 응원팀 ·{" "}
                <span
                  className="font-bold"
                  style={{ color: supportingTeam.primary }}
                >
                  {supportingTeam.name}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-0.5">
              {nickname ? `${nickname}님의 ` : ""}직관 기록 ✦ 총{" "}
              {logs.length}경기
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 뷰 토글 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode("list")}
              className="p-2 rounded-full transition-all"
              style={
                viewMode === "list"
                  ? { color: "var(--theme-primary)" }
                  : { color: "#d1d5db" }
              }
              aria-label="리스트 뷰"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className="p-2 rounded-full transition-all"
              style={
                viewMode === "calendar"
                  ? { color: "var(--theme-primary)" }
                  : { color: "#d1d5db" }
              }
              aria-label="캘린더 뷰"
            >
              <CalendarDays size={16} />
            </button>
          </div>

          <Link
            href="/logs/new"
            className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
            style={{ background: "var(--theme-primary)" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* 콘텐츠 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "var(--theme-primary)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      ) : viewMode === "calendar" ? (
        <LogCalendar logs={logs} />
      ) : logs.length === 0 ? (
        /* 빈 상태 */
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
          <p className="text-gray-400 text-sm mt-1">
            첫 번째 직관을 기록해봐요!
          </p>
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
      ) : (
        /* 월별 그룹 리스트 */
        <div className="flex flex-col gap-6">
          {grouped.map(([monthKey, monthLogs]) => {
            const [year, month] = monthKey.split("-");
            const monthLabel = format(
              new Date(Number(year), Number(month) - 1, 1),
              "yyyy년 M월",
              { locale: ko },
            );
            return (
              <div key={monthKey}>
                {/* 월 헤더 */}
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                    {monthLabel}
                  </p>
                  <span className="text-[10px] text-gray-300">
                    {monthLogs.length}회
                  </span>
                </div>

                {/* 엔트리 목록 */}
                <div>
                  {monthLogs.map((log, i) => (
                    <div key={log.id}>
                      <LogCard log={log} />
                      {i < monthLogs.length - 1 && (
                        <div style={{ borderTop: "1px solid #f0ece6" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
