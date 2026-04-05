import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { dbQuery, escapeStr, sqlStr, sqlNum } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { GameLogFormData } from "@/types/game-log";

async function requireUser() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.user) return null;
  return session.user;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { uid } = await params;
  const data: Partial<GameLogFormData> = await req.json();

  // 소유권 확인
  try {
    const { rows } = await dbQuery(
      `SELECT user_id FROM game_logs WHERE uid = '${escapeStr(uid)}'`,
    );
    if (rows.length === 0 || rows[0].user_id !== user.id) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }
  } catch (e) {
    return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
  }

  const sets: string[] = [];
  if (data.date !== undefined) sets.push(`game_date = '${escapeStr(data.date)}'`);
  if (data.stadiumId !== undefined) sets.push(`stadium_id = '${escapeStr(data.stadiumId)}'`);
  if (data.homeTeamId !== undefined) sets.push(`home_team_id = '${escapeStr(data.homeTeamId)}'`);
  if (data.awayTeamId !== undefined) sets.push(`away_team_id = '${escapeStr(data.awayTeamId)}'`);
  if (data.myTeamId !== undefined) sets.push(`my_team_id = '${escapeStr(data.myTeamId)}'`);
  if (data.seat !== undefined) {
    sets.push(`seat_section = ${sqlStr(data.seat.section)}`);
    sets.push(`seat_row = ${sqlStr(data.seat.row ?? null)}`);
    sets.push(`seat_number = ${sqlStr(data.seat.number ?? null)}`);
  }
  if (data.companion !== undefined) sets.push(`companion = '${escapeStr(data.companion)}'`);
  if (data.result !== undefined) sets.push(`result = '${escapeStr(data.result)}'`);
  if (data.score !== undefined) {
    sets.push(`score_home = ${sqlNum(data.score.home)}`);
    sets.push(`score_away = ${sqlNum(data.score.away)}`);
  }
  if (data.photos !== undefined) sets.push(`photos = '${escapeStr(JSON.stringify(data.photos))}'`);
  if (data.memo !== undefined) sets.push(`memo = ${sqlStr(data.memo)}`);
  if (data.food !== undefined) sets.push(`food = ${sqlStr(data.food)}`);

  if (sets.length > 0) {
    try {
      await dbQuery(`UPDATE game_logs SET ${sets.join(", ")} WHERE uid = '${escapeStr(uid)}'`);
    } catch (e) {
      return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { uid } = await params;

  // 소유권 확인
  try {
    const { rows } = await dbQuery(
      `SELECT user_id FROM game_logs WHERE uid = '${escapeStr(uid)}'`,
    );
    if (rows.length === 0 || rows[0].user_id !== user.id) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }
  } catch (e) {
    return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
  }

  try {
    await dbQuery(`DELETE FROM game_logs WHERE uid = '${escapeStr(uid)}'`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
  }
}
