import type { TeamId } from "@/types/game-log";
import axios from "axios";

export async function signupUser(
  name: string,
  email: string,
  password: string,
  supportingTeamId: TeamId | null,
) {
  return axios.post("/api/auth/signup", {
    name,
    email,
    password,
    supportingTeamId,
  });
}
