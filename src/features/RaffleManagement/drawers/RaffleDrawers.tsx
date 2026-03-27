import AppDrawers from "@/shared/AppDrawers";
import { CreateRaffleDrawer } from "./CreateRaffleDrawer";

const drawerComponents = [CreateRaffleDrawer];

export const RaffleDrawers = () => {
  return <AppDrawers drawerComponents={drawerComponents} />;
};
