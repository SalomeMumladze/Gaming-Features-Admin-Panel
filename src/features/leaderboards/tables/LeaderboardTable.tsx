import React, { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import {
  useDeleteLeaderboard,
  useLeaderboards,
  useUpdateLeaderboardStatus,
} from "../hooks/useLeaderboard";
import {
  DateFormatter,
  StatusFormatter,
  TableActionsFormatter,
  NumberFormatter,
} from "@/shared/formatters";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useNotification } from "@/shared/providers/useNotification";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/paths";
import { ServerDataTable } from "@/shared/components/ServerDataTable";
import type { LeaderboardStatus } from "@/features/leaderboards/types/leaderboard.types";
import { TableCellWithTooltip } from "@/shared/components/InfoTooltipLabel";
import { ScoringTypeFormatter } from "@/features/leaderboards/components/ScoringTypeFormatter";
import { useQueryClient } from "@tanstack/react-query";
import LeaderboardToolBar from "../components/LeaderboardToolBar";

export const LeaderboardTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const { mutateAsync } = useUpdateLeaderboardStatus();
  const queryClient = useQueryClient();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterStatus, setFilterStatus] = useState<LeaderboardStatus | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { setUrlParams } = useQueryParams();
  const deleteLeaderboard = useDeleteLeaderboard();

  const { data, isPending, isError } = useLeaderboards({
    _page: paginationModel.page + 1,
    _per_page: paginationModel.pageSize,
    ...(filterStatus ? { status: filterStatus } : {}),
  });

  const handleBulkChange = async (status: "draft" | "active") => {
    try {
      await Promise.all(selectedIds.map((id) => mutateAsync({ id, status })));

      notify("Status updated successfully", "success");
      setSelectedIds([]);

      queryClient.invalidateQueries({ queryKey: ["leaderboards"] });
    } catch (e) {
      notify("Failed to update status", "error");
    }
  };
  
  const onRowSelectionModelChange = (ids: Array<string | number>) => {
    setSelectedIds(ids.map(String));
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      pinnable: true,
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
      minWidth: 200,
      renderCell: (params) => <StatusFormatter status={params.value} />,
    },
    {
      field: "scoringType",
      headerName: "Scoring Type ",
      minWidth: 200,
      renderCell: (params) => <ScoringTypeFormatter value={params.value} />,
    },
    {
      field: "maxParticipants",
      headerName: "Max Participants",
      minWidth: 200,
      renderCell: (params) => <NumberFormatter value={params.value} />,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 200,
      renderCell: (params) => <DateFormatter value={params.value} />,
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 200,
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
    <ServerDataTable
      header={LeaderboardToolBar}
      headerProps={{
        filterStatus,
        setFilterStatus,
        selectedIds,
        setSelectedIds,
        handleBulkChange,
      }}
      onSelectionModelChange={onRowSelectionModelChange}
      rows={data?.data ?? []}
      columns={columns}
      rowCount={data?.items ?? 0}
      loading={isPending}
      isError={isError}
      paginationModel={paginationModel}
      setPaginationModel={setPaginationModel}
      getRowId={(row) => row.id}
      checkboxSelection
    />
  );
};
