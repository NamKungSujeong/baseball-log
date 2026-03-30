"use client";

// 라우트 보호는 middleware.ts에서 처리.
// 이 컴포넌트는 세션 로드 전 깜빡임 방지를 위해 유지.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
