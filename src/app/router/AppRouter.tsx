import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { Layout } from "@/shared/ui/Layout";
import { ROUTES } from "@/shared/constants/routes";
import { LeaderboardPage } from "@/features/leaderboards/pages/LeaderboardPage";
import { LeaderboardDetail } from "@/features/leaderboards/pages/LeaderboardDetail";
import { RafflePage } from "@/features/RaffleManagement/pages/RafflePage";
import { RaffleDetail } from "@/features/RaffleManagement/pages/RaffleDetail";
import { WheelManagementPage } from "@/features/WheelManagement/pages/WheelManagementPage";
import { WheelDetail } from "@/features/WheelManagement/pages/WheelDetail";
import { NotFound } from "@/pages/NotFound";

const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.LEADERBOARDS} replace />,
      },
      {
        path: ROUTES.LEADERBOARDS,
        element: <LeaderboardPage />,
      },
      {
        path: ROUTES.LEADERBOARD_DETAILS,
        element: <LeaderboardDetail />,
      },
      {
        path: ROUTES.RAFFLES,
        element: <RafflePage />,
      },
      {
        path: ROUTES.RAFFLE_DETAILS,
        element: <RaffleDetail />,
      },
      {
        path: ROUTES.WHEELS,
        element: <WheelManagementPage />,
      },
      {
        path: ROUTES.WHEEL_DETAILS,
        element: <WheelDetail />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export const AppRouter: React.FC = () => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};
