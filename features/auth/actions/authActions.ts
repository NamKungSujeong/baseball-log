"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { dbQuery, escapeStr, sqlStr } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import { logError } from "@/lib/logError.server";
import type { TeamId } from "@/types/game-log";
import type { IUser } from "@/types/model";

async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function loginAction(
  email: string,
  password: string,
): Promise<{ user: IUser } | { error: string }> {
  console.log("[loginAction] called, email:", email);
  console.log(
    "[loginAction] SESSION_SECRET:",
    process.env.SESSION_SECRET ? "SET" : "UNDEFINED",
  );
  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해주세요." };
  }

  let rows: any[];
  try {
    const result = await dbQuery(
      `SELECT id, nickname, password_hash, supporting_team_id FROM users WHERE email = '${escapeStr(email)}'`,
    );
    rows = result.rows;
    console.log("[loginAction] SELECT rows count:", rows?.length);
  } catch (e) {
    console.error("[loginAction] dbQuery threw:", e);
    await logError("loginAction:dbQuery", e);
    return { error: "DB 오류가 발생했습니다." };
  }

  if (!rows || rows.length === 0) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const row = rows[0];
  console.log("[loginAction] comparing password...");
  let match: boolean;
  try {
    match = await bcrypt.compare(password, row.password_hash);
    console.log("[loginAction] password match:", match);
  } catch (e) {
    console.error("[loginAction] bcrypt.compare threw:", e);
    await logError("loginAction:bcrypt.compare", e);
    return { error: "비밀번호 확인 중 오류가 발생했습니다." };
  }

  if (!match) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const user: IUser = {
    id: row.id,
    nickname: row.nickname,
    supportingTeamId: row.supporting_team_id ?? null,
  };

  try {
    const session = await getSession();
    session.user = user;
    await session.save();
    console.log("[loginAction] session saved");
  } catch (e) {
    console.error("[loginAction] session save threw:", e);
    await logError("loginAction:session.save", e);
    return { error: "세션 저장 중 오류가 발생했습니다." };
  }

  return { user };
}

export async function signupAction(
  nickname: string,
  email: string,
  password: string,
  supportingTeamId: TeamId | null,
): Promise<{ user: IUser } | { error: string }> {
  console.log("[signupAction] called, email:", email, "nickname:", nickname);
  console.log(
    "[signupAction] SESSION_SECRET:",
    process.env.SESSION_SECRET ? "SET" : "UNDEFINED",
  );
  if (!nickname || !email || !password) {
    return { error: "필수 항목을 모두 입력해주세요." };
  }

  try {
    const { rows } = await dbQuery(
      `SELECT id FROM users WHERE email = '${escapeStr(email)}'`,
    );
    if (rows && rows.length > 0) {
      return { error: "이미 사용 중인 이메일입니다." };
    }
  } catch (e) {
    console.error("[signupAction] duplicate check threw:", e);
    await logError("signupAction:duplicateCheck", e);
    return { error: "DB 오류가 발생했습니다." };
  }

  let passwordHash: string;
  try {
    passwordHash = await bcrypt.hash(password, 10);
    console.log("[signupAction] password hashed");
  } catch (e) {
    console.error("[signupAction] bcrypt.hash threw:", e);
    await logError("signupAction:bcrypt.hash", e);
    return { error: "비밀번호 처리 중 오류가 발생했습니다." };
  }

  let id: number;
  try {
    const result = await dbQuery(
      `INSERT INTO users (nickname, email, password_hash, supporting_team_id) VALUES ('${escapeStr(nickname)}', '${escapeStr(email)}', '${escapeStr(passwordHash)}', ${sqlStr(supportingTeamId)})`,
    );
    id = result.id;
    console.log("[signupAction] user inserted, id:", id);
  } catch (e) {
    console.error("[signupAction] INSERT threw:", e);
    await logError("signupAction:INSERT", e);
    return { error: "회원가입 중 오류가 발생했습니다." };
  }

  const user: IUser = {
    id,
    nickname,
    supportingTeamId: supportingTeamId ?? null,
  };

  try {
    const session = await getSession();
    session.user = user;
    await session.save();
    console.log("[signupAction] session saved");
  } catch (e) {
    console.error("[signupAction] session save threw:", e);
    await logError("signupAction:session.save", e);
    return { error: "세션 저장 중 오류가 발생했습니다." };
  }

  return { user };
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

export async function getSessionUser(): Promise<IUser | null> {
  console.log("[getSessionUser] called");
  console.log(
    "[getSessionUser] SESSION_SECRET:",
    process.env.SESSION_SECRET ? "SET" : "UNDEFINED",
  );
  try {
    const session = await getSession();
    console.log(
      "[getSessionUser] session loaded, user:",
      session.user ? "EXISTS" : "NONE",
    );
    return session.user ?? null;
  } catch (e) {
    console.error("[getSessionUser] threw:", e);
    await logError("getSessionUser", e);
    return null;
  }
}
