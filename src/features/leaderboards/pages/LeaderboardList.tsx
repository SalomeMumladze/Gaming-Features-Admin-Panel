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
  IconButton,
} from "@mui/material";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useNavigate } from "react-router-dom";
import { Edit, Help, Info, Add } from "@mui/icons-material";
import {
  DateFormatter,
  StatusFormatter,
  ScoringTypeFormatter,
  NumberFormatter,
} from "@/shared/formatters";
import useQueryParams from "@/shared/hooks/useQueryParams";
import Drawers from "../Drawers/Drawers";

const statuses = ["draft", "active", "completed"] as const;

export const LeaderboardList: React.FC = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { setUrlParams } = useQueryParams();

  const { list } = useLeaderboard({
    _page: paginationModel.page,
    _per_page: paginationModel.pageSize,
    status: filterStatus || undefined,
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
      renderCell: (params) => <NumberFormatter value={params.value} />,
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
      width: 80,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        const navigate = useNavigate();

        return (
          <div className="flex gap-1 h-full ">
            <Tooltip title="Edit Leaderboard">
              <IconButton
                color="primary"
                size="small"
                className="h-fit !m-auto"
                onClick={() => setUrlParams({ leaderboardId: params.row.id })}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="View Leaderboard Info">
              <IconButton
                color="info"
                size="small"
                className="h-fit !m-auto"
                onClick={() => navigate(`/leaderboard/${params.row.id}`)}
              >
                <Info fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
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
          rows={list.data?.items ?? []}
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
          rowCount={list.data?.totalRows}
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
      <Drawers />
    </Box>
  );
};
