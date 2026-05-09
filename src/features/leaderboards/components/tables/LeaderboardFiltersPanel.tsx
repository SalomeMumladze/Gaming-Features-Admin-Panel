import { useEffect, useState } from "react";
import { Button, Card, TextField } from "@mui/material";
import { FilterList, RefreshOutlined } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { LEADERBOARD_STATUSES } from "@/features/leaderboards/constants";
import { ScoringTypeSelector } from "../ScoringTypeSelector";
import { SavedFilters } from "@/shared/components/tables/components/SavedFilters";

export const LeaderboardFiltersPanel = () => {
  const { filters, setFilter, clearFilters } = useServerTable();
  const [defaultFilters, setDefaultFilters] = useState({
    status: filters?.status ?? null,
    scoringType: filters?.scoringType ?? null,
    maxParticipants: filters?.maxParticipants ?? null,
    startDate: filters?.startDate ?? null,
    endDate: filters?.endDate ?? null,
  });

  useEffect(() => {
    setDefaultFilters(filters);
  }, [filters]);

  const handleFilter = () => {
    setFilter(defaultFilters);
  };

  const handleReset = () => {
    const resetValues = {
      status: null,
      scoringType: null,
      maxParticipants: null,
      startDate: null,
      endDate: null,
    };

    setDefaultFilters(resetValues);
    clearFilters();
  };

  return (
    <Card sx={{ p: 2 }}>
      <div className="grid sm:grid-cols-2 gap-2 mb-2">
        <StatusesSelector
          value={defaultFilters.status}
          allowNull
          statuses={[...LEADERBOARD_STATUSES]}
          onChange={(v) =>
            setDefaultFilters((prev) => ({
              ...prev,
              status: v,
            }))
          }
        />

        <ScoringTypeSelector
          allowNull
          value={defaultFilters.scoringType}
          onChange={(v) =>
            setDefaultFilters((prev) => ({
              ...prev,
              scoringType: v,
            }))
          }
        />

        <TextField
          label="Max Participants"
          type="number"
          value={defaultFilters.maxParticipants || ""}
          onChange={(e) =>
            setDefaultFilters((prev) => ({
              ...prev,
              maxParticipants: e.target.value,
            }))
          }
        />

        <DatePicker
          label="Start Date"
          value={
            defaultFilters.startDate ? dayjs(defaultFilters.startDate) : null
          }
          onChange={(v) =>
            setDefaultFilters((prev) => ({
              ...prev,
              startDate: v ? v.format("YYYY-MM-DD") : null,
            }))
          }
        />

        <DatePicker
          label="End Date"
          value={defaultFilters.endDate ? dayjs(defaultFilters.endDate) : null}
          onChange={(v) =>
            setDefaultFilters((prev) => ({
              ...prev,
              endDate: v ? v.format("YYYY-MM-DD") : null,
            }))
          }
        />
      </div>

      <div className="flex gap-2 items-center w-full justify-between">
        <Button
          color="error"
          variant="outlined"
          size="small"
          onClick={handleReset}
          startIcon={<RefreshOutlined />}
        >
          Reset
        </Button>
        <div className="flex flex-wrap gap-2 w-fit">
          <SavedFilters tableName="leaderboards" filters={filters} />

          <Button
            variant="contained"
            size="small"
            startIcon={<FilterList />}
            onClick={handleFilter}
          >
            Filter
          </Button>
        </div>
      </div>
    </Card>
  );
};
