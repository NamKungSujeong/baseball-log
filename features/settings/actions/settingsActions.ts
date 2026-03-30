"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { dbQuery, escapeStr, sqlStr } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { TeamId } from "@/types/game-log";

export async function updateUserAction(
  nickname: string,
  supportingTeamId: TeamId | null,
): Promise<void> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.user) throw new Error("인증이 필요합니다.");

  await dbQuery(
    `UPDATE users SET nickname = '${escapeStr(nickname)}', supporting_team_id = ${sqlStr(supportingTeamId)} WHERE id = ${session.user.id}`,
  );

  // 세션에도 최신 정보 반영
  session.user = { ...session.user, nickname, supportingTeamId };
  await session.save();
}
