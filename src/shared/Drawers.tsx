import React from "react";
import useQueryParams from "@/shared/providers/useQueryParams";
import {
  LeaderboardEditDrawer,
  CreateLeaderboardDrawer,
} from "@/features/leaderboards/drawers";
import {
  RaffleEditDrawer,
  CreateRaffleDrawer,
} from "@/features/Raffle/drawers";
import { CreateWheelDrawer, EditWheelDrawer } from "@/features/Wheel/drawers";

interface DrawerProps {
  searchParams: Record<string, string>;
  destroyOnClose?: boolean;
  afterOpenChange?: (isOpen: boolean) => void;
}

interface DrawerComponentType {
  requiredParams?: Record<string, ((value: string) => boolean) | unknown>;
  closeParams?: string[];
  (props: DrawerProps): JSX.Element;
}

const Drawers: React.FC = () => {
  const drawerComponents: DrawerComponentType[] = [
    LeaderboardEditDrawer,
    CreateLeaderboardDrawer,
    RaffleEditDrawer,
    CreateRaffleDrawer,
    CreateWheelDrawer,
    EditWheelDrawer,
  ];

  const params = useQueryParams();

  return (
    <>
      {drawerComponents.map((DrawerComponent, ind) => {
        const open = shouldRenderDrawer(DrawerComponent, params.searchParams);
        if (!open) return null;

        const props: DrawerProps = {
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

        return <DrawerComponent key={ind} {...props} />;
      })}
    </>
  );
};

const shouldRenderDrawer = (
  drawer: DrawerComponentType,
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
