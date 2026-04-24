// 로그 데이터 패칭 및 뮤테이션은 features/logs/hooks/useLogs.ts (React Query)로 이전됨
// 이 스토어는 하위 호환을 위해 유지되나 현재 사용하지 않음

import { create } from "zustand";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LogStore {}

const useLogStore = create<LogStore>(() => ({}));

export default useLogStore;
