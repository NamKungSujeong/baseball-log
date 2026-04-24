import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { dbQuery, escapeStr, sqlStr } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { TeamId } from "@/types/game-log";

export async function PUT(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { nickname, supportingTeamId }: { nickname: string; supportingTeamId: TeamId | null } = await req.json();

  try {
    await dbQuery(
      `UPDATE users SET nickname = '${escapeStr(nickname)}', supporting_team_id = ${sqlStr(supportingTeamId)} WHERE id = ${session.user.id}`,
    );
  } catch (e) {
    console.error("[api/user PUT] threw:", e);
    return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
  }

  session.user = { ...session.user, nickname, supportingTeamId };
  await session.save();

  return NextResponse.json({ ok: true });
}
