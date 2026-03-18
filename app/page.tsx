"use client";

import Image from "next/image";
import Link from "next/link";
import useLogStore from "@/store/useLogStore";
import useAppStore from "@/store/useAppStore";
import LogCard from "@/components/logs/LogCard";
import TeamSelector from "@/components/ui/TeamSelector";
import { KBO_TEAMS } from "@/constants/kbo";

export default function HomePage() {
  const logs = useLogStore((s) => s.logs);
  const supportingTeamId = useAppStore((s) => s.supportingTeamId);
  const supportingTeam = KBO_TEAMS.find((t) => t.id === supportingTeamId);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ color: "var(--theme-primary)" }}
          >
            직관로그 ⚾
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            총 {logs.length}번의 직관 기록 🎉
          </p>
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

      {/* 응원팀 선택 카드 */}
      <div className="rounded-3xl p-4 shadow-sm mb-5" style={{ background: "var(--theme-bg-card)", border: "1px solid var(--theme-primary-light)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">💛</span>
          <p className="text-sm font-bold text-gray-700">나의 응원팀</p>
          {supportingTeam && (
            <div
              className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: supportingTeam.primary }}
            >
              <div className="w-4 h-4 relative">
                <Image src={supportingTeam.logo} alt={supportingTeam.name} fill className="object-contain" />
              </div>
              <span className="text-xs font-bold text-white">{supportingTeam.shortName}</span>
            </div>
          )}
          {!supportingTeam && (
            <span className="ml-auto text-xs text-gray-400">
              팀을 선택해봐요!
            </span>
          )}
        </div>
        <TeamSelector />
      </div>

      {/* 목록 */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: "var(--theme-primary-light)" }}
          >
            <span className="text-4xl">⚾</span>
          </div>
          <p className="text-gray-600 font-bold text-base">
            아직 직관 기록이 없어요
          </p>
          <p className="text-gray-400 text-sm mt-1">
            첫 번째 직관을 기록해봐요! 🌟
          </p>
          <Link
            href="/logs/new"
            className="mt-5 px-7 py-3 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
            style={{ background: "var(--theme-primary)" }}
          >
            직관 기록하기 ✏️
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">📋</span>
            <p className="text-sm font-bold text-gray-700">직관 기록</p>
          </div>
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
