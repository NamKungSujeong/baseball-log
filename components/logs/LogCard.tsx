import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { GameLog } from "@/types/game-log";
import { ResultBadge } from "@/components/ui/Badge";
import { getTeam, getStadium, COMPANION_LABELS } from "@/constants/kbo";

interface LogCardProps {
  log: GameLog;
}

export default function LogCard({ log }: LogCardProps) {
  const homeTeam = getTeam(log.homeTeamId);
  const awayTeam = getTeam(log.awayTeamId);
  const stadium = getStadium(log.stadiumId);
  const dateLabel = format(new Date(log.date), "M월 d일 (EEE)", { locale: ko });

  return (
    <Link href={`/logs/${log.id}`}>
      <div
        className="rounded-2xl p-4 active:opacity-80 transition-opacity"
        style={{
          background: "var(--theme-bg-card)",
          border: "1px solid var(--theme-primary-light)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* 경기 매치업 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-2">{dateLabel} · {stadium?.name}</p>

            {/* 팀 로고 + 점수 */}
            <div className="flex items-center gap-2">
              {/* 원정팀 */}
              <div className="flex items-center gap-1.5">
                {awayTeam && (
                  <div className="w-7 h-7 relative shrink-0">
                    <Image
                      src={awayTeam.logo}
                      alt={awayTeam.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="text-base font-black tabular-nums text-gray-800">
                  {log.score.away}
                </span>
              </div>

              <span className="text-xs font-bold text-gray-300">:</span>

              {/* 홈팀 */}
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tabular-nums text-gray-800">
                  {log.score.home}
                </span>
                {homeTeam && (
                  <div className="w-7 h-7 relative shrink-0">
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

            {/* 동반인 */}
            <p className="text-xs text-gray-400 mt-1.5">
              {COMPANION_LABELS[log.companion]}
              {log.memo && (
                <span className="ml-1 text-gray-300">· {log.memo.slice(0, 20)}{log.memo.length > 20 ? "…" : ""}</span>
              )}
            </p>
          </div>

          {/* 결과 뱃지 */}
          <ResultBadge result={log.result} />
        </div>

        {/* 사진 썸네일 */}
        {log.photos.length > 0 && (
          <div className="flex gap-2 mt-3">
            {log.photos.slice(0, 3).map((photo, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {log.photos.length > 3 && (
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "var(--theme-primary-light)",
                  color: "var(--theme-primary)",
                }}
              >
                +{log.photos.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
