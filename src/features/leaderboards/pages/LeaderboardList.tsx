import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { Help } from "@mui/icons-material";

const statuses = ["draft", "active", "completed"] as const;

export const LeaderboardList: React.FC = () => {
  const { list, update } = useLeaderboard();
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (list.isLoading) return <div>Loading...</div>;
  if (list.isError) return <div>Error loading leaderboards</div>;

  const filteredData = filterStatus
    ? (list.data ?? []).filter((row) => row.status === filterStatus)
    : (list.data ?? []);

  const handleBulkToggle = (newStatus: "active" | "draft") => {
    selectedIds.forEach((id) => {
      const lb = filteredData.find((x) => x.id === id);
      if (lb) update.mutate({ ...lb, status: newStatus });
    });
    setSelectedIds([]);
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<string>) => (
        <div className="flex items-center gap-2">
          <span>{params.value}</span>
          {params.row.description && (
            <Tooltip
              title={params.row.description ?? ""}
              className="cursor-pointer"
            >
              <Help fontSize="small" />
            </Tooltip>
          )}
        </div>
      ),
    },
    { field: "status", headerName: "Status", minWidth: 120 },
    { field: "scoringType", headerName: "Scoring Type ", minWidth: 150 },
    { field: "maxParticipants", headerName: "Max Participants", minWidth: 150 },
    { field: "startDate", headerName: "Start Date", minWidth: 150 },
    { field: "endDate", headerName: "End Date", minWidth: 150 },
  ];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            label="Status Filter"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedIds.length > 0 && (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => handleBulkToggle("active")}
            >
              Set Active
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => handleBulkToggle("draft")}
            >
              Set Draft
            </Button>
          </Box>
        )}
      </Box>

      <div style={{ maxHeight: 1000, width: "100%" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          checkboxSelection
          disableSelectionOnClick
          selectionModel={selectedIds.filter((id) =>
            filteredData.some((row) => row.id === id),
          )}
          onSelectionModelChange={(ids) => setSelectedIds(ids as string[])}
        />
      </div>
    </Box>
  );
};
