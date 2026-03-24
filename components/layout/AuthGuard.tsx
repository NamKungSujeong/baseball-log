"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const AUTH_PATHS = ["/login", "/signup"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!isLoggedIn && !isAuthPage) {
      router.replace("/login");
    }
  }, [isLoggedIn, isAuthPage, router]);

  // 인증 필요한 페이지인데 비로그인이면 아무것도 렌더하지 않음 (리디렉션 중)
  if (!isLoggedIn && !isAuthPage) return null;

  return <>{children}</>;
}
