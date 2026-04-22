import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { GameLog } from "@/types/game-log";
import { getTeam, getStadium, COMPANION_LABELS } from "@/utils/constants/kbo";

interface LogCardProps {
  log: GameLog;
}

const resultMap = {
  win:  { label: "승", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  lose: { label: "패", color: "#fb7185", bg: "rgba(251,113,133,0.12)" },
  draw: { label: "무", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

export default function LogCard({ log }: LogCardProps) {
  const homeTeam = getTeam(log.homeTeamId);
  const awayTeam = getTeam(log.awayTeamId);
  const stadium = getStadium(log.stadiumId);
  const dateLabel = format(new Date(log.date), "MM. dd (EEE)", { locale: ko });
  const result = resultMap[log.result];

  return (
    <Link href={`/logs/${log.id}`}>
      <div className="py-3.5 active:opacity-70 transition-opacity">
        {/* 날짜 + 결과 스탬프 */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-400 tracking-wide">
            {dateLabel}
          </p>
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{
              background: result.bg,
              color: result.color,
              border: `2px solid ${result.color}`,
              transform: "rotate(-12deg)",
              display: "inline-flex",
            }}
          >
            {result.label}
          </span>
        </div>

        {/* 팀 로고 + 스코어 */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            {awayTeam && (
              <div className="w-5 h-5 relative shrink-0">
                <Image
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-[15px] font-black tabular-nums text-gray-800">
              {log.score.away}
            </span>
          </div>
          <span className="text-xs text-gray-300 font-bold">:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-black tabular-nums text-gray-800">
              {log.score.home}
            </span>
            {homeTeam && (
              <div className="w-5 h-5 relative shrink-0">
                <Image
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* 서브 정보 */}
        <p className="text-xs text-gray-400">
          {stadium?.name} · {COMPANION_LABELS[log.companion]}
        </p>

        {/* 메모 */}
        {log.memo && (
          <p className="text-xs text-gray-500 italic mt-1.5 leading-relaxed">
            &ldquo;{log.memo.slice(0, 50)}
            {log.memo.length > 50 ? "…" : ""}&rdquo;
          </p>
        )}

        {/* 사진 */}
        {log.photos.length > 0 && (
          <div className="flex gap-1.5 mt-2.5">
            {log.photos.slice(0, 4).map((photo, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    photo.startsWith("data:") ? photo : `/api/storage/${photo}`
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {log.photos.length > 4 && (
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "var(--theme-primary-light)",
                  color: "var(--theme-primary)",
                }}
              >
                +{log.photos.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
