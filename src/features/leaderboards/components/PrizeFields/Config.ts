import { MonetizationOn, Casino, CardGiftcard } from "@mui/icons-material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material";

export const RANK_COLORS = [
  { base: "#f59e0b", label: "1ST" },
  { base: "#94a3b8", label: "2ND" },
  { base: "#c2763e", label: "3RD" },
];

export const TYPE_CONFIG: Record<
  string,
  {
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    label: string;
    hue: string;
  }
> = {
  coins: { icon: MonetizationOn, label: "Coins", hue: "#f59e0b" },
  freeSpin: { icon: Casino, label: "Free Spin", hue: "#8b5cf6" },
  bonus: { icon: CardGiftcard, label: "Bonus", hue: "#10b981" },
};
