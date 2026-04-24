import type { SessionOptions } from "iron-session";
import type { TeamId } from "@/types/game-log";

export interface SessionData {
  user?: {
    id: number;
    nickname: string;
    supportingTeamId: TeamId | null;
  };
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "ball-log-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};
