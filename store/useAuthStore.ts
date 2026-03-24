import { IUser } from "@/types/model";
import { create } from "zustand";

interface AuthStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: {
    id: 0,
    nickname: "",
    supportingTeamId: null,
  },
  setUser: (user: IUser) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useAuthStore;
