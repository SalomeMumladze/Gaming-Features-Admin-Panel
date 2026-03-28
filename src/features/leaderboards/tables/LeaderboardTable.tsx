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
import { Help, Add } from "@mui/icons-material";
import {
  DateFormatter,
  StatusFormatter,
  ScoringTypeFormatter,
  TableActionsFormatter,
} from "@/shared/formatters";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { useNotification } from "@/shared/hooks/useNotification";
import { useNavigate } from "react-router-dom";

const statuses = ["draft", "active", "completed"] as const;

export const LeaderboardTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { setUrlParams } = useQueryParams();
  const { deleteLeaderboard } = useLeaderboard();
  const { list } = useLeaderboard({
    _page: paginationModel.page + 1,
    _per_page: paginationModel.pageSize,
    status: filterStatus || undefined,
    // Optional: Sorting can also be done by sending these params to the backend
    // _sort: "title", // field to sort by
    // _order: "asc",  // "asc" or "desc"
  });

  const handleBulkToggle = () => {
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
              disableInteractive
              title={params.row.description ?? ""}
              className="cursor-pointer"
            >
              <Help fontSize="small" color="info" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: (params) => <StatusFormatter value={params.value} />,
    },
    {
      field: "scoringType",
      headerName: "Scoring Type ",
      minWidth: 150,
      renderCell: (params) => <ScoringTypeFormatter value={params.value} />,
    },
    {
      field: "maxParticipants",
      headerName: "Max Participants",
      minWidth: 150,
      type: "number",
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 150,
      renderCell: (params) => <DateFormatter value={params.value} />,
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 150,
      renderCell: (params) => <DateFormatter value={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <TableActionsFormatter
          id={params.row.id}
          editTooltip="Edit leaderboard"
          infoTooltip="View leaderboard info"
          deleteTooltip="Delete leaderboard"
          confirmText="Do you really want to delete this leaderboard?"
          onEditClick={() =>
            setUrlParams({
              leaderboardId: params.row.id,
            })
          }
          onInfoClick={() => navigate(`/leaderboards/${params.row.id}`)}
          onDeleteClick={(id) =>
            deleteLeaderboard.mutate(id, {
              onSuccess: () =>
                notify(`${params.row.title} deleted successfully`, "success"),
              onError: () => notify("Failed to delete leaderboard!", "error"),
            })
          }
        />
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<Add />}
          className="!capitalize !h-10"
          onClick={() =>
            setUrlParams({
              createLeaderboard: true,
            })
          }
        >
          Create Leaderboard
        </Button>
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

      <div style={{ maxHeight: 630, width: "100%" }}>
        <DataGrid
          rows={list.items ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{
            noRowsOverlay: () => {
              if (list.isError) {
                return (
                  <Box p={2} textAlign="center" color="error.main">
                    Failed to load data
                  </Box>
                );
              }
              return (
                <Box p={2} textAlign="center">
                  No Data Found
                </Box>
              );
            },
          }}
          rowCount={list.totalRows}
          disableRowSelectionOnClick
          disableColumnMenu
          paginationMode="server"
          pageSizeOptions={[10, 25, 50, 100, 300]}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          checkboxSelection
          loading={list.isLoading}
          disableSelectionOnClick
          onSelectionModelChange={(ids) => setSelectedIds(ids as string[])}
        />
      </div>
    </Box>
  );
};
