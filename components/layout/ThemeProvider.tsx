"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { KBO_TEAMS } from "@/utils/constants/kbo";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/** primary 색상을 흰색과 alpha 비율로 혼합한 RGB 문자열 반환 */
function blendWithWhite(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  const nr = Math.round(r * alpha + 255 * (1 - alpha));
  const ng = Math.round(g * alpha + 255 * (1 - alpha));
  const nb = Math.round(b * alpha + 255 * (1 - alpha));
  return `rgb(${nr}, ${ng}, ${nb})`;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supportingTeamId = useAuthStore(
    (state) => state.user?.supportingTeamId,
  );

  useEffect(() => {
    const team = KBO_TEAMS.find((t) => t.id === supportingTeamId);
    const primary = team?.primary ?? "#6366F1";
    const secondary = team?.secondary ?? "#818CF8";

    // 팀 원색을 흰색과 약간 혼합해 파스텔 느낌의 primary 색상으로 설정 (80% 원색, 20% 흰색)
    const softenedPrimary = blendWithWhite(primary, 0.80);
    document.documentElement.style.setProperty("--theme-primary", softenedPrimary);
    document.documentElement.style.setProperty("--theme-secondary", secondary);
    // 팀 미선택 시 배경은 흰색, 선택 시 primary 혼합 계열
    const bgCard = team ? blendWithWhite(primary, 0.07) : "rgb(249, 250, 251)";
    document.documentElement.style.setProperty("--theme-bg-card", bgCard);
    document.documentElement.style.setProperty(
      "--theme-primary-light",
      blendWithWhite(primary, 0.12),
    );
    document.documentElement.style.setProperty(
      "--theme-primary-muted",
      blendWithWhite(primary, 0.25),
    );
  }, [supportingTeamId]);

  return <>{children}</>;
}
