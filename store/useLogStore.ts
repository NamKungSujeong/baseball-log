import { create } from "zustand";
import type { GameLog, GameLogFormData } from "@/types/game-log";

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
      const res = await fetch("/api/logs");
      const data = await res.json();
      set({ logs: data.logs ?? [] });
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
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, uid }),
    });
    set((s) => ({ logs: [log, ...s.logs] }));
    return log;
  },

  updateLog: async (id: string, data: Partial<GameLogFormData>) => {
    await fetch(`/api/logs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    set((s) => ({
      logs: s.logs.map((l) => (l.id === id ? { ...l, ...data } : l)),
    }));
  },

  deleteLog: async (id: string) => {
    await fetch(`/api/logs/${id}`, { method: "DELETE" });
    set((s) => ({ logs: s.logs.filter((l) => l.id !== id) }));
  },

  getLog: (id: string) => get().logs.find((l) => l.id === id),
}));

export default useLogStore;
