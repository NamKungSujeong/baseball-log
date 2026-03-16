import { Metadata } from "next";
import LogForm from "@/components/logs/LogForm";

export const metadata: Metadata = { title: "직관 기록하기 | 직관로그" };

export default function NewLogPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">직관 기록하기</h1>
      <LogForm />
    </div>
  );
}
