import type { StadiumId, TeamId, CompanionType } from "@/types/game-log";

export const KBO_TEAMS: { id: TeamId; name: string; shortName: string; color: string; primary: string; secondary: string; logo: string }[] = [
  { id: "LG", name: "LG 트윈스", shortName: "LG", color: "#C30452", primary: "#C30452", secondary: "#000000", logo: "/images/teams/lgtwins.svg" },
  { id: "KT", name: "KT 위즈", shortName: "KT", color: "#000000", primary: "#000000", secondary: "#E31837", logo: "/images/teams/ktWiz.svg" },
  { id: "SSG", name: "SSG 랜더스", shortName: "SSG", color: "#CE0E2D", primary: "#CE0E2D", secondary: "#FFB81C", logo: "/images/teams/ssgLaders.svg" },
  { id: "NC", name: "NC 다이노스", shortName: "NC", color: "#071D5E", primary: "#071D5E", secondary: "#BCA26A", logo: "/images/teams/ncDinos.svg" },
  { id: "Doosan", name: "두산 베어스", shortName: "두산", color: "#131230", primary: "#131230", secondary: "#D50032", logo: "/images/teams/doosanBears.svg" },
  { id: "KIA", name: "KIA 타이거즈", shortName: "KIA", color: "#EA0029", primary: "#EA0029", secondary: "#000000", logo: "/images/teams/kiaTigers.svg" },
  { id: "Lotte", name: "롯데 자이언츠", shortName: "롯데", color: "#041E42", primary: "#041E42", secondary: "#BF2136", logo: "/images/teams/lotteGiants.svg" },
  { id: "Samsung", name: "삼성 라이온즈", shortName: "삼성", color: "#1144BB", primary: "#1144BB", secondary: "#C0C0C0", logo: "/images/teams/samsungLions.svg" },
  { id: "Hanwha", name: "한화 이글스", shortName: "한화", color: "#FF6600", primary: "#FF6600", secondary: "#1E1E1E", logo: "/images/teams/hanwhaEagles.svg" },
  { id: "Kiwoom", name: "키움 히어로즈", shortName: "키움", color: "#820024", primary: "#820024", secondary: "#FFB300", logo: "/images/teams/kiwoom.svg" },
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
