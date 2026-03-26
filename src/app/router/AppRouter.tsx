import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { Layout } from "@/shared/ui/Layout";
import { LeaderboardList } from "@/features/leaderboards/pages/LeaderboardList";
import { LeaderboardDetail } from "@/features/leaderboards/pages/LeaderboardDetail";
import { NotFound } from "@/pages/NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "leaderboards", element: <LeaderboardList /> },
      {
        path: "leaderboard/:id",
        element: <LeaderboardDetail />,
      },
      { path: "raffles", element: <div>Raffles Page</div> },
      { path: "wheels", element: <div>Wheels Page</div> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export const AppRouter: React.FC = () => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};
