import AppDrawers from "@/shared/AppDrawers";
import { LeaderboardEditDrawer } from "./LeaderboardEditDrawer";
import { CreateLeaderboardDrawer } from "./CreateLeaderboardDrawer";

const drawerComponents = [LeaderboardEditDrawer, CreateLeaderboardDrawer];

export const LeaderboardDrawers = () => {
  return <AppDrawers drawerComponents={drawerComponents} />;
};
