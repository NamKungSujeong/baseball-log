import LogForm from "@/features/logs/components/LogForm";
import { PenLine } from "lucide-react";

export default function NewLogPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <PenLine size={20} style={{ color: "var(--theme-primary)" }} />
        <h1 className="text-xl font-black text-gray-900">직관 기록하기</h1>
      </div>
      <LogForm />
    </div>
  );
}
