"use client";

import TeamSelector from "@/components/ui/TeamSelector";
import type { TeamId } from "@/types/game-log";
import { CircleDot, Hand, Sparkles } from "lucide-react";
import { useState } from "react";
import useSignup from "../hooks/useSignup";

export default function SignupProfilePage() {
  const { handleSignup, submitting, error } = useSignup();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<TeamId | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const passwordMatch = password === passwordConfirm;
  const canNextStep1 =
    nickname.trim().length >= 2 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    passwordMatch;

  const handleFinish = async () => {
    await handleSignup(nickname.trim(), email.trim(), password, selectedTeamId);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10">
      {/* 상단 진행 표시 */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              background:
                s <= step
                  ? "var(--theme-primary)"
                  : "var(--theme-primary-light)",
            }}
          />
        ))}
      </div>

      {step === 1 ? (
        <div className="flex flex-col flex-1">
          <div className="mb-8">
            <p
              className="text-xs font-bold mb-1"
              style={{ color: "var(--theme-primary)" }}
            >
              1 / 2
            </p>
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              회원가입 <Hand size={24} className="text-gray-700" />
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              기본 정보를 입력해주세요
            </p>
          </div>

          <div
            className="rounded-3xl p-5 flex flex-col gap-4"
            style={{
              background: "var(--theme-bg-card)",
              border: "1px solid var(--theme-primary-light)",
            }}
          >
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">
                닉네임
              </label>
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
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">
                아이디 (이메일)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
                style={{
                  background: "var(--theme-bg)",
                  borderColor: "var(--theme-primary-light)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상 입력해주세요"
                className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
                style={{
                  background: "var(--theme-bg)",
                  borderColor: "var(--theme-primary-light)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
                style={{
                  background: "var(--theme-bg)",
                  borderColor:
                    passwordConfirm.length > 0 && !passwordMatch
                      ? "#ef4444"
                      : "var(--theme-primary-light)",
                }}
              />
              {passwordConfirm.length > 0 && !passwordMatch && (
                <p className="text-xs text-red-500 mt-1">
                  비밀번호가 일치하지 않습니다
                </p>
              )}
            </div>
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
        <div className="flex flex-col flex-1">
          <div className="mb-8">
            <p
              className="text-xs font-bold mb-1"
              style={{ color: "var(--theme-primary)" }}
            >
              2 / 2
            </p>
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              응원하는 팀이 어디예요?{" "}
              <CircleDot size={24} style={{ color: "var(--theme-primary)" }} />
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              팀 색깔로 앱 테마가 바뀌어요
            </p>
          </div>

          <div
            className="rounded-3xl p-5"
            style={{
              background: "var(--theme-bg-card)",
              border: "1px solid var(--theme-primary-light)",
            }}
          >
            <TeamSelector value={selectedTeamId} onChange={setSelectedTeamId} />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center mt-4">{error}</p>
          )}

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
              disabled={submitting}
              className="flex-2 py-4 rounded-2xl text-sm font-bold text-white active:scale-95 transition-all shadow-md disabled:opacity-40"
              style={{ background: "var(--theme-primary)" }}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Sparkles size={16} /> {submitting ? "가입 중..." : "시작하기"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
