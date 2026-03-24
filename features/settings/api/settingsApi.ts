import { apiFetch } from "@/lib/db";
import type { TeamId } from "@/types/game-log";

export async function updateUser(
  userId: number,
  nickname: string,
  supportingTeamId: TeamId | null
): Promise<void> {
  await apiFetch(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ nickname, supportingTeamId }),
  });
}
