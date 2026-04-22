"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useLog, useDeleteLog } from "@/features/logs/hooks/useLogs";
import { ResultBadge } from "@/components/ui/Badge";
import LogForm from "@/features/logs/components/LogForm";
import { getTeam, getStadium, COMPANION_LABELS } from "@/utils/constants/kbo";
import {
  ChevronLeft,
  PenLine,
  Trash2,
  MapPin,
  Users,
  NotebookPen,
  Camera,
} from "lucide-react";
export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: log, isLoading } = useLog(id);
  const deleteLogMutation = useDeleteLog();
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{
            borderColor: "var(--theme-primary)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500">기록을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm font-bold"
          style={{ color: "var(--theme-primary)" }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setEditing(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "var(--theme-bg-card)",
              border: "1px solid var(--theme-primary-light)",
            }}
          >
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <h1 className="text-xl font-black text-gray-900">기록 수정</h1>
        </div>
        <LogForm initialData={log} />
      </div>
    );
  }

  const homeTeam = getTeam(log.homeTeamId);
  const awayTeam = getTeam(log.awayTeamId);
  const stadium = getStadium(log.stadiumId);
  const dateLabel = format(new Date(log.date), "yyyy년 M월 d일 (EEE)", {
    locale: ko,
  });

  const seatLabel = [
    log.seat.section && `${log.seat.section}구역`,
    log.seat.row && `${log.seat.row}열`,
    log.seat.number && `${log.seat.number}번`,
  ]
    .filter(Boolean)
    .join(" ");

  async function handleDelete() {
    if (!confirm("이 기록을 삭제할까요?")) return;
    deleteLogMutation.mutate(id, {
      onSuccess: () => router.push("/"),
    });
  }

  const cardStyle = {
    background: "var(--theme-bg-card)",
    border: "1px solid var(--theme-primary-light)",
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* 상단 네비 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "var(--theme-bg-card)",
            border: "1px solid var(--theme-primary-light)",
          }}
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{
              background: "var(--theme-primary-light)",
              color: "var(--theme-primary)",
            }}
          >
            <PenLine size={14} />
            수정
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLogMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all active:scale-95 disabled:opacity-60"
            style={{ background: "#FEE2E2", color: "#DC2626" }}
          >
            <Trash2 size={14} />
            {deleteLogMutation.isPending ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>

      {/* 경기 결과 카드 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <p className="text-xs text-gray-400 mb-4 text-center">{dateLabel}</p>

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "var(--theme-bg)" }}
            >
              {awayTeam && (
                <div className="w-10 h-10 relative">
                  <Image
                    src={awayTeam.logo}
                    alt={awayTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-gray-600">{awayTeam?.name}</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-4xl font-black text-gray-900 tabular-nums">
              {log.score.away}
              <span className="text-2xl text-gray-300 mx-1">:</span>
              {log.score.home}
            </p>
            <ResultBadge result={log.result} />
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "var(--theme-bg)" }}
            >
              {homeTeam && (
                <div className="w-10 h-10 relative">
                  <Image
                    src={homeTeam.logo}
                    alt={homeTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-gray-600">{homeTeam?.name}</p>
          </div>
        </div>

        <div
          className="flex items-center justify-center gap-1.5 pt-4 text-xs text-gray-500"
          style={{ borderTop: "1px solid var(--theme-primary-light)" }}
        >
          <MapPin size={12} style={{ color: "var(--theme-primary)" }} />
          <span>{stadium?.name}</span>
        </div>
      </div>

      {/* 관람 정보 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} style={{ color: "var(--theme-primary)" }} />
          <h2 className="text-sm font-bold text-gray-700">관람 정보</h2>
        </div>
        <div className="flex flex-col gap-2">
          <InfoRow label="동반인" value={COMPANION_LABELS[log.companion]} />
          {seatLabel && <InfoRow label="좌석" value={seatLabel} />}
        </div>
      </div>

      {/* 메모 */}
      {log.memo && (
        <div className="rounded-3xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-3">
            <NotebookPen size={14} style={{ color: "var(--theme-primary)" }} />
            <h2 className="text-sm font-bold text-gray-700">메모</h2>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {log.memo}
          </p>
        </div>
      )}

      {/* 사진 */}
      {log.photos.length > 0 && (
        <div className="rounded-3xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-3">
            <Camera size={14} style={{ color: "var(--theme-primary)" }} />
            <h2 className="text-sm font-bold text-gray-700">
              사진{" "}
              <span className="font-normal text-gray-400">
                ({log.photos.length})
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {log.photos.map((photo, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.startsWith("data:") ? photo : `/api/storage/${photo}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
