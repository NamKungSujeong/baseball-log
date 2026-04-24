"use client";

import { useEffect } from "react";
import { getSessionUser } from "@/features/auth/actions/authActions";
import useAuthStore from "@/store/useAuthStore";

// 페이지 새로고침 후 Zustand 스토어에 세션 유저 정보 복원
export default function SessionInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getSessionUser().then((user) => {
      if (user) useAuthStore.setState({ user });
    });
  }, []);

  return <>{children}</>;
}
