import React from "react";
import { useParams } from "react-router-dom";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { alpha, useTheme } from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  CalendarMonth as CalIcon,
  People as PeopleIcon,
  Speed as ScoringIcon,
  Edit as EditIcon,
  Description as DescIcon,
  DateRange as DateRangeIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import { Section } from "./Section";
import { Field } from "./Field";
import { RankBadge, DateFormatter } from "@/shared/formatters";
import { STATUS_CONFIG, TYPE_CONFIG } from "../components/PrizeFields/Config";

const ACCENTS = {
  blue: { light: "#3b6ef0", dark: "#4f8eff" },
  violet: { light: "#7c3aed", dark: "#8b5cf6" },
  emerald: { light: "#059669", dark: "#10b981" },
  amber: { light: "#d97706", dark: "#f59e0b" },
};

const RANK_META = [
  { base: "#f59e0b", label: "1ST" },
  { base: "#94a3b8", label: "2ND" },
  { base: "#c2763e", label: "3RD" },
];

const SCORING_LABELS: Record<string, string> = {
  points: "Points",
  wins: "Wins",
  wagered: "Wagered",
};

export const LeaderboardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getById } = useLeaderboard();
  const safeId = id ?? "0";
  const { data } = getById(safeId);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!data) return <div className="py-20 text-center">Loading...</div>;

  const amberColor = isDark ? ACCENTS.amber.dark : ACCENTS.amber.light;
  const blueColor = isDark ? ACCENTS.blue.dark : ACCENTS.blue.light;
  const statusCfg = STATUS_CONFIG[data.status];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: alpha(amberColor, isDark ? 0.12 : 0.1),
              border: `1px solid ${alpha(amberColor, isDark ? 0.3 : 0.22)}`,
            }}
          >
            <TrophyIcon sx={{ color: amberColor, fontSize: 22 }} />
          </div>
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-gray-100">
              {data.title || "Untitled Leaderboard"}
            </h2>
            <span
              className="inline-block text-xs font-bold px-2 py-0.5 rounded mt-1"
              style={{
                backgroundColor: alpha(statusCfg.color, isDark ? 0.12 : 0.09),
                color: statusCfg.color,
                border: `1px solid ${alpha(statusCfg.color, 0.25)}`,
              }}
            >
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>

      {data.description && (
        <Section
          icon={<DescIcon fontSize="small" />}
          title="Description"
          accent={ACCENTS.blue}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.description}
          </p>
        </Section>
      )}

      {/* Schedule */}
      <Section
        icon={<DateRangeIcon fontSize="small" />}
        title="Schedule"
        accent={ACCENTS.violet}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Field
            label="Start Date"
            value={<DateFormatter value={data.startDate} />}
            icon={<CalIcon />}
            accent={isDark ? ACCENTS.violet.dark : ACCENTS.violet.light}
          />
          <Field
            label="End Date"
            value={<DateFormatter value={data.endDate} />}
            icon={<CalIcon />}
            accent={isDark ? ACCENTS.violet.dark : ACCENTS.violet.light}
          />
          <Field
            label="Update Date"
            value={<DateFormatter value={data.updatedAt} />}
            icon={<CalIcon />}
            accent={isDark ? ACCENTS.violet.dark : ACCENTS.violet.light}
          />
        </div>
      </Section>

      {/* Configuration */}
      <Section
        icon={<TuneIcon fontSize="small" />}
        title="Configuration"
        accent={ACCENTS.emerald}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Field
            label="Status"
            value={
              <span style={{ color: statusCfg.color }}>{statusCfg.label}</span>
            }
            accent={statusCfg.color}
          />
          <Field
            label="Scoring Type"
            value={SCORING_LABELS[data.scoringType] ?? data.scoringType}
            icon={<ScoringIcon />}
            accent={isDark ? ACCENTS.emerald.dark : ACCENTS.emerald.light}
          />
          <Field
            label="Max Participants"
            value={data.maxParticipants?.toLocaleString() ?? "—"}
            icon={<PeopleIcon />}
            accent={isDark ? ACCENTS.emerald.dark : ACCENTS.emerald.light}
          />
        </div>
      </Section>

      {/* Prize Structure */}
      <Section
        icon={<TrophyIcon fontSize="small" />}
        title="Prize Structure"
        accent={ACCENTS.amber}
      >
        {!data.prizes?.length ? (
          <div className="text-gray-400 text-sm">No prizes configured.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {data.prizes.map((prize, index) => {
              const rankMeta = RANK_META[index] ?? {
                base: blueColor,
                label: `#${index + 1}`,
              };
              const typeCfg = TYPE_CONFIG[prize.type];

              return (
                <div
                  key={prize.id ?? index}
                  className="flex items-center gap-2 p-3 rounded-xl transition-all border"
                  style={{
                    borderColor: alpha(rankMeta.base, isDark ? 0.18 : 0.14),
                    backgroundColor: isDark
                      ? alpha("#0d1629", 0.5)
                      : alpha(rankMeta.base, 0.03),
                  }}
                >
                  <RankBadge rank={prize} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">
                      {prize.name || `Prize #${index + 1}`}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: alpha(typeCfg.hue, isDark ? 0.12 : 0.09),
                      color: typeCfg.hue,
                      border: `1px solid ${alpha(typeCfg.hue, 0.25)}`,
                    }}
                  >
                    {typeCfg.label}
                  </span>
                  <div className="ml-auto text-right min-w-[64px]">
                    <p
                      className="font-extrabold text-lg"
                      style={{ color: rankMeta.base }}
                    >
                      {prize.amount?.toLocaleString()}
                    </p>
                    <p className="text-[0.68rem] text-gray-500">
                      {typeCfg.label.toLowerCase()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
};
