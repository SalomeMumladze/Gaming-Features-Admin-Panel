import { RafflePage } from "./pages/RafflePage";
import { RaffleDetailPage } from "./pages/RaffleDetailPage";
import { P } from "@/app/router/paths";

export const raffleRoutes = [
  {
    path: P.RAFFLES.INDEX,
    children: [
      { index: true, element: <RafflePage /> },
      { path: P.RAFFLES.DETAILS, element: <RaffleDetailPage /> },
    ],
  },
];
