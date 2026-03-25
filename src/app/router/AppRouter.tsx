import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { Layout } from "@/shared/ui/Layout";
import { LeaderboardList } from "@/features/leaderboards/pages/LeaderboardList";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "leaderboards", element: <LeaderboardList /> },
      { path: "raffles", element: <div>raffles</div> },
      { path: "wheels", element: <div>wheels</div> },
    ],
  },
];

export const AppRouter: React.FC = () => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};
