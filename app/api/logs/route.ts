import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { dbQuery, escapeStr, sqlStr, sqlNum } from "@/lib/db.server";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { GameLog, GameLogFormData } from "@/types/game-log";

async function requireUser() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.user) return null;
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

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  try {
    const { rows } = await dbQuery(`SELECT * FROM game_logs WHERE user_id = ${user.id}`);
    const logs = (rows.map(rowToGameLog) as GameLog[]).sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return b.createdAt.localeCompare(a.createdAt);
    });
    return NextResponse.json({ logs });
  } catch (e) {
    console.error("[api/logs GET] threw:", e);
    return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { data, uid }: { data: GameLogFormData; uid: string } = await req.json();
  const photosJson = escapeStr(JSON.stringify(data.photos));

  try {
    await dbQuery(
      `INSERT INTO game_logs (uid, user_id, game_date, stadium_id, home_team_id, away_team_id, my_team_id, seat_section, seat_row, seat_number, companion, result, score_home, score_away, photos, memo, food) VALUES ('${escapeStr(uid)}', ${user.id}, '${escapeStr(data.date)}', '${escapeStr(data.stadiumId)}', '${escapeStr(data.homeTeamId)}', '${escapeStr(data.awayTeamId)}', '${escapeStr(data.myTeamId)}', ${sqlStr(data.seat.section)}, ${sqlStr(data.seat.row ?? null)}, ${sqlStr(data.seat.number ?? null)}, '${escapeStr(data.companion)}', '${escapeStr(data.result)}', ${sqlNum(data.score.home)}, ${sqlNum(data.score.away)}, '${photosJson}', ${sqlStr(data.memo)}, ${sqlStr(data.food)})`,
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/logs POST] threw:", e);
    return NextResponse.json({ error: "DB 오류가 발생했습니다." }, { status: 500 });
  }
}
