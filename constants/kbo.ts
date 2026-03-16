import type { StadiumId, TeamId, CompanionType } from "@/types/game-log";

export const KBO_TEAMS: { id: TeamId; name: string; color: string }[] = [
  { id: "LG", name: "LG 트윈스", color: "#C30452" },
  { id: "KT", name: "KT 위즈", color: "#000000" },
  { id: "SSG", name: "SSG 랜더스", color: "#CE0E2D" },
  { id: "NC", name: "NC 다이노스", color: "#071D5E" },
  { id: "Doosan", name: "두산 베어스", color: "#131230" },
  { id: "KIA", name: "KIA 타이거즈", color: "#EA0029" },
  { id: "Lotte", name: "롯데 자이언츠", color: "#041E42" },
  { id: "Samsung", name: "삼성 라이온즈", color: "#1144BB" },
  { id: "Hanwha", name: "한화 이글스", color: "#FF6600" },
  { id: "Kiwoom", name: "키움 히어로즈", color: "#820024" },
];

export const KBO_STADIUMS: { id: StadiumId; name: string; homeTeams: TeamId[] }[] = [
  { id: "jamsil", name: "잠실야구장", homeTeams: ["LG", "Doosan"] },
  { id: "gocheok", name: "고척스카이돔", homeTeams: ["Kiwoom"] },
  { id: "suwon", name: "수원KT위즈파크", homeTeams: ["KT"] },
  { id: "incheon", name: "인천SSG랜더스필드", homeTeams: ["SSG"] },
  { id: "changwon", name: "창원NC파크", homeTeams: ["NC"] },
  { id: "gwangju", name: "광주기아챔피언스필드", homeTeams: ["KIA"] },
  { id: "busan", name: "사직야구장", homeTeams: ["Lotte"] },
  { id: "daegu", name: "대구삼성라이온즈파크", homeTeams: ["Samsung"] },
  { id: "daejeon", name: "한화생명이글스파크", homeTeams: ["Hanwha"] },
];

export const COMPANION_LABELS: Record<CompanionType, string> = {
  solo: "혼자",
  friend: "친구",
  family: "가족",
  date: "연인",
  group: "단체/소모임",
};

export const RESULT_LABELS = {
  win: "승",
  lose: "패",
  draw: "무",
} as const;

export function getTeam(id: TeamId) {
  return KBO_TEAMS.find((t) => t.id === id);
}

export function getStadium(id: StadiumId) {
  return KBO_STADIUMS.find((s) => s.id === id);
}
