import React from "react";
import { useDeleteLeaderboard } from "@/features/leaderboards/hooks/useLeaderboard";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useNotification } from "@/shared/providers/useNotification";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/paths";
import { leaderboardApi } from "@/features/leaderboards/api/leaderboard.api";
import { ServerTableProvider } from "@/shared/components/tables/ServerTableProvider";
import LeaderboardToolBar from "./LeaderboardToolBar";
import { getLeaderboardColumns } from "./LeaderboardColumns";

export const LeaderboardTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const { setUrlParams } = useQueryParams();
  const deleteLeaderboard = useDeleteLeaderboard();

  const columns = getLeaderboardColumns({
    onEdit: (id: string) => {
      setUrlParams({ leaderboardId: id });
    },
    onView: (id: string) => {
      navigate(ROUTE_PATHS.leaderboardDetails(id));
    },
    onDelete: (id: string) => {
      deleteLeaderboard.mutate(id, {
        onSuccess: () => notify("Deleted successfully", "success"),
        onError: () => notify("Delete failed", "error"),
      });
    },
  });

  return (
    <ServerTableProvider
      api={leaderboardApi.getList}
      header={LeaderboardToolBar}
      columns={columns}
    />
  );
};
