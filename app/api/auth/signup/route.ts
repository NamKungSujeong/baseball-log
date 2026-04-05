import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { dbQuery, escapeStr, sqlStr } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { IUser } from "@/types/model";

export async function POST(req: NextRequest) {
  const { nickname, email, password, supportingTeamId } = await req.json();

  if (!nickname || !email || !password) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
  }

  try {
    const { rows } = await dbQuery(
      `SELECT id FROM users WHERE email = '${escapeStr(email)}'`,
    );
    if (rows && rows.length > 0) {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 });
    }
  } catch (e) {
    console.error("[api/auth/signup] duplicate check threw:", e);
    return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
  }

  let passwordHash: string;
  try {
    passwordHash = await bcrypt.hash(password, 10);
  } catch (e) {
    console.error("[api/auth/signup] bcrypt.hash threw:", e);
    return NextResponse.json({ error: "비밀번호 처리 중 오류가 발생했습니다." }, { status: 500 });
  }

  let id: number;
  try {
    const result = await dbQuery(
      `INSERT INTO users (nickname, email, password_hash, supporting_team_id) VALUES ('${escapeStr(nickname)}', '${escapeStr(email)}', '${escapeStr(passwordHash)}', ${sqlStr(supportingTeamId ?? null)})`,
    );
    id = result.id;
  } catch (e) {
    console.error("[api/auth/signup] INSERT threw:", e);
    return NextResponse.json({ error: "회원가입 중 오류가 발생했습니다." }, { status: 500 });
  }

  const user: IUser = { id, nickname, supportingTeamId: supportingTeamId ?? null };

  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.user = user;
    await session.save();
  } catch (e) {
    console.error("[api/auth/signup] session.save threw:", e);
    return NextResponse.json({ error: "세션 저장 중 오류가 발생했습니다." }, { status: 500 });
  }

  return NextResponse.json({ user });
}
