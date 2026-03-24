import { apiFetch } from "@/lib/db";
import type { GameLog, GameLogFormData } from "@/types/game-log";

export async function fetchLogs(userId: number): Promise<GameLog[]> {
  const { logs } = await apiFetch(`/api/logs?userId=${userId}`);
  return logs;
}

export async function insertLog(
  data: GameLogFormData,
  userId: number,
  uid: string
): Promise<void> {
  await apiFetch("/api/logs", {
    method: "POST",
    body: JSON.stringify({ data, userId, uid }),
  });
}

export async function updateLogInDb(
  uid: string,
  data: Partial<GameLogFormData>
): Promise<void> {
  await apiFetch(`/api/logs/${uid}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}

export async function deleteLogFromDb(uid: string): Promise<void> {
  await apiFetch(`/api/logs/${uid}`, { method: "DELETE" });
}
