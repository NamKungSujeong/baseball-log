export type TeamId =
  | "LG"
  | "KT"
  | "SSG"
  | "NC"
  | "Doosan"
  | "KIA"
  | "Lotte"
  | "Samsung"
  | "Hanwha"
  | "Kiwoom";

export type StadiumId =
  | "jamsil"
  | "gocheok"
  | "suwon"
  | "incheon"
  | "changwon"
  | "gwangju"
  | "busan"
  | "daegu"
  | "daejeon";

export type CompanionType = "solo" | "friend" | "family" | "date" | "group";
export type GameResult = "win" | "lose" | "draw";

export interface Seat {
  section: string;
  row?: string;
  number?: string;
}

export interface GameLog {
  id: string;
  date: string; // 'YYYY-MM-DD'
  stadiumId: StadiumId;
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  myTeamId: TeamId;
  seat: Seat;
  companion: CompanionType;
  result: GameResult;
  score: { home: number; away: number };
  photos: string[]; // base64
  memo: string;
  food: string;
  createdAt: string;
}

export type GameLogFormData = Omit<GameLog, "id" | "createdAt">;
