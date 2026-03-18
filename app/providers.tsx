"use client";

import { createQueryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/useToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import ThemeProvider from "@/components/layout/ThemeProvider";
import AuthGuard from "@/components/layout/AuthGuard";

export default function Providers({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const [queryClient] = useState(() => createQueryClient(toast));

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
