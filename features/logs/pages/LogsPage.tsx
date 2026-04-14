"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useLogStore from "@/store/useLogStore";
import useAuthStore from "@/store/useAuthStore";
import LogCard from "@/features/logs/components/LogCard";
import { KBO_TEAMS } from "@/utils/constants/kbo";
import balllogLogo from "@/assets/images/balllog-logo.png";
import balllogMascotWithNote from "@/assets/images/mascot/balllog-mascot-with-note.png";
import { Star, PenLine, Sparkles } from "lucide-react";

export default function LogsPage() {
  const { logs, loading, fetchLogs } = useLogStore();
  const user = useAuthStore((s) => s.user);
  const nickname = user?.nickname ?? "";
  const supportingTeamId = user?.supportingTeamId ?? null;
  const supportingTeam = KBO_TEAMS.find((t) => t.id === supportingTeamId);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
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
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              {nickname ? `${nickname}님, ` : ""}총 {logs.length}번의 직관 기록
              <Sparkles size={13} className="text-yellow-400" />
            </p>
          )}
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
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: "var(--theme-primary-light)" }}
          >
            <Image
              src={balllogMascotWithNote}
              alt="logo"
              width={0}
              height={0}
              className="w-auto h-[60px]"
            />
          </div>
          <p className="text-gray-600 font-bold text-base">
            아직 직관 기록이 없어요
          </p>
          <p className="text-gray-400 text-sm mt-1">
            첫 번째 직관을 기록해봐요!{" "}
            <Star
              size={14}
              className="inline text-yellow-400 fill-yellow-400"
            />
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
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
