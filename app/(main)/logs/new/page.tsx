import { Metadata } from "next";
import NewLogPage from "@/features/logs/pages/NewLogPage";

export const metadata: Metadata = { title: "직관 기록하기 | 직관로그" };

interface Props {
  searchParams: Promise<{ date?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { date } = await searchParams;
  return <NewLogPage initialDate={date} />;
}
