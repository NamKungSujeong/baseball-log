"use client";

import { createQueryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/useToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import ThemeProvider from "@/components/layout/ThemeProvider";
import AuthGuard from "@/components/layout/AuthGuard";
import useAuthStore from "@/store/useAuthStore";
import type { IUser } from "@/types/model";

export default function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: IUser | null;
}) {
  const toast = useToast();
  const [queryClient] = useState(() => createQueryClient(toast));

  // Server에서 읽어온 세션 유저를 Zustand에 동기화 (Server Action 호출 없음)
  useEffect(() => {
    if (initialUser) {
      useAuthStore.setState({ user: initialUser });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthGuard>
          {children}
        </AuthGuard>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
