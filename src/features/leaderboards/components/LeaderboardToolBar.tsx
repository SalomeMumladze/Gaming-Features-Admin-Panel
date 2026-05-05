import { useState } from "react";
import { Button, Box, Badge, Popover, Card, TextField } from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { LEADERBOARD_STATUSES } from "../constants";
import { ScoringTypeSelector } from "./ScoringTypeSelector";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useUpdateLeaderboardStatus } from "../hooks/useLeaderboard";
import { useNotification } from "@/shared/providers/useNotification";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";

const LeaderboardToolBar = () => {
  const { setUrlParams } = useQueryParams();
  const { mutateAsync } = useUpdateLeaderboardStatus();
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const { filters, setFilter, clearFilters, selectedIds, setSelectedIds } =
    useServerTable();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const hasFilters = Object.keys(filters || {}).length > 0;

  const handleBulkChange = async (status: "draft" | "active") => {
    try {
      await Promise.all(
        selectedIds.map((id: string) => mutateAsync({ id, status })),
      );

      notify("Status updated successfully", "success");
      setSelectedIds([]);

      queryClient.invalidateQueries({ queryKey: ["leaderboards"] });
    } catch (e) {
      notify("Failed to update status", "error");
    }
  };

  return (
    <div className="bg-white/10 p-2 flex gap-2 items-center">
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setUrlParams({ createLeaderboard: "true" })}
      >
        Create
      </Button>

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
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 320,
          }}
        >
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

      {selectedIds.length > 0 && (
        <Box
          height="36px"
          display="flex"
          alignItems="center"
          borderRadius={1}
          gap={2}
          px={2}
        >
          <Box fontWeight={500}>{selectedIds.length} selected</Box>

          <Button
            variant="outlined"
            className="!font-medium"
            color="success"
            size="small"
            onClick={() => handleBulkChange("active")}
          >
            Set Active
          </Button>

          <Button
            variant="outlined"
            size="small"
            color="warning"
            onClick={() => handleBulkChange("draft")}
          >
            Set Draft
          </Button>

          <Button
            size="small"
            variant="text"
            onClick={() => setSelectedIds([])}
          >
            Clear
          </Button>
        </Box>
      )}
    </div>
  );
};

export default LeaderboardToolBar;
