"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "@/store/useAppStore";
import TeamSelector from "@/components/ui/TeamSelector";
import type { TeamId } from "@/types/game-log";

export default function SignupProfilePage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const [nickname, setNickname] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<TeamId | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const canNextStep1 = nickname.trim().length >= 2;
  const canFinish = selectedTeamId !== null;

  const handleFinish = () => {
    // TODO: Firebase에 nickname, teamId 저장
    login(nickname.trim(), selectedTeamId);
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10" style={{ background: "var(--theme-bg)" }}>
      {/* 상단 진행 표시 */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              background: s <= step ? "var(--theme-primary)" : "var(--theme-primary-light)",
            }}
          />
        ))}
      </div>

      {step === 1 ? (
        /* Step 1: 닉네임 */
        <div className="flex flex-col flex-1">
          <div className="mb-8">
            <p className="text-xs font-bold mb-1" style={{ color: "var(--theme-primary)" }}>
              1 / 2
            </p>
            <h2 className="text-2xl font-black text-gray-800">
              어떻게 불러드릴까요? 👋
            </h2>
            <p className="text-sm text-gray-400 mt-1">앱에서 사용할 닉네임을 입력해주세요</p>
          </div>

          <div
            className="rounded-3xl p-5"
            style={{ background: "var(--theme-bg-card)", border: "1px solid var(--theme-primary-light)" }}
          >
            <label className="block text-xs font-bold text-gray-500 mb-2">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="2자 이상 입력해주세요"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
              style={{
                background: "var(--theme-bg)",
                borderColor: "var(--theme-primary-light)",
              }}
            />
            <p className="text-right text-xs text-gray-400 mt-1.5">{nickname.length} / 20</p>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => setStep(2)}
              disabled={!canNextStep1}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white active:scale-95 transition-all shadow-md disabled:opacity-40"
              style={{ background: "var(--theme-primary)" }}
            >
              다음
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: 응원팀 선택 */
        <div className="flex flex-col flex-1">
          <div className="mb-8">
            <p className="text-xs font-bold mb-1" style={{ color: "var(--theme-primary)" }}>
              2 / 2
            </p>
            <h2 className="text-2xl font-black text-gray-800">
              응원하는 팀이 어디예요? ⚾
            </h2>
            <p className="text-sm text-gray-400 mt-1">팀 색깔로 앱 테마가 바뀌어요</p>
          </div>

          <div
            className="rounded-3xl p-5"
            style={{ background: "var(--theme-bg-card)", border: "1px solid var(--theme-primary-light)" }}
          >
            <TeamSelector value={selectedTeamId} onChange={setSelectedTeamId} />
          </div>

          <div className="flex gap-3 mt-auto pt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95"
              style={{
                background: "var(--theme-bg-card)",
                color: "var(--theme-primary)",
                border: "1px solid var(--theme-primary-light)",
              }}
            >
              이전
            </button>
            <button
              onClick={handleFinish}
              disabled={!canFinish}
              className="flex-[2] py-4 rounded-2xl text-sm font-bold text-white active:scale-95 transition-all shadow-md disabled:opacity-40"
              style={{ background: "var(--theme-primary)" }}
            >
              시작하기 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
