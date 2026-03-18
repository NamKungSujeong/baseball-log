"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "@/store/useAppStore";

type Tab = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 처리 (Firebase 연결 전 임시 — 실제 로직은 Firebase 연동 시 교체)
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Firebase signInWithEmailAndPassword
    login();
    router.replace("/");
  };

  // 카카오 회원가입 처리 (Firebase 연결 전 임시)
  const handleKakaoSignup = () => {
    // TODO: Firebase signInWithPopup(kakaoProvider)
    // 회원가입 후 프로필 설정으로 이동
    router.push("/signup/profile");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--theme-bg)" }}
    >
      {/* 로고 */}
      <div className="mb-10 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{ background: "var(--theme-primary)" }}
        >
          <span className="text-4xl">⚾</span>
        </div>
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ color: "var(--theme-primary)" }}
        >
          직관로그
        </h1>
        <p className="text-sm text-gray-400 mt-1">나의 야구 직관을 기록해요</p>
      </div>

      {/* 탭 */}
      <div
        className="flex w-full max-w-sm rounded-2xl p-1 mb-6"
        style={{ background: "var(--theme-bg-card)" }}
      >
        {(["login", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === t ? "var(--theme-primary)" : "transparent",
              color: tab === t ? "#fff" : "#9CA3AF",
            }}
          >
            {t === "login" ? "로그인" : "회원가입"}
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm">
        {tab === "login" ? (
          /* 로그인 폼 */
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              className="w-full px-4 py-3.5 rounded-2xl border text-sm outline-none transition-colors"
              style={{
                background: "var(--theme-bg-card)",
                borderColor: "var(--theme-primary-light)",
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="w-full px-4 py-3.5 rounded-2xl border text-sm outline-none transition-colors"
              style={{
                background: "var(--theme-bg-card)",
                borderColor: "var(--theme-primary-light)",
              }}
            />
            <button
              type="submit"
              className="w-full py-4 rounded-2xl text-sm font-bold text-white mt-1 active:scale-95 transition-transform shadow-md"
              style={{ background: "var(--theme-primary)" }}
            >
              로그인
            </button>
          </form>
        ) : (
          /* 회원가입 */
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-500">
              카카오 계정으로 간편하게 시작해요
            </p>
            <button
              onClick={handleKakaoSignup}
              className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
              style={{ background: "#FEE500", color: "#191919" }}
            >
              {/* 카카오 아이콘 */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.64 1.68 4.96 4.22 6.34l-.9 3.35a.37.37 0 0 0 .54.41L10.9 18.2A10.5 10.5 0 0 0 12 18c4.97 0 9-3.36 9-7.5S16.97 3 12 3z" />
              </svg>
              카카오로 시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
