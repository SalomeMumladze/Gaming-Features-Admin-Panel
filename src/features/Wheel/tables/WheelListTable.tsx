import React from "react";
import { ROUTE_PATHS } from "@/app/router/paths";
import { getWheelColumns } from "./WheelColumns";
import { ServerTableProvider } from "@/shared/components/tables/ServerTableProvider";
import { wheelApi } from "../api/wheel.api";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useNavigate } from "react-router-dom";
import { useDeleteWheel } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/providers/useNotification";
import WheelToolbar from "./WheelToolbar";
import { WheelFiltersPanel } from "./WheelFilter";

export const WheelListTable: React.FC = () => {
  const { notify } = useNotification();
  const { setUrlParams } = useQueryParams();
  const navigate = useNavigate();
  const deleteWheel = useDeleteWheel();

  const columns = getWheelColumns({
    onEdit: (id: string) => {
      setUrlParams({ raffleId: id });
    },
    onView: (id: string) => {
      navigate(ROUTE_PATHS.raffleDetails(id));
    },
    onDelete: (id: string) => {
      deleteWheel.mutate(id, {
        onSuccess: () => notify("Deleted successfully", "success"),
        onError: () => notify("Delete failed", "error"),
      });
    },
  });

  return (
    <ServerTableProvider
      searchKey="name"
      searchLabel="Search by name"
      tableName="wheel"
      api={wheelApi.getList}
      header={WheelToolbar}
      filterComponent={WheelFiltersPanel}
      columns={columns}
    />
  );
};
