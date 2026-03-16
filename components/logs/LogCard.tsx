import Link from "next/link";
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
  const dateLabel = format(new Date(log.date), "yyyy년 M월 d일 (EEE)", { locale: ko });

  return (
    <Link href={`/logs/${log.id}`}>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          {/* 경기 정보 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-1">{dateLabel}</p>

            {/* 팀 vs 점수 */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-sm font-bold truncate"
                style={{ color: awayTeam?.color }}
              >
                {awayTeam?.name}
              </span>
              <span className="text-gray-400 text-xs shrink-0">
                {log.score.away} : {log.score.home}
              </span>
              <span
                className="text-sm font-bold truncate"
                style={{ color: homeTeam?.color }}
              >
                {homeTeam?.name}
              </span>
            </div>

            {/* 구장 · 동반인 */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{stadium?.name}</span>
              <span>·</span>
              <span>{COMPANION_LABELS[log.companion]}</span>
              {log.seat.section && (
                <>
                  <span>·</span>
                  <span>{log.seat.section}구역</span>
                </>
              )}
            </div>

            {/* 메모 미리보기 */}
            {log.memo && (
              <p className="mt-2 text-xs text-gray-500 line-clamp-2">{log.memo}</p>
            )}
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
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-500 shrink-0">
                +{log.photos.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
