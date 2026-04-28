import React from "react";
import useQueryParams from "@/shared/providers/useQueryParams";
import { LeaderboardEditDrawer } from "@/features/leaderboards/drawers/LeaderboardEditDrawer";
import { CreateLeaderboardDrawer } from "@/features/leaderboards/drawers/CreateLeaderboardDrawer";

import { RaffleEditDrawer } from "@/features/Raffle/drawers/RaffleEditDrawer";
import { CreateRaffleDrawer } from "@/features/Raffle/drawers/CreateRaffleDrawer";
// import {
//   RaffleEditDrawer,
//   CreateRaffleDrawer,
// } from "@/features/Raffle/drawers";
import { CreateWheelDrawer } from "@/features/Wheel/drawers/CreateWheelDrawer";
import { EditWheelDrawer } from "@/features/Wheel/drawers/EditWheelDrawer";
// import { CreateWheelDrawer, EditWheelDrawer } from "@/features/Wheel/drawers";

interface DrawerProps {
  searchParams: Record<string, string>;
  destroyOnClose?: boolean;
  afterOpenChange?: (isOpen: boolean) => void;
}

interface DrawerComponentType extends React.FC<DrawerProps> {
  requiredParams?: Record<string, ((value: string) => boolean) | unknown>;
  closeParams?: string[];
}

const Drawers: React.FC = () => {
  const params = useQueryParams();

  const drawerComponents = [
    LeaderboardEditDrawer,
    CreateLeaderboardDrawer,
    RaffleEditDrawer,
    CreateRaffleDrawer,
    CreateWheelDrawer,
    EditWheelDrawer,
  ] as DrawerComponentType[];

  return (
    <>
      {drawerComponents.map((DrawerComponent, ind) => {
        const open = shouldRenderDrawer(DrawerComponent, params.searchParams);

        if (!open) return null;

        return (
          <DrawerComponent
            key={ind}
            searchParams={params.searchParams}
            destroyOnClose={true}
            afterOpenChange={(isOpen: boolean) => {
              if (!isOpen) {
                params.removeParams([
                  ...Object.keys(DrawerComponent.requiredParams ?? {}),
                  ...(DrawerComponent.closeParams ?? []),
                ]);
              }
            }}
          />
        );
      })}
    </>
  );
};

const shouldRenderDrawer = (
  drawer: DrawerComponentType,
  searchParams: Record<string, string>,
): boolean => {
  if (
    !drawer.requiredParams ||
    Object.keys(drawer.requiredParams).length === 0
  ) {
    return false;
  }

  if (Object.keys(searchParams).length === 0) {
    return false;
  }

  return Object.entries(drawer.requiredParams).every(([param, check]) => {
    if (typeof check !== "function") {
      return Boolean(searchParams[param]);
    }

    return check(searchParams[param]);
  });
};

export default Drawers;
