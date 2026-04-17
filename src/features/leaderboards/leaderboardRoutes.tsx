import { LeaderboardPage } from "./pages/LeaderboardPage";
import { LeaderboardDetailPage } from "./pages/LeaderboardDetailPage";
import { P } from "@/app/router/paths";

export const leaderboardRoutes = [
  {
    path: P.LEADERBOARDS.INDEX,
    children: [
      { index: true, element: <LeaderboardPage /> },
      { path: P.LEADERBOARDS.DETAILS, element: <LeaderboardDetailPage /> },
    ],
  },
];
