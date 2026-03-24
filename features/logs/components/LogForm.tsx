"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type {
  GameLog,
  GameLogFormData,
  GameResult,
  TeamId,
} from "@/types/game-log";
import { KBO_STADIUMS, KBO_TEAMS, COMPANION_LABELS } from "@/utils/constants/kbo";
import { compressImage } from "@/lib/image";
import useLogStore from "@/store/useLogStore";
import useAppStore from "@/store/useAppStore";
import { X, Calendar, MapPin, Users, NotebookPen } from "lucide-react";

interface LogFormProps {
  initialData?: GameLog;
}

const today = new Date().toISOString().split("T")[0];

export default function LogForm({ initialData }: LogFormProps) {
  const router = useRouter();
  const { addLog, updateLog } = useLogStore();
  const supportingTeamId = useAppStore((s) => s.supportingTeamId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<GameLogFormData>(
    initialData
      ? {
          date: initialData.date,
          stadiumId: initialData.stadiumId,
          homeTeamId: initialData.homeTeamId,
          awayTeamId: initialData.awayTeamId,
          myTeamId: initialData.myTeamId,
          seat: initialData.seat,
          companion: initialData.companion,
          result: initialData.result,
          score: initialData.score,
          photos: initialData.photos,
          memo: initialData.memo,
          food: initialData.food,
        }
      : {
          date: today,
          stadiumId: "jamsil",
          homeTeamId: "" as TeamId,
          awayTeamId: "" as TeamId,
          myTeamId: supportingTeamId ?? "LG",
          seat: { section: "", row: "", number: "" },
          companion: "solo",
          result: "win",
          score: { home: 0, away: 0 },
          photos: [],
          memo: "",
          food: "",
        },
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [uploading, setUploading] = useState(false);

  const [awayScore, setAwayScore] = useState<number>(
    initialData ? initialData.score.away : 0,
  );
  const [homeScore, setHomeScore] = useState<number>(
    initialData ? initialData.score.home : 0,
  );

  // 응원팀 자동 설정 (신규 기록 시)
  useEffect(() => {
    if (!initialData && supportingTeamId) {
      setForm((f) => ({ ...f, myTeamId: supportingTeamId }));
    }
  }, [supportingTeamId, initialData]);

  // 점수 변경 시 form에 반영
  useEffect(() => {
    setForm((f) => ({
      ...f,
      score: { away: awayScore ?? 0, home: homeScore ?? 0 },
    }));
  }, [awayScore, homeScore]);

  function set<K extends keyof GameLogFormData>(
    key: K,
    value: GameLogFormData[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<string, string>> = {};
    if (!form.stadiumId) newErrors.stadiumId = "구장을 선택해주세요";
    if (!form.homeTeamId) newErrors.homeTeamId = "홈팀을 선택해주세요";
    if (!form.awayTeamId) newErrors.awayTeamId = "원정팀을 선택해주세요";
    if (
      form.homeTeamId &&
      form.awayTeamId &&
      form.homeTeamId === form.awayTeamId
    )
      newErrors.awayTeamId = "홈팀과 원정팀이 같을 수 없습니다";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (form.photos.length + files.length > 5) {
      alert("사진은 최대 5장까지 업로드할 수 있습니다.");
      return;
    }
    setUploading(true);
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)));
      set("photos", [...form.photos, ...compressed]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removePhoto(index: number) {
    set(
      "photos",
      form.photos.filter((_, i) => i !== index),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (initialData) {
      updateLog(initialData.id, form);
      router.push(`/logs/${initialData.id}`);
    } else {
      const log = addLog(form);
      router.push(`/logs/${log.id}`);
    }
  }

  const homeTeam = KBO_TEAMS.find((t) => t.id === form.homeTeamId);
  const awayTeam = KBO_TEAMS.find((t) => t.id === form.awayTeamId);

  const resultConfig = {
    win: { label: "승리", bg: "#DCFCE7", text: "#16A34A", border: "#86EFAC" },
    lose: { label: "패배", bg: "#FEE2E2", text: "#DC2626", border: "#FCA5A5" },
    draw: {
      label: "무승부",
      bg: "#F3F4F6",
      text: "#6B7280",
      border: "#D1D5DB",
    },
  };

  const cardStyle = {
    background: "var(--theme-bg-card)",
    border: "1px solid var(--theme-primary-light)",
  };

  const inputStyle = {
    background: "var(--theme-bg)",
    borderColor: "var(--theme-primary-light)",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-8">
      {/* 날짜 & 구장 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={15} style={{ color: "var(--theme-primary)" }} />
          <p className="text-sm font-bold text-gray-700">언제, 어디서?</p>
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="date"
            value={form.date}
            max={today}
            onChange={(e) => set("date", e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none"
            style={inputStyle}
          />
          <select
            value={form.stadiumId}
            onChange={(e) => {
              const newStadiumId = e.target.value as typeof form.stadiumId;
              set("stadiumId", newStadiumId);
              const stadium = KBO_STADIUMS.find((s) => s.id === newStadiumId);
              if (stadium?.homeTeams.length === 1) {
                set("homeTeamId", stadium.homeTeams[0]);
              }
            }}
            className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none appearance-none"
            style={{
              ...inputStyle,
              borderColor: errors.stadiumId
                ? "#F87171"
                : "var(--theme-primary-light)",
            }}
          >
            {KBO_STADIUMS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.stadiumId && (
            <p className="text-xs text-red-400">{errors.stadiumId}</p>
          )}
        </div>
      </div>

      {/* 팀 선택 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={15} style={{ color: "var(--theme-primary)" }} />
          <p className="text-sm font-bold text-gray-700">어떤 경기?</p>
        </div>

        {/* 팀 로고 매치업 */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <p className="text-xs text-gray-400">원정</p>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm"
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
            <p className="text-xs font-bold text-gray-600">
              {awayTeam?.shortName}
            </p>
          </div>

          <span className="text-xl font-black text-gray-200 mt-2">VS</span>

          <div className="flex-1 flex flex-col items-center gap-1.5">
            <p className="text-xs text-gray-400">홈</p>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm"
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
            <p className="text-xs font-bold text-gray-600">
              {homeTeam?.shortName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={form.awayTeamId}
            onChange={(e) => set("awayTeamId", e.target.value as TeamId)}
            className="w-full px-3 py-2.5 rounded-2xl border text-sm font-medium outline-none appearance-none text-center"
            style={{
              ...inputStyle,
              borderColor: errors.awayTeamId
                ? "#F87171"
                : "var(--theme-primary-light)",
            }}
          >
            <option value="" disabled>
              원정팀 선택
            </option>
            {KBO_TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={form.homeTeamId}
            onChange={(e) => set("homeTeamId", e.target.value as TeamId)}
            className="w-full px-3 py-2.5 rounded-2xl border text-sm font-medium outline-none appearance-none text-center"
            style={{
              ...inputStyle,
              borderColor: errors.homeTeamId
                ? "#F87171"
                : "var(--theme-primary-light)",
            }}
          >
            <option value="" disabled>
              홈팀 선택
            </option>
            {KBO_TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        {errors.awayTeamId && (
          <p className="text-xs text-red-400 mt-1">{errors.awayTeamId}</p>
        )}
      </div>

      {/* 점수 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <p className="text-sm font-bold text-gray-700 mb-5">점수는요?</p>

        <div className="flex items-center justify-center gap-6">
          {/* 원정 점수 */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400">{awayTeam?.shortName ?? "원정"}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAwayScore((v) => Math.max(0, v - 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold text-gray-500"
                style={{ background: "var(--theme-bg)" }}
              >
                −
              </button>
              <span className="text-4xl font-black w-10 text-center tabular-nums" style={{ color: "var(--theme-primary)" }}>
                {awayScore}
              </span>
              <button
                type="button"
                onClick={() => setAwayScore((v) => Math.min(99, v + 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-sm"
                style={{ background: "var(--theme-primary)" }}
              >
                +
              </button>
            </div>
          </div>

          <span className="text-2xl font-black text-gray-200 mt-6">:</span>

          {/* 홈 점수 */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400">{homeTeam?.shortName ?? "홈"}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setHomeScore((v) => Math.max(0, v - 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold text-gray-500"
                style={{ background: "var(--theme-bg)" }}
              >
                −
              </button>
              <span className="text-4xl font-black w-10 text-center tabular-nums" style={{ color: "var(--theme-primary)" }}>
                {homeScore}
              </span>
              <button
                type="button"
                onClick={() => setHomeScore((v) => Math.min(99, v + 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-sm"
                style={{ background: "var(--theme-primary)" }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 우리팀은? */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <p className="text-sm font-bold text-gray-700 mb-4">우리팀은?</p>
        <div className="flex gap-2">
          {(Object.entries(resultConfig) as [GameResult, typeof resultConfig.win][]).map(([value, cfg]) => (
            <button
              key={value}
              type="button"
              onClick={() => set("result", value)}
              className="flex-1 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all"
              style={
                form.result === value
                  ? { background: cfg.bg, color: cfg.text, borderColor: cfg.border }
                  : { background: "var(--theme-bg)", color: "#9CA3AF", borderColor: "var(--theme-primary-light)" }
              }
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 동반인 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <Users size={15} style={{ color: "var(--theme-primary)" }} />
          <p className="text-sm font-bold text-gray-700">누구랑 갔어요?</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(COMPANION_LABELS) as [string, string][]).map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => set("companion", value as typeof form.companion)}
                className="px-4 py-2 rounded-2xl text-sm font-medium border-2 transition-all"
                style={
                  form.companion === value
                    ? {
                        background: "var(--theme-primary)",
                        color: "#fff",
                        borderColor: "var(--theme-primary)",
                      }
                    : {
                        background: "var(--theme-bg)",
                        color: "#6B7280",
                        borderColor: "var(--theme-primary-light)",
                      }
                }
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* 메모 & 사진 */}
      <div className="rounded-3xl p-5" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <NotebookPen size={15} style={{ color: "var(--theme-primary)" }} />
          <p className="text-sm font-bold text-gray-700">기억하고 싶은 것들</p>
        </div>

        <textarea
          placeholder="경기 감상, 인상적인 장면 등을 기록해보세요"
          value={form.memo}
          onChange={(e) => set("memo", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border text-sm outline-none resize-none mb-4"
          style={inputStyle}
        />

        <p className="text-xs font-bold text-gray-500 mb-2">
          사진{" "}
          <span className="font-normal text-gray-400">
            ({form.photos.length}/5)
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {form.photos.map((photo, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {form.photos.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-xs gap-1 transition-opacity disabled:opacity-50"
              style={{
                borderColor: "var(--theme-primary-light)",
                color: "var(--theme-primary)",
              }}
            >
              <span className="text-2xl leading-none">+</span>
              {uploading ? "업로드 중" : "사진 추가"}
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
        style={{ background: "var(--theme-primary)" }}
      >
        {initialData ? "수정 완료" : "기록 저장"}
      </button>
    </form>
  );
}
