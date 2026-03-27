import { MonetizationOn, Casino, CardGiftcard } from "@mui/icons-material";
import type { RafflePrize } from "../hooks/useRaffleManagement";

export const TYPE_META: Record<
  RafflePrize["type"],
  { label: string; color: string; icon: any }
> = {
  coins: { label: "Coins", color: "#C9A84C", icon: MonetizationOn },
  freeSpin: { label: "Free Spin", color: "#7C9EE8", icon: Casino },
  bonus: { label: "Bonus", color: "#76C98A", icon: CardGiftcard },
};
