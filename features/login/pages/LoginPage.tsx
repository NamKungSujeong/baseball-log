"use client";

import balllogLogLogo from "@/assets/images/balllog-logo.png";
import balllogMascotWithNote from "@/assets/images/mascot/balllog-mascot-with-note.png";
import Image from "next/image";
import Link from "next/link";
import useLogin from "../hooks/useLogin";
import { axiosConfigSetting } from "@/lib/api";

axiosConfigSetting();

export default function LoginPage() {
  const {
    email,
    password,
    submitting,
    error,
    setEmail,
    setPassword,
    handleLogin,
  } = useLogin();

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Image
            src={balllogMascotWithNote}
            alt="logo"
            width={100}
            height={100}
          />
        </div>
        <Image
          src={balllogLogLogo}
          alt="logo"
          width={0}
          height={0}
          className="w-auto h-[40px]"
        />
        <p className="text-sm text-gray-400 mt-1">나의 야구 직관을 기록해요!</p>
      </div>

      {/* 로그인 폼 */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <div
          className="rounded-3xl p-5 flex flex-col gap-4"
          style={{
            background: "var(--theme-bg-card)",
            border: "1px solid var(--theme-primary-light)",
          }}
        >
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">
              아이디 (이메일)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
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
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
              style={{
                background: "var(--theme-bg)",
                borderColor: "var(--theme-primary-light)",
              }}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={submitting || !email || !password}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white active:scale-95 transition-all shadow-md disabled:opacity-40"
          style={{ background: "var(--theme-primary)" }}
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>

        <div className="text-center mt-2">
          <span className="text-sm text-gray-400">계정이 없으신가요? </span>
          <Link
            href="/signup/profile"
            className="text-sm font-bold"
            style={{ color: "var(--theme-primary)" }}
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
