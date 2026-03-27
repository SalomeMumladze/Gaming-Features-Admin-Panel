import AppDrawers from "@/shared/AppDrawers";
import { CreateRaffleDrawer } from "./CreateRaffleDrawer";
import { RaffleEditDrawer } from "./RaffleEditDrawer";

const drawerComponents = [CreateRaffleDrawer, RaffleEditDrawer];

export const RaffleDrawers = () => {
  return <AppDrawers drawerComponents={drawerComponents} />;
};
