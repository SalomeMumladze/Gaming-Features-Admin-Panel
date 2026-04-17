import React from "react";
import { useParams } from "react-router-dom";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import { Typography, useTheme } from "@mui/material";
import {
  Casino as WheelIcon,
  Paid as CreditIcon,
  PersonPin as UserIcon,
  EmojiEvents as PrizeIcon,
  DonutLarge as SegmentIcon,
} from "@mui/icons-material";
import { DetailSection } from "@/shared/components/DetailSection";
import { DetailField } from "@/shared/components/DetailField";
import { StatusFormatter } from "@/shared/formatters";
import { RouletteWheel } from "../components/RouletteWheel";

const ACCENTS = {
  blue: { light: "#3b6ef0", dark: "#4f8eff" },
  violet: { light: "#7c3aed", dark: "#8b5cf6" },
  amber: { light: "#d97706", dark: "#f59e0b" },
};

export const WheelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getWheel } = useWheelsManagement();
  const { data, isLoading } = getWheel(id ?? "0");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (isLoading || !data)
    return <div className="py-20 text-center">Loading...</div>;

  const blue = isDark ? ACCENTS.blue.dark : ACCENTS.blue.light;
  const amber = isDark ? ACCENTS.amber.dark : ACCENTS.amber.light;
  const total = data.segments.reduce((s: number, g: any) => s + g.weight, 0);

  return (
    <div className="flex flex-col gap-4 p-4 sm:max-w-[900px] mx-auto">
      <div className="flex items-center gap-3 pb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${amber}18`,
            border: `1px solid ${amber}38`,
          }}
        >
          <WheelIcon sx={{ color: amber, fontSize: 22 }} />
        </div>
        <div>
          <Typography className="!font-extrabold !text-lg !sm:text-xl">
            {data.name || "Untitled"}
          </Typography>
          <StatusFormatter value={data.status} />
        </div>
      </div>

      {/* Wheel Preview */}
      <DetailSection
        icon={<WheelIcon fontSize="small" />}
        title="Wheel Preview"
        accent={ACCENTS.amber}
      >
        <div className="flex justify-center py-2">
          <RouletteWheel
            segments={data.segments}
            withSpin
            useWeight
            backgroundColor={data.backgroundColor}
            borderColor={data.borderColor}
          />
        </div>
      </DetailSection>

      <DetailSection
        icon={<CreditIcon fontSize="small" />}
        title="General Settings"
        accent={ACCENTS.blue}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <DetailField
            label="Spin Cost"
            value={`${data.spinCost} Credits`}
            icon={<CreditIcon />}
            accent={blue}
          />
          <DetailField
            label="Max Spins / User"
            value={data.maxSpinsPerUser}
            icon={<UserIcon />}
            accent={blue}
          />
        </div>
      </DetailSection>

      <DetailSection
        icon={<SegmentIcon fontSize="small" />}
        title="Wheel Segments"
        accent={ACCENTS.violet}
      >
        <div className="flex flex-col gap-2.5">
          {data.segments.map((seg: any) => (
            <div key={seg.id} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: seg.color,
                  boxShadow: `0 0 5px ${seg.color}88`,
                }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {seg.label}
              </span>
              <div className="w-24 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(seg.weight / total) * 100}%`,
                    backgroundColor: seg.color,
                  }}
                />
              </div>
              <span className="text-xs font-mono text-gray-400 w-10 text-right">
                {((seg.weight / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </DetailSection>

      {data.prizes?.length > 0 && (
        <DetailSection
          icon={<PrizeIcon fontSize="small" />}
          title="Prizes"
          accent={ACCENTS.amber}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {data.prizes.map((prize: any, i: number) => (
              <DetailField
                key={i}
                label={prize.name}
                value={prize.prizeAmount}
                icon={<PrizeIcon />}
                accent={amber}
              />
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  );
};
