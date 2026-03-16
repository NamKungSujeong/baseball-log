"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import useLogStore from "@/store/useLogStore";
import { ResultBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LogForm from "@/components/logs/LogForm";
import { getTeam, getStadium, COMPANION_LABELS } from "@/constants/kbo";

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getLog, deleteLog } = useLogStore();
  const [editing, setEditing] = useState(false);

  const log = getLog(id);

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500">기록을 찾을 수 없습니다.</p>
        <button onClick={() => router.push("/")} className="mt-4 text-blue-600 text-sm">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditing(false)} className="text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">기록 수정</h1>
        </div>
        <LogForm initialData={log} />
      </div>
    );
  }

  const homeTeam = getTeam(log.homeTeamId);
  const awayTeam = getTeam(log.awayTeamId);
  const myTeam = getTeam(log.myTeamId);
  const stadium = getStadium(log.stadiumId);
  const dateLabel = format(new Date(log.date), "yyyy년 M월 d일 (EEE)", { locale: ko });

  function handleDelete() {
    if (!confirm("이 기록을 삭제할까요?")) return;
    deleteLog(id);
    router.push("/");
  }

  return (
    <div>
      {/* 상단 네비 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            수정
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>

      {/* 경기 결과 헤더 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <p className="text-sm text-gray-400 mb-3">{dateLabel}</p>

        {/* 팀 대결 + 결과 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: awayTeam?.color }}>
              {log.awayTeamId}
            </div>
            <p className="text-xs text-gray-600 font-medium">{awayTeam?.name}</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 tabular-nums">
              {log.score.away} : {log.score.home}
            </p>
            <div className="flex justify-center mt-2">
              <ResultBadge result={log.result} />
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: homeTeam?.color }}>
              {log.homeTeamId}
            </div>
            <p className="text-xs text-gray-600 font-medium">{homeTeam?.name}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>{stadium?.name}</span>
          <span>·</span>
          <span>응원팀: {myTeam?.name}</span>
        </div>
      </div>

      {/* 관람 정보 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">관람 정보</h2>
        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="동반인" value={COMPANION_LABELS[log.companion]} />
          <InfoItem
            label="좌석"
            value={
              [log.seat.section && `${log.seat.section}구역`, log.seat.row && `${log.seat.row}열`, log.seat.number && `${log.seat.number}번`]
                .filter(Boolean)
                .join(" ") || "-"
            }
          />
        </div>
      </div>

      {/* 메모 */}
      {(log.memo || log.food) && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">기록</h2>
          {log.memo && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">메모</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{log.memo}</p>
            </div>
          )}
          {log.food && (
            <div>
              <p className="text-xs text-gray-400 mb-1">먹거리</p>
              <p className="text-sm text-gray-700">{log.food}</p>
            </div>
          )}
        </div>
      )}

      {/* 사진 */}
      {log.photos.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">사진</h2>
          <div className="grid grid-cols-3 gap-2">
            {log.photos.map((photo, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
