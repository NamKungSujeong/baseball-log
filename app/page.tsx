"use client";

import Link from "next/link";
import useLogStore from "@/store/useLogStore";
import LogCard from "@/components/logs/LogCard";

export default function HomePage() {
  const logs = useLogStore((s) => s.logs);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">직관로그 ⚾</h1>
          <p className="text-sm text-gray-400 mt-0.5">총 {logs.length}번의 직관</p>
        </div>
        <Link
          href="/logs/new"
          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm active:bg-blue-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>

      {/* 목록 */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">⚾</span>
          <p className="text-gray-500 font-medium">아직 기록된 직관이 없어요</p>
          <p className="text-gray-400 text-sm mt-1">첫 번째 직관을 기록해보세요!</p>
          <Link
            href="/logs/new"
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium"
          >
            직관 기록하기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
