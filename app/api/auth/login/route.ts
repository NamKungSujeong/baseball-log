import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { dbQuery, escapeStr } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { IUser } from "@/types/model";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
  }

  let rows: any[];
  try {
    const result = await dbQuery(
      `SELECT id, nickname, password_hash, supporting_team_id FROM users WHERE email = '${escapeStr(email)}'`,
    );
    rows = result.rows;
  } catch (e) {
    console.error("[api/auth/login] dbQuery threw:", e);
    return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const row = rows[0];
  let match: boolean;
  try {
    match = await bcrypt.compare(password, row.password_hash);
  } catch (e) {
    console.error("[api/auth/login] bcrypt.compare threw:", e);
    return NextResponse.json({ error: "비밀번호 확인 중 오류가 발생했습니다." }, { status: 500 });
  }

  if (!match) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const user: IUser = {
    id: row.id,
    nickname: row.nickname,
    supportingTeamId: row.supporting_team_id ?? null,
  };

  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.user = user;
    await session.save();
  } catch (e) {
    console.error("[api/auth/login] session.save threw:", e);
    return NextResponse.json({ error: "세션 저장 중 오류가 발생했습니다." }, { status: 500 });
  }

  return NextResponse.json({ user });
}
