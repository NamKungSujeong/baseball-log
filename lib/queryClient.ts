import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { getErrorMessage, isApiError } from "./errors";

type ToastFn = (message: string, type: "error" | "success") => void;

/**
 * QueryClient 팩토리
 * toast 함수는 Providers에서 주입 (sonner, react-hot-toast 등 교체 가능)
 */
export function createQueryClient(toast: ToastFn) {
  return new QueryClient({
    queryCache: new QueryCache({
      onError(error, query) {
        // 쿼리에 meta.silent = true 이면 전역 에러 토스트 생략
        if (query.meta?.silent) return;

        // 401은 인증 처리에서 별도 핸들링하므로 전역 토스트 생략
        if (isApiError(error) && error.status === 401) return;

        toast(getErrorMessage(error), "error");
      },
    }),
    mutationCache: new MutationCache({
      onError(error, _variables, _context, mutation) {
        if (mutation.meta?.silent) return;
        toast(getErrorMessage(error), "error");
      },
      onSuccess(_data, _variables, _context, mutation) {
        if (mutation.meta?.successMessage) {
          toast(mutation.meta.successMessage as string, "success");
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,      // 1분
        gcTime: 1000 * 60 * 5,     // 5분
        retry(failureCount, error) {
          // 4xx 에러는 재시도 안 함
          if (isApiError(error) && error.status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
