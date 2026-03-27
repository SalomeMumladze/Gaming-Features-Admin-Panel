import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { Layout } from "@/shared/ui/Layout";
import { LeaderboardList } from "@/features/leaderboards/pages/LeaderboardList";
import { LeaderboardDetail } from "@/features/leaderboards/pages/LeaderboardDetail";
import { NotFound } from "@/pages/NotFound";
import { RafflePage } from "@/features/RaffleManagement/pages/RafflePage";
import { RaffleDetail } from "@/features/RaffleManagement/pages/RaffleDetail";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "leaderboards", element: <LeaderboardList /> },
      {
        path: "leaderboard/detail/:id",
        element: <LeaderboardDetail />,
      },
      { path: "raffle/detail/:id", element: <RaffleDetail /> },
      { path: "raffles", element: <RafflePage /> },
      { path: "wheels", element: <div>Wheels Page</div> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export const AppRouter: React.FC = () => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};
