import React from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useDeleteLeaderboard } from "../hooks/useLeaderboard";
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
import type { LeaderboardStatus } from "@/features/leaderboards/types/leaderboard.types";
import { TableCellWithTooltip } from "@/shared/components/InfoTooltipLabel";
import { ScoringTypeFormatter } from "@/features/leaderboards/components/ScoringTypeFormatter";
import type { ScoringTypes } from "../components/ScoringTypeSelector";
import { leaderboardApi } from "../api/leaderboard.api";
import { ServerTableProvider } from "@/shared/components/tables/serverTable.context";
import LeaderboardToolBar from "../components/LeaderboardToolBar";

export type LeaderboardFilters = {
  status?: LeaderboardStatus;
  scoringType?: ScoringTypes;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
};

export const LeaderboardTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const { setUrlParams } = useQueryParams();
  const deleteLeaderboard = useDeleteLeaderboard();

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
      minWidth: 200,
      renderCell: (params) => <StatusFormatter status={params.value} />,
    },
    {
      field: "scoringType",
      headerName: "Scoring Type",
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
      renderCell: (params) => (
        <TableActionsFormatter
          id={params.row.id}
          onEditClick={() => setUrlParams({ leaderboardId: params.row.id })}
          onInfoClick={() =>
            navigate(ROUTE_PATHS.leaderboardDetails(params.row.id))
          }
          onDeleteClick={(id) =>
            deleteLeaderboard.mutate(id, {
              onSuccess: () => notify("Deleted successfully", "success"),
              onError: () => notify("Delete failed", "error"),
            })
          }
        />
      ),
    },
  ];

  return (
    <ServerTableProvider<LeaderboardFilters, any>
      api={leaderboardApi.getList}
      header={LeaderboardToolBar}
      columns={columns}
    />
  );
};
