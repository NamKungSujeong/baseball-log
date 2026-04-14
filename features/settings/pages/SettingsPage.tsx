"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import TeamSelector from "@/components/ui/TeamSelector";
import { KBO_TEAMS } from "@/utils/constants/kbo";
import type { TeamId } from "@/types/game-log";
import { Settings, CircleDot, Heart, Check, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, setNickname, setSupportingTeam, logout } = useAuthStore();
  const nickname = user?.nickname ?? "";
  const supportingTeamId = user?.supportingTeamId ?? null;

  const [nicknameInput, setNicknameInput] = useState(nickname);
  const [selectedTeamId, setSelectedTeamId] = useState<TeamId | null>(
    supportingTeamId,
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const supportingTeam = KBO_TEAMS.find((t) => t.id === selectedTeamId);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setNickname(nicknameInput.trim());
      await setSupportingTeam(selectedTeamId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    nicknameInput.trim() !== nickname || selectedTeamId !== supportingTeamId;

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <h1
          className="text-2xl font-black tracking-tight flex items-center gap-2"
          style={{ color: "var(--theme-primary)" }}
        >
          설정 <Settings size={22} />
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          프로필과 응원팀을 설정해요
        </p>
      </div>

      {/* 프로필 카드 */}
      <div
        className="rounded-3xl p-5 shadow-sm mb-4"
        style={{
          background: "var(--theme-bg-card)",
          border: "1px solid var(--theme-primary-light)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--theme-primary-light)" }}
          >
            {supportingTeam ? (
              <div className="w-8 h-8 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={supportingTeam.logo}
                  alt={supportingTeam.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <CircleDot size={24} style={{ color: "var(--theme-primary)" }} />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-800">
              {nicknameInput.trim() || "닉네임을 설정해봐요"}
            </p>
            <p className="text-xs text-gray-400">
              {supportingTeam ? `${supportingTeam.name} 팬` : "응원팀 미설정"}
            </p>
          </div>
        </div>

        <label className="block text-xs font-bold text-gray-500 mb-1.5">
          닉네임
        </label>
        <input
          type="text"
          value={nicknameInput}
          onChange={(e) => setNicknameInput(e.target.value)}
          placeholder="닉네임을 입력하세요"
          maxLength={20}
          className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none focus:border-(--theme-primary) transition-colors"
          style={{
            background: "var(--theme-bg)",
            borderColor: "var(--theme-primary-light)",
          }}
        />
      </div>

      {/* 응원팀 선택 카드 */}
      <div
        className="rounded-3xl p-5 shadow-sm mb-6"
        style={{
          background: "var(--theme-bg-card)",
          border: "1px solid var(--theme-primary-light)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart size={16} className="text-yellow-400 fill-yellow-400" />
          <p className="text-sm font-bold text-gray-700">응원팀 변경</p>
          {selectedTeamId && selectedTeamId !== supportingTeamId && (
            <span className="ml-auto text-xs text-orange-400 font-medium">
              변경됨
            </span>
          )}
        </div>

        <TeamSelector value={selectedTeamId} onChange={setSelectedTeamId} />

        {selectedTeamId && (
          <div
            className="mt-4 p-3 rounded-2xl flex items-center gap-3"
            style={{ background: "var(--theme-primary-light)" }}
          >
            <div className="w-9 h-9 relative shrink-0">
              {supportingTeam && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={supportingTeam.logo}
                  alt={supportingTeam.name}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: supportingTeam?.primary }}
              >
                {supportingTeam?.name}
              </p>
              <p className="text-xs text-gray-400">선택된 응원팀</p>
            </div>
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={(!hasChanges && !saved) || saving}
        className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-40"
        style={{ background: saved ? "#22C55E" : "var(--theme-primary)" }}
      >
        {saved ? (
          <span className="flex items-center justify-center gap-1.5">
            <Check size={16} /> 저장됐어요
          </span>
        ) : saving ? (
          "저장 중..."
        ) : (
          "저장하기"
        )}
      </button>

      {/* 로그아웃 버튼 */}
      <button
        onClick={async () => {
          await logout();
          router.push("/login");
        }}
        className="w-full mt-3 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
        style={{
          background: "var(--theme-bg-card)",
          border: "1px solid var(--theme-primary-light)",
          color: "#EF4444",
        }}
      >
        <LogOut size={16} /> 로그아웃
      </button>
    </div>
  );
}
