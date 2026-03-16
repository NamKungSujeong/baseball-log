import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameLog, GameLogFormData } from "@/types/game-log";

interface LogStore {
  logs: GameLog[];
  addLog: (data: GameLogFormData) => GameLog;
  updateLog: (id: string, data: Partial<GameLogFormData>) => void;
  deleteLog: (id: string) => void;
  getLog: (id: string) => GameLog | undefined;
}

const useLogStore = create<LogStore>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (data) => {
        const log: GameLog = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ logs: [log, ...s.logs] }));
        return log;
      },

      updateLog: (id, data) => {
        set((s) => ({
          logs: s.logs.map((l) => (l.id === id ? { ...l, ...data } : l)),
        }));
      },

      deleteLog: (id) => {
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) }));
      },

      getLog: (id) => get().logs.find((l) => l.id === id),
    }),
    { name: "baseball-log-storage" }
  )
);

export default useLogStore;
