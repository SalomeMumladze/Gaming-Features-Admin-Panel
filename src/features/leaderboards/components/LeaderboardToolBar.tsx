import React from "react";
import { Button, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import useQueryParams from "@/shared/providers/useQueryParams";
import type { LeaderboardStatus } from "@/features/leaderboards/types/leaderboard.types";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { LEADERBOARD_STATUSES } from "../constants";

type Props = {
  filterStatus: LeaderboardStatus | null;
  setFilterStatus: (v: LeaderboardStatus | null) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  handleBulkChange: (status: "draft" | "active") => void;
};

const LeaderboardToolBar: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  selectedIds,
  setSelectedIds,
  handleBulkChange,
}) => {
  const { setUrlParams } = useQueryParams();

  return (
    <div className="bg-white rounded-md p-2 h-18 mb-2 flex items-center gap-2 shadow-sm">
      <Button
        variant="contained"
        startIcon={<Add />}
        className="!capitalize w-fit"
        onClick={() =>
          setUrlParams({
            createLeaderboard: "true",
          })
        }
      >
        Create Leaderboard
      </Button>

      <StatusesSelector
        value={filterStatus}
        className="w-44 h-9"
        label="Status Filter"
        allowNull
        statuses={[...LEADERBOARD_STATUSES]}
        onChange={(value) => setFilterStatus(value as LeaderboardStatus | null)}
      />

      {selectedIds.length > 0 && (
        <Box
          height="36px"
          display="flex"
          alignItems="center"
          bgcolor="grey.100"
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
