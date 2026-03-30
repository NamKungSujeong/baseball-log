import { create } from "zustand";
import type { GameLog, GameLogFormData } from "@/types/game-log";
import {
  fetchLogsAction,
  insertLogAction,
  updateLogAction,
  deleteLogAction,
} from "@/features/logs/actions/logsActions";

interface LogStore {
  logs: GameLog[];
  loading: boolean;
  fetchLogs: () => Promise<void>;
  addLog: (data: GameLogFormData) => Promise<GameLog>;
  updateLog: (id: string, data: Partial<GameLogFormData>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  getLog: (id: string) => GameLog | undefined;
}

const useLogStore = create<LogStore>((set, get) => ({
  logs: [],
  loading: false,

  fetchLogs: async () => {
    set({ loading: true });
    try {
      const logs = await fetchLogsAction();
      set({ logs });
    } finally {
      set({ loading: false });
    }
  },

  addLog: async (data: GameLogFormData) => {
    const uid = crypto.randomUUID();
    const log: GameLog = {
      ...data,
      id: uid,
      createdAt: new Date().toISOString(),
    };
    await insertLogAction(data, uid);
    set((s) => ({ logs: [log, ...s.logs] }));
    return log;
  },

  updateLog: async (id: string, data: Partial<GameLogFormData>) => {
    await updateLogAction(id, data);
    set((s) => ({
      logs: s.logs.map((l) => (l.id === id ? { ...l, ...data } : l)),
    }));
  },

  deleteLog: async (id: string) => {
    await deleteLogAction(id);
    set((s) => ({ logs: s.logs.filter((l) => l.id !== id) }));
  },

  getLog: (id: string) => get().logs.find((l) => l.id === id),
}));

export default useLogStore;
