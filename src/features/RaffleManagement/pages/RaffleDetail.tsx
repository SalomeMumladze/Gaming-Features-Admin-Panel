import React from "react";
import { useParams } from "react-router-dom";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import { alpha, useTheme } from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  CalendarMonth as CalIcon,
  Description as DescIcon,
  ConfirmationNumber as TicketIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import { Section } from "./Section";
import { Field } from "./Field";
import { DateFormatter, StatusFormatter } from "@/shared/formatters";

const ACCENTS = {
  blue: { light: "#3b6ef0", dark: "#4f8eff" },
  violet: { light: "#7c3aed", dark: "#8b5cf6" },
  amber: { light: "#d97706", dark: "#f59e0b" },
};

export const RaffleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getRaffle } = useRaffleManagement();
  const safeId = id ?? "0";
  const { data } = getRaffle(safeId);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!data) return <div className="py-20 text-center">Loading...</div>;

  const amberColor = isDark ? ACCENTS.amber.dark : ACCENTS.amber.light;
  
  return (
    <div className="flex flex-col gap-4 p-4 sm:max-w-[900px] mx-auto">
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
              {data.name || "Untitled"}
            </h2>
            <StatusFormatter value={data.status} />
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
          {data.drawDate && (
            <Field
              label="Draw Date"
              value={<DateFormatter value={data.drawDate} />}
              icon={<CalIcon />}
              accent={isDark ? ACCENTS.violet.dark : ACCENTS.violet.light}
            />
          )}
        </div>
      </Section>
      <Section
        icon={<TicketIcon fontSize="small" />}
        title="Tickets Info"
        accent={ACCENTS.blue}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Field
            label="Max Tickets per User"
            value={data.maxTicketsPerUser ?? "N/A"}
            icon={<TicketIcon />}
            accent={isDark ? ACCENTS.blue.dark : ACCENTS.blue.light}
          />
          <Field
            label="Ticket Price"
            value={data.ticketPrice != null ? `$${data.ticketPrice}` : "N/A"}
            icon={<TicketIcon />}
            accent={isDark ? ACCENTS.blue.dark : ACCENTS.blue.light}
          />
          <Field
            label="Total Ticket Limit"
            value={data.totalTicketLimit ?? "N/A"}
            icon={<TicketIcon />}
            accent={isDark ? ACCENTS.blue.dark : ACCENTS.blue.light}
          />
        </div>
      </Section>

      {data.prizes && data.prizes.length > 0 && (
        <Section
          icon={<TrophyIcon fontSize="small" />}
          title="Prizes"
          accent={ACCENTS.amber}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.prizes.map((prize) => (
              <div
                key={prize.id}
                className="flex items-center gap-3 p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              >
                {/* Prize Image */}
                {prize.imageUrl ? (
                  <img
                    src={prize.imageUrl}
                    alt={prize.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center text-white">
                    ?
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {prize.name || "Untitled Prize"}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {prize.type} - {prize.quantity} pcs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};
