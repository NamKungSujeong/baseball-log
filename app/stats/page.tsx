"use client";

import useLogStore from "@/store/useLogStore";
import { getStadium, getTeam, KBO_STADIUMS, KBO_TEAMS } from "@/constants/kbo";
import type { GameResult, StadiumId, TeamId } from "@/types/game-log";

export default function StatsPage() {
  const logs = useLogStore((s) => s.logs);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">📊</span>
        <p className="text-gray-500 font-medium">아직 기록된 직관이 없어요</p>
        <p className="text-gray-400 text-sm mt-1">직관을 기록하면 통계를 볼 수 있어요</p>
      </div>
    );
  }

  const total = logs.length;
  const wins = logs.filter((l) => l.result === "win").length;
  const loses = logs.filter((l) => l.result === "lose").length;
  const draws = logs.filter((l) => l.result === "draw").length;
  const winRate = Math.round((wins / total) * 100);

  // 구장별 통계
  const stadiumCount = logs.reduce<Record<StadiumId, { win: number; total: number }>>(
    (acc, log) => {
      if (!acc[log.stadiumId]) acc[log.stadiumId] = { win: 0, total: 0 };
      acc[log.stadiumId].total += 1;
      if (log.result === "win") acc[log.stadiumId].win += 1;
      return acc;
    },
    {} as Record<StadiumId, { win: number; total: number }>
  );

  const stadiumStats = KBO_STADIUMS.filter((s) => stadiumCount[s.id])
    .map((s) => ({ ...s, ...stadiumCount[s.id] }))
    .sort((a, b) => b.total - a.total);

  // 팀별 응원 통계
  const teamCount = logs.reduce<Record<TeamId, { win: number; total: number }>>(
    (acc, log) => {
      const tid = log.myTeamId;
      if (!acc[tid]) acc[tid] = { win: 0, total: 0 };
      acc[tid].total += 1;
      if (log.result === "win") acc[tid].win += 1;
      return acc;
    },
    {} as Record<TeamId, { win: number; total: number }>
  );

  const teamStats = KBO_TEAMS.filter((t) => teamCount[t.id])
    .map((t) => ({ ...t, ...teamCount[t.id] }))
    .sort((a, b) => b.total - a.total);

  // 연도별 통계
  const yearCount = logs.reduce<Record<string, number>>((acc, log) => {
    const year = log.date.slice(0, 4);
    acc[year] = (acc[year] ?? 0) + 1;
    return acc;
  }, {});

  const yearStats = Object.entries(yearCount).sort((a, b) => b[0].localeCompare(a[0]));

  const maxYear = Math.max(...yearStats.map(([, v]) => v));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">통계 📊</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <SummaryCard label="총 직관" value={`${total}회`} sub="전체" color="text-blue-600" />
        <SummaryCard label="직관 승률" value={`${winRate}%`} sub={`${wins}승 ${draws}무 ${loses}패`} color="text-green-600" />
      </div>

      {/* 결과 바 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">승/패/무 비율</h2>
        <div className="flex rounded-full overflow-hidden h-4 mb-3">
          {wins > 0 && (
            <div className="bg-green-400 transition-all" style={{ width: `${(wins / total) * 100}%` }} />
          )}
          {draws > 0 && (
            <div className="bg-gray-300 transition-all" style={{ width: `${(draws / total) * 100}%` }} />
          )}
          {loses > 0 && (
            <div className="bg-red-400 transition-all" style={{ width: `${(loses / total) * 100}%` }} />
          )}
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <LegendItem color="bg-green-400" label={`승 ${wins}`} />
          <LegendItem color="bg-gray-300" label={`무 ${draws}`} />
          <LegendItem color="bg-red-400" label={`패 ${loses}`} />
        </div>
      </div>

      {/* 시즌별 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">시즌별 직관 횟수</h2>
        <div className="flex flex-col gap-2">
          {yearStats.map(([year, count]) => (
            <div key={year} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12 shrink-0">{year}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${(count / maxYear) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-8 text-right shrink-0">{count}회</span>
            </div>
          ))}
        </div>
      </div>

      {/* 구장별 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">구장별 방문</h2>
        <div className="flex flex-col gap-3">
          {stadiumStats.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                <p className="text-xs text-gray-400">{s.win}승 · 승률 {Math.round((s.win / s.total) * 100)}%</p>
              </div>
              <span className="text-sm font-bold text-blue-600 ml-3">{s.total}회</span>
            </div>
          ))}
        </div>
      </div>

      {/* 응원팀별 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">응원팀별 직관</h2>
        <div className="flex flex-col gap-3">
          {teamStats.map((t) => (
            <div key={t.id} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: t.color }}
              >
                {t.id.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-400">{t.win}승 · 승률 {Math.round((t.win / t.total) * 100)}%</p>
              </div>
              <span className="text-sm font-bold text-gray-700">{t.total}회</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
