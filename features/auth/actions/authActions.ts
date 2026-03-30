"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { dbQuery, escapeStr, sqlStr } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { TeamId } from "@/types/game-log";
import type { IUser } from "@/types/model";

async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function loginAction(
  email: string,
  password: string,
): Promise<{ user: IUser } | { error: string }> {
  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해주세요." };
  }

  const { rows } = await dbQuery(
    `SELECT id, nickname, password_hash, supporting_team_id FROM users WHERE email = '${escapeStr(email)}'`,
  );

  if (rows.length === 0) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const row = rows[0];
  const match = await bcrypt.compare(password, row.password_hash);

  if (!match) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const user: IUser = {
    id: row.id,
    nickname: row.nickname,
    supportingTeamId: row.supporting_team_id ?? null,
  };

  const session = await getSession();
  session.user = user;
  await session.save();

  return { user };
}

export async function signupAction(
  nickname: string,
  email: string,
  password: string,
  supportingTeamId: TeamId | null,
): Promise<{ user: IUser } | { error: string }> {
  if (!nickname || !email || !password) {
    return { error: "필수 항목을 모두 입력해주세요." };
  }

  const { rows } = await dbQuery(
    `SELECT id FROM users WHERE email = '${escapeStr(email)}'`,
  );
  if (rows.length > 0) {
    return { error: "이미 사용 중인 이메일입니다." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { id } = await dbQuery(
    `INSERT INTO users (nickname, email, password_hash, supporting_team_id) VALUES ('${escapeStr(nickname)}', '${escapeStr(email)}', '${escapeStr(passwordHash)}', ${sqlStr(supportingTeamId)})`,
  );

  const user: IUser = { id, nickname, supportingTeamId: supportingTeamId ?? null };

  const session = await getSession();
  session.user = user;
  await session.save();

  return { user };
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

export async function getSessionUser(): Promise<IUser | null> {
  const session = await getSession();
  return session.user ?? null;
}
