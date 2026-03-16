"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GameLog, GameLogFormData, GameResult, TeamId } from "@/types/game-log";
import { KBO_STADIUMS, KBO_TEAMS, COMPANION_LABELS } from "@/constants/kbo";
import { compressImage } from "@/lib/image";
import useLogStore from "@/store/useLogStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

interface LogFormProps {
  initialData?: GameLog;
}

const today = new Date().toISOString().split("T")[0];

const defaultForm: GameLogFormData = {
  date: today,
  stadiumId: "jamsil",
  homeTeamId: "LG",
  awayTeamId: "Doosan",
  myTeamId: "LG",
  seat: { section: "", row: "", number: "" },
  companion: "solo",
  result: "win",
  score: { home: 0, away: 0 },
  photos: [],
  memo: "",
  food: "",
};

export default function LogForm({ initialData }: LogFormProps) {
  const router = useRouter();
  const { addLog, updateLog } = useLogStore();
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
      : defaultForm
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [uploading, setUploading] = useState(false);

  // 점수 변경 시 결과 자동 계산
  useEffect(() => {
    if (!form.myTeamId) return;
    const isHome = form.myTeamId === form.homeTeamId;
    const myScore = isHome ? form.score.home : form.score.away;
    const oppScore = isHome ? form.score.away : form.score.home;
    const result: GameResult =
      myScore > oppScore ? "win" : myScore < oppScore ? "lose" : "draw";
    setForm((f) => ({ ...f, result }));
  }, [form.score, form.myTeamId, form.homeTeamId]);

  function set<K extends keyof GameLogFormData>(key: K, value: GameLogFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<string, string>> = {};
    if (!form.stadiumId) newErrors.stadiumId = "구장을 선택해주세요";
    if (!form.homeTeamId) newErrors.homeTeamId = "홈팀을 선택해주세요";
    if (!form.awayTeamId) newErrors.awayTeamId = "원정팀을 선택해주세요";
    if (form.homeTeamId === form.awayTeamId) newErrors.awayTeamId = "홈팀과 원정팀이 같을 수 없습니다";
    if (!form.myTeamId) newErrors.myTeamId = "응원팀을 선택해주세요";
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
    set("photos", form.photos.filter((_, i) => i !== index));
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

  const resultOptions: { value: GameResult; label: string; style: string }[] = [
    { value: "win", label: "승", style: "bg-green-100 text-green-700 border-green-300" },
    { value: "lose", label: "패", style: "bg-red-100 text-red-600 border-red-300" },
    { value: "draw", label: "무", style: "bg-gray-100 text-gray-600 border-gray-300" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-8">
      {/* 경기 정보 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">경기 정보</h2>

        <Input
          label="날짜"
          type="date"
          id="date"
          value={form.date}
          max={today}
          onChange={(e) => set("date", e.target.value)}
        />

        <Select
          label="구장"
          id="stadium"
          value={form.stadiumId}
          onChange={(e) => set("stadiumId", e.target.value as typeof form.stadiumId)}
          error={errors.stadiumId}
          placeholder="구장 선택"
        >
          {KBO_STADIUMS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="원정팀"
            id="awayTeam"
            value={form.awayTeamId}
            onChange={(e) => set("awayTeamId", e.target.value as TeamId)}
            error={errors.awayTeamId}
          >
            {KBO_TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>

          <Select
            label="홈팀"
            id="homeTeam"
            value={form.homeTeamId}
            onChange={(e) => set("homeTeamId", e.target.value as TeamId)}
            error={errors.homeTeamId}
          >
            {KBO_TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>

        <Select
          label="응원팀"
          id="myTeam"
          value={form.myTeamId}
          onChange={(e) => set("myTeamId", e.target.value as TeamId)}
          error={errors.myTeamId}
        >
          {KBO_TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>

        {/* 점수 */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">점수</p>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={99}
              value={form.score.away}
              onChange={(e) =>
                set("score", { ...form.score, away: Number(e.target.value) })
              }
              className="text-center"
            />
            <span className="text-gray-400 font-bold shrink-0">:</span>
            <Input
              type="number"
              min={0}
              max={99}
              value={form.score.home}
              onChange={(e) =>
                set("score", { ...form.score, home: Number(e.target.value) })
              }
              className="text-center"
            />
          </div>
        </div>

        {/* 결과 */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">결과</p>
          <div className="flex gap-2">
            {resultOptions.map(({ value, label, style }) => (
              <button
                key={value}
                type="button"
                onClick={() => set("result", value)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all
                  ${form.result === value ? style + " border-2 scale-105" : "bg-white text-gray-400 border-gray-200"}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 관람 정보 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">관람 정보</h2>

        <Select
          label="동반인"
          id="companion"
          value={form.companion}
          onChange={(e) => set("companion", e.target.value as typeof form.companion)}
        >
          {Object.entries(COMPANION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">좌석</p>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="구역"
              value={form.seat.section}
              onChange={(e) => set("seat", { ...form.seat, section: e.target.value })}
            />
            <Input
              placeholder="열"
              value={form.seat.row ?? ""}
              onChange={(e) => set("seat", { ...form.seat, row: e.target.value })}
            />
            <Input
              placeholder="번호"
              value={form.seat.number ?? ""}
              onChange={(e) => set("seat", { ...form.seat, number: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* 기록 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">기록</h2>

        <Textarea
          label="메모"
          id="memo"
          placeholder="경기 감상, 인상적인 장면 등을 기록해보세요"
          value={form.memo}
          onChange={(e) => set("memo", e.target.value)}
        />

        <Input
          label="먹거리"
          id="food"
          placeholder="오늘 먹은 구장 음식을 기록해보세요"
          value={form.food}
          onChange={(e) => set("food", e.target.value)}
        />

        {/* 사진 */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            사진 <span className="text-gray-400 font-normal">({form.photos.length}/5)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {form.photos.map((photo, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
            {form.photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-xs gap-1"
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
      </section>

      <Button type="submit" fullWidth size="lg">
        {initialData ? "수정 완료" : "기록 저장"}
      </Button>
    </form>
  );
}
