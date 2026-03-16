import { create } from "zustand";

interface AppState {
  // 여기에 전역 상태 추가
}

const useAppStore = create<AppState>(() => ({
  // 초기값
}));

export default useAppStore;
