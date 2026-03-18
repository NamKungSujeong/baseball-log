import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TeamId } from "@/types/game-log";

interface AppState {
  isLoggedIn: boolean;
  nickname: string;
  supportingTeamId: TeamId | null;
  login: (nickname?: string, teamId?: TeamId | null) => void;
  logout: () => void;
  setSupportingTeam: (teamId: TeamId | null) => void;
  setNickname: (nickname: string) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      nickname: "",
      supportingTeamId: null,
      login: (nickname = "", teamId = null) =>
        set({ isLoggedIn: true, nickname, supportingTeamId: teamId }),
      logout: () =>
        set({ isLoggedIn: false, nickname: "", supportingTeamId: null }),
      setSupportingTeam: (teamId) => set({ supportingTeamId: teamId }),
      setNickname: (nickname) => set({ nickname }),
    }),
    { name: "baseball-app-storage" }
  )
);

export default useAppStore;
