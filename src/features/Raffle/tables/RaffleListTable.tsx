import React from "react";
import { useDeleteRaffle } from "../hooks/useRaffleManagement";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useNotification } from "@/shared/providers/useNotification";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/paths";
import { getRafflceColumns } from "./RaffleColumns";
import { raffleApi } from "../api/raffle.api";
import { ServerTableProvider } from "@/shared/components/tables/ServerTableProvider";
import RaffleToolbar from "./RaffleToolbar";
import { RaffleFiltersPanel } from "./RaffleFiltersPanel";

export const RaffleListTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const { setUrlParams } = useQueryParams();

  const deleteRaffle = useDeleteRaffle();

  const columns = getRafflceColumns({
    onEdit: (id: string) => {
      setUrlParams({ raffleId: id });
    },
    onView: (id: string) => {
      navigate(ROUTE_PATHS.raffleDetails(id));
    },
    onDelete: (id: string) => {
      deleteRaffle.mutate(id, {
        onSuccess: () => notify("Deleted successfully", "success"),
        onError: () => notify("Delete failed", "error"),
      });
    },
  });

  return (
    <ServerTableProvider
      searchKey="name"
      searchLabel="Search by name"
      tableName="raffle"
      api={raffleApi.getList}
      header={RaffleToolbar}
      filterComponent={RaffleFiltersPanel}
      columns={columns}
    />
  );
};
