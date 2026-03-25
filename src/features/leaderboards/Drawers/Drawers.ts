import React from "react";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { LeaderboardEditDrawer } from "./LeaderboardEditDrawer";

const drawers = [LeaderboardEditDrawer];

const Drawers: React.FC = () => {
  const params = useQueryParams();

  return drawers.map((DrawerComponent, ind) => {
    const open = shouldRenderDrawer(DrawerComponent, params.searchParams);
    if (!open) return null;

    const props = {
      searchParams: params.searchParams,
      destroyOnClose: true,
      afterOpenChange: (isOpen: boolean) => {
        if (!isOpen) {
          params.removeParams([
            ...Object.keys(DrawerComponent.requiredParams ?? {}),
            ...(DrawerComponent.closeParams ?? []),
          ]);
        }
      },
    };

    return React.createElement(DrawerComponent, { key: ind, ...props });
  });
};

const shouldRenderDrawer = (
  drawer: any,
  searchParams: Record<string, string>,
) => {
  if (!drawer.requiredParams || Object.keys(drawer.requiredParams).length === 0)
    return false;
  if (Object.keys(searchParams).length === 0) return false;

  return Object.entries(drawer.requiredParams).every(([param, check]) => {
    if (typeof check !== "function") {
      return Boolean(searchParams[param]);
    } else {
      return check(searchParams[param]);
    }
  });
};

export default Drawers;
