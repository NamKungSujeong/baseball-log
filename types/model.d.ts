import { TeamId } from "./game-log";

export interface IUser {
  id: number;
  nickname: string;
  supportingTeamId: TeamId | null;
}
