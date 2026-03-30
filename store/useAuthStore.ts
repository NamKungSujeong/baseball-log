import { IUser } from "@/types/model";
import { create } from "zustand";
import type { TeamId } from "@/types/game-log";
import { updateUserAction } from "@/features/settings/actions/settingsActions";
import { logoutAction } from "@/features/auth/actions/authActions";

interface AuthStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: () => Promise<void>;
  setNickname: (nickname: string) => Promise<void>;
  setSupportingTeam: (teamId: TeamId | null) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  setUser: (user: IUser) => set({ user }),
  logout: async () => {
    await logoutAction();
    set({ user: null });
  },
  setNickname: async (nickname: string) => {
    const user = get().user;
    if (!user) return;
    await updateUserAction(nickname, user.supportingTeamId);
    set((s) => ({ user: s.user ? { ...s.user, nickname } : null }));
  },
  setSupportingTeam: async (teamId: TeamId | null) => {
    const user = get().user;
    if (!user) return;
    await updateUserAction(user.nickname, teamId);
    set((s) => ({ user: s.user ? { ...s.user, supportingTeamId: teamId } : null }));
  },
}));

export default useAuthStore;
