"use client";

import Image from "next/image";
import { KBO_TEAMS } from "@/utils/constants/kbo";
import useAppStore from "@/store/useAppStore";
import type { TeamId } from "@/types/game-log";

interface TeamSelectorProps {
  value?: TeamId | null;
  onChange?: (teamId: TeamId | null) => void;
}

export default function TeamSelector({ value, onChange }: TeamSelectorProps) {
  const storeTeamId = useAppStore((s) => s.supportingTeamId);
  const setSupportingTeam = useAppStore((s) => s.setSupportingTeam);

  const selectedId = value !== undefined ? value : storeTeamId;

  const handleSelect = (teamId: TeamId) => {
    const next = selectedId === teamId ? null : teamId;
    if (onChange) {
      onChange(next);
    } else {
      setSupportingTeam(next);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {KBO_TEAMS.map((team) => {
        const selected = selectedId === team.id;
        return (
          <button
            key={team.id}
            onClick={() => handleSelect(team.id)}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 active:scale-95"
            style={{
              background: selected ? team.primary : "#F9FAFB",
              border: `2px solid ${selected ? team.primary : "#E5E7EB"}`,
              boxShadow: selected ? `0 4px 12px ${team.primary}40` : "none",
            }}
          >
            <div className="w-8 h-8 relative">
              <Image
                src={team.logo}
                alt={team.name}
                fill
                className="object-contain"
              />
            </div>
            <span
              className="text-[10px] font-bold leading-tight text-center"
              style={{ color: selected ? "#fff" : "#6B7280" }}
            >
              {team.shortName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
