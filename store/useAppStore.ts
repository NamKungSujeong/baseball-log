import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TeamId } from "@/types/game-log";

interface AppState {
  supportingTeamId: TeamId | null;
  nickname: string;
  setSupportingTeam: (teamId: TeamId | null) => void;
  setNickname: (nickname: string) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      supportingTeamId: null,
      nickname: "",
      setSupportingTeam: (teamId) => set({ supportingTeamId: teamId }),
      setNickname: (nickname) => set({ nickname }),
    }),
    { name: "baseball-app-storage" }
  )
);

export default useAppStore;
