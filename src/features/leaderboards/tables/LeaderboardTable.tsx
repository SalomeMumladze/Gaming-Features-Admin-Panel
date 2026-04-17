import React, { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import { useDeleteLeaderboard, useLeaderboards } from "../hooks/useLeaderboard";
import { Add } from "@mui/icons-material";
import {
  DateFormatter,
  StatusFormatter,
  TableActionsFormatter,
} from "@/shared/formatters";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useNotification } from "@/shared/providers/useNotification";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/paths";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { LEADERBOARD_STATUSES } from "../constants";
import { ServerDataTable } from "@/shared/components/ServerDataTable";
import type { LeaderboardStatus } from "../types/leaderboard.types";
import { TableCellWithTooltip } from "@/shared/components/InfoTooltipLabel";
import { ScoringTypeFormatter } from "../components/ScoringTypeFormatter";

export const LeaderboardTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [filterStatus, setFilterStatus] = useState<LeaderboardStatus | "">("");
  const { setUrlParams } = useQueryParams();
  const deleteLeaderboard = useDeleteLeaderboard();
  const { data, isPending, isError } = useLeaderboards({
    _page: paginationModel.page + 1,
    _per_page: paginationModel.pageSize,
    ...(filterStatus ? { status: filterStatus } : {}),
  });

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <TableCellWithTooltip
          value={params.value}
          description={params.row.description}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: (params) => <StatusFormatter status={params.value} />,
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
          onInfoClick={() =>
            navigate(ROUTE_PATHS.leaderboardDetails(params.row.id))
          }
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
      <Box display="flex " gap={2} mb={2} flexWrap="wrap" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<Add />}
          size="large"
          className="!capitalize w-fit h-14"
          onClick={() =>
            setUrlParams({
              createLeaderboard: true,
            })
          }
        >
          Create Leaderboard
        </Button>

        <StatusesSelector
          value={filterStatus}
          className="w-44"
          label="Status Filter"
          allowNull
          statuses={LEADERBOARD_STATUSES}
          onChange={(value) => setFilterStatus(value)}
        />
      </Box>

      <ServerDataTable
        rows={(!isPending && data.data) ?? []}
        columns={columns}
        rowCount={!isPending && data.items}
        loading={isPending}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        getRowId={(row) => row.id}
        checkboxSelection
        noRowsOverlay={
          isError ? (
            <Box color="error.main">Failed to load data</Box>
          ) : undefined
        }
      />
    </Box>
  );
};
