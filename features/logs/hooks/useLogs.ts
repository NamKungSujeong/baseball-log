import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { GameLog, GameLogFormData } from "@/types/game-log";

export const LOGS_QUERY_KEY = ["logs"] as const;

async function fetchLogs(): Promise<GameLog[]> {
  const res = await fetch("/api/logs");
  if (!res.ok) throw new Error("로그 불러오기 실패");
  const data = await res.json();
  return data.logs ?? [];
}

/** 전체 직관 기록 목록 */
export function useLogs() {
  return useQuery({
    queryKey: LOGS_QUERY_KEY,
    queryFn: fetchLogs,
  });
}

/** 단일 직관 기록 — 목록 캐시에서 파생 */
export function useLog(id: string) {
  return useQuery({
    queryKey: LOGS_QUERY_KEY,
    queryFn: fetchLogs,
    select: (logs) => logs.find((l) => l.id === id),
  });
}

/** 기록 추가 */
export function useAddLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GameLogFormData): Promise<GameLog> => {
      const uid = crypto.randomUUID();
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, uid }),
      });
      if (!res.ok) throw new Error("기록 저장 실패");
      return {
        ...data,
        id: uid,
        createdAt: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOGS_QUERY_KEY });
    },
  });
}

/** 기록 수정 */
export function useUpdateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<GameLogFormData>;
    }) => {
      const res = await fetch(`/api/logs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("기록 수정 실패");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOGS_QUERY_KEY });
    },
  });
}

/** 기록 삭제 */
export function useDeleteLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/logs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("기록 삭제 실패");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOGS_QUERY_KEY });
    },
  });
}
