import { LeaderboardPage } from "@/features/leaderboards/pages/LeaderboardPage";
import { LeaderboardDetailPage } from "@/features/leaderboards/pages/LeaderboardDetailPage";
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
