import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Providers from "./providers";
import { unsealData } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "@/lib/session";
import type { IUser } from "@/types/model";

export const metadata: Metadata = {
  title: "BallLog",
  description: "나의 야구 직관 기록",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialUser: IUser | null = null;
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ball-log-session");
    if (sessionCookie?.value) {
      const data = await unsealData<SessionData>(sessionCookie.value, {
        password: process.env.SESSION_SECRET!,
      });
      initialUser = (data as SessionData).user ?? null;
    }
  } catch {
    // 세션 복호화 실패 시 비로그인 상태로 렌더링
  }

  return (
    <html lang="ko">
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <Providers initialUser={initialUser}>{children}</Providers>
      </body>
    </html>
  );
}
