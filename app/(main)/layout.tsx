import type { Metadata } from "next";

import BottomNav from "@/components/layout/BottomNav";

interface IProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "BallLog",
  description: "나의 야구 직관을 기록해요",
};

export default function MainLayout({ children }: IProps) {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24 min-h-screen">
      {children}
      <BottomNav />
    </div>
  );
}
