import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { Layout } from "@/shared/ui/Layout";
import { LeaderboardPage } from "@/features/leaderboards/pages/LeaderboardPage";
import { LeaderboardDetail } from "@/features/leaderboards/pages/LeaderboardDetail";
import { NotFound } from "@/pages/NotFound";
import { RafflePage } from "@/features/RaffleManagement/pages/RafflePage";
import { RaffleDetail } from "@/features/RaffleManagement/pages/RaffleDetail";
import { WheelManagementPage } from "@/features/WheelManagement/pages/WheelManagementPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Navigate to="/leaderboards" replace /> },

      { path: "leaderboards", element: <LeaderboardPage /> },
      { path: "leaderboards/:id", element: <LeaderboardDetail /> },
      { path: "raffles/:id", element: <RaffleDetail /> },
      { path: "raffles", element: <RafflePage /> },
      { path: "wheels", element: <WheelManagementPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export const AppRouter: React.FC = () => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};
