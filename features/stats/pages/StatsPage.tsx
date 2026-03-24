"use client";

import balllogMascotWithNote from "@/assets/images/mascot/balllog-mascot-with-note.png";
import { KBO_STADIUMS } from "@/utils/constants/kbo";
import useLogStore from "@/store/useLogStore";
import type { StadiumId } from "@/types/game-log";
import { PenLine, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function StatsPage() {
  const logs = useLogStore((s) => s.logs);

  if (logs.length === 0) {
    return (
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
          <Star size={14} className="inline text-yellow-400 fill-yellow-400" />
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
    );
  }

  const total = logs.length;
  const wins = logs.filter((l) => l.result === "win").length;
  const loses = logs.filter((l) => l.result === "lose").length;
  const draws = logs.filter((l) => l.result === "draw").length;
  const winRate = Math.round((wins / total) * 100);
  const isFairy = winRate >= 50;

  // 승/패/무 파이 데이터
  const pieData = [
    { name: "승", value: wins, color: "#4ADE80" },
    { name: "무", value: draws, color: "#D1D5DB" },
    { name: "패", value: loses, color: "#F87171" },
  ].filter((d) => d.value > 0);

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
  const yearCount = logs.reduce<Record<string, number>>((acc, log) => {
    const year = log.date.slice(0, 4);
    acc[year] = (acc[year] ?? 0) + 1;
    return acc;
  }, {});

  const yearData = Object.entries(yearCount)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, count]) => ({ year, count }));

  const cardStyle = {
    background: "var(--theme-bg-card)",
    border: "1px solid var(--theme-primary-light)",
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
        통계
      </h1>

      {/* 메인 승률 카드 */}
      <div
        className="rounded-3xl p-6 flex flex-col items-center text-center overflow-hidden relative"
        style={{
          background: isFairy
            ? "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)"
            : "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
          border: `1px solid ${isFairy ? "#86EFAC" : "#FCA5A5"}`,
        }}
      >
        {/* 마스코트 */}
        <div className="relative w-36 h-36 mb-3">
          <Image
            src={
              isFairy
                ? "/images/mascot/win-mascot.png"
                : "/images/mascot/lose-mascot.png"
            }
            alt={isFairy ? "승리요정" : "패배요정"}
            fill
            className="object-contain drop-shadow-md"
          />
        </div>

        {/* 타이틀 */}
        <p
          className="text-lg font-black mb-1"
          style={{ color: isFairy ? "#16A34A" : "#DC2626" }}
        >
          나는 {isFairy ? "승리요정" : "패배요정"}!
        </p>

        {/* 승률 */}
        <p
          className="text-5xl font-black tabular-nums mb-2"
          style={{ color: isFairy ? "#15803D" : "#B91C1C" }}
        >
          {winRate}%
        </p>

        <p
          className="text-sm font-medium"
          style={{ color: isFairy ? "#16A34A" : "#DC2626" }}
        >
          직관 승률
        </p>

        {/* 승/패/무 요약 */}
        <div
          className="flex gap-4 mt-4 px-5 py-2.5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.6)" }}
        >
          <div className="text-center">
            <p className="text-xs text-gray-500">승</p>
            <p className="text-lg font-black text-green-600">{wins}</p>
          </div>
          <div className="w-px bg-white/80" />
          <div className="text-center">
            <p className="text-xs text-gray-500">무</p>
            <p className="text-lg font-black text-gray-500">{draws}</p>
          </div>
          <div className="w-px bg-white/80" />
          <div className="text-center">
            <p className="text-xs text-gray-500">패</p>
            <p className="text-lg font-black text-red-500">{loses}</p>
          </div>
          <div className="w-px bg-white/80" />
          <div className="text-center">
            <p className="text-xs text-gray-500">총</p>
            <p className="text-lg font-black text-gray-700">{total}</p>
          </div>
        </div>
      </div>

      {/* 승/패/무 파이 차트 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <h2 className="text-sm font-bold text-gray-700 mb-4">
          승 · 무 · 패 비율
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {[
              { label: "승리", value: wins, color: "#4ADE80", bg: "#DCFCE7" },
              {
                label: "무승부",
                value: draws,
                color: "#9CA3AF",
                bg: "#F3F4F6",
              },
              { label: "패배", value: loses, color: "#F87171", bg: "#FEE2E2" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <span className="text-xs text-gray-500 w-12">{label}</span>
                <div
                  className="flex-1 rounded-full h-2 overflow-hidden"
                  style={{ background: bg }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${total > 0 ? (value / total) * 100 : 0}%`,
                      background: color,
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-700 w-6 text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시즌별 바 차트 */}
      {yearData.length > 0 && (
        <div className="rounded-3xl p-5" style={cardStyle}>
          <h2 className="text-sm font-bold text-gray-700 mb-4">
            시즌별 직관 횟수
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={yearData}
              barSize={28}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "var(--theme-primary-light)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  fontSize: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                formatter={(v) => [`${v}회`, "직관"]}
              />
              <Bar
                dataKey="count"
                fill="var(--theme-primary)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 구장별 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <h2 className="text-sm font-bold text-gray-700 mb-4">구장별 방문</h2>
        <div className="flex flex-col gap-3">
          {stadiumStats.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                style={{
                  background: "var(--theme-primary-light)",
                  color: "var(--theme-primary)",
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {s.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s.total / stadiumStats[0].total) * 100}%`,
                        background: "var(--theme-primary)",
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {Math.round((s.win / s.total) * 100)}% 승
                  </span>
                </div>
              </div>
              <span
                className="text-sm font-bold shrink-0"
                style={{ color: "var(--theme-primary)" }}
              >
                {s.total}회
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
