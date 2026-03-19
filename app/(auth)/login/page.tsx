"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import balllogMascotWithNote from "@/assets/images/mascot/balllog-mascot-with-note.png";
import balllogLogLogo from "@/assets/images/balllog-logo.png";

export default function LoginPage() {
  const router = useRouter();

  // 카카오 로그인 처리 (Firebase 연결 전 임시)
  const handleKakaoLogin = () => {
    // TODO: Firebase signInWithPopup(kakaoProvider)
    router.push("/signup/profile");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="mb-16 text-center flex flex-col items-center">
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
        <p className="text-sm text-gray-400 mt-1">나의 야구 직관을 기록해요</p>
      </div>

      {/* 카카오 로그인 버튼 */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleKakaoLogin}
          className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
          style={{ background: "#FEE500", color: "#191919" }}
        >
          {/* 카카오 아이콘 */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
            <path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.64 1.68 4.96 4.22 6.34l-.9 3.35a.37.37 0 0 0 .54.41L10.9 18.2A10.5 10.5 0 0 0 12 18c4.97 0 9-3.36 9-7.5S16.97 3 12 3z" />
          </svg>
          카카오로 로그인
        </button>
      </div>
    </div>
  );
}
