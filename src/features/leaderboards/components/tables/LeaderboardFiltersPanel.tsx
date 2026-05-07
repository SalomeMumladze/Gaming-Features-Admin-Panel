import { useState } from "react";
import { Button, Badge, Popover, Card, TextField } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { LEADERBOARD_STATUSES } from "@/features/leaderboards/constants";
import { ScoringTypeSelector } from "../ScoringTypeSelector";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export const LeaderboardFiltersPanel = () => {
  const { filters, setFilter, clearFilters } = useServerTable();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const hasFilters = Object.entries(filters || {}).some(
    ([key, value]) =>
      key !== "title" && value !== null && value !== undefined && value !== "",
  );

  return (
    <>
      <Badge color="error" variant="dot" invisible={!hasFilters}>
        <Button
          startIcon={<FilterList />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Filter
        </Button>
      </Badge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <StatusesSelector
            value={filters?.status ?? null}
            allowNull
            statuses={[...LEADERBOARD_STATUSES]}
            onChange={(v) => setFilter("status", v)}
          />

          <ScoringTypeSelector
            allowNull
            value={filters?.scoringType ?? null}
            onChange={(v) => setFilter("scoringType", v)}
          />

          <TextField
            label="Max Participants"
            type="number"
            value={filters?.maxParticipants ?? ""}
            onChange={(e) =>
              setFilter(
                "maxParticipants",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />

          <DatePicker
            label="Start Date"
            value={filters?.startDate ? dayjs(filters.startDate) : null}
            onChange={(d) =>
              setFilter("startDate", d ? d.format("YYYY-MM-DD") : null)
            }
          />

          <DatePicker
            label="End Date"
            value={filters?.endDate ? dayjs(filters.endDate) : null}
            onChange={(d) =>
              setFilter("endDate", d ? d.format("YYYY-MM-DD") : null)
            }
          />

          <Button color="error" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Card>
      </Popover>
    </>
  );
};
