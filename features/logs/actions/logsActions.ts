"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { dbQuery, escapeStr, sqlStr, sqlNum } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { GameLog, GameLogFormData } from "@/types/game-log";

async function requireUser() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.user) throw new Error("인증이 필요합니다.");
  return session.user;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToGameLog(row: any): GameLog {
  return {
    id: row.uid,
    date: row.game_date,
    stadiumId: row.stadium_id,
    homeTeamId: row.home_team_id,
    awayTeamId: row.away_team_id,
    myTeamId: row.my_team_id,
    seat: {
      section: row.seat_section ?? "",
      row: row.seat_row ?? "",
      number: row.seat_number ?? "",
    },
    companion: row.companion,
    result: row.result,
    score: { home: row.score_home, away: row.score_away },
    photos: row.photos ? JSON.parse(row.photos) : [],
    memo: row.memo ?? "",
    food: row.food ?? "",
    createdAt: row.created_at,
  };
}

export async function fetchLogsAction(): Promise<GameLog[]> {
  const user = await requireUser();
  const { rows } = await dbQuery(
    `SELECT * FROM game_logs WHERE user_id = ${user.id}`,
  );
  return (rows.map(rowToGameLog) as GameLog[]).sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function insertLogAction(data: GameLogFormData, uid: string): Promise<void> {
  const user = await requireUser();
  const photosJson = escapeStr(JSON.stringify(data.photos));
  await dbQuery(
    `INSERT INTO game_logs (uid, user_id, game_date, stadium_id, home_team_id, away_team_id, my_team_id, seat_section, seat_row, seat_number, companion, result, score_home, score_away, photos, memo, food) VALUES ('${escapeStr(uid)}', ${user.id}, '${escapeStr(data.date)}', '${escapeStr(data.stadiumId)}', '${escapeStr(data.homeTeamId)}', '${escapeStr(data.awayTeamId)}', '${escapeStr(data.myTeamId)}', ${sqlStr(data.seat.section)}, ${sqlStr(data.seat.row ?? null)}, ${sqlStr(data.seat.number ?? null)}, '${escapeStr(data.companion)}', '${escapeStr(data.result)}', ${sqlNum(data.score.home)}, ${sqlNum(data.score.away)}, '${photosJson}', ${sqlStr(data.memo)}, ${sqlStr(data.food)})`,
  );
}

export async function updateLogAction(uid: string, data: Partial<GameLogFormData>): Promise<void> {
  const user = await requireUser();

  // 소유권 확인
  const { rows } = await dbQuery(
    `SELECT user_id FROM game_logs WHERE uid = '${escapeStr(uid)}'`,
  );
  if (rows.length === 0 || rows[0].user_id !== user.id) {
    throw new Error("권한이 없습니다.");
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
    await dbQuery(`UPDATE game_logs SET ${sets.join(", ")} WHERE uid = '${escapeStr(uid)}'`);
  }
}

export async function deleteLogAction(uid: string): Promise<void> {
  const user = await requireUser();

  // 소유권 확인
  const { rows } = await dbQuery(
    `SELECT user_id FROM game_logs WHERE uid = '${escapeStr(uid)}'`,
  );
  if (rows.length === 0 || rows[0].user_id !== user.id) {
    throw new Error("권한이 없습니다.");
  }

  await dbQuery(`DELETE FROM game_logs WHERE uid = '${escapeStr(uid)}'`);
}
