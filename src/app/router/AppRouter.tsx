import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { Layout } from "@/shared/ui/Layout";
import { NotFound } from "@/pages/NotFound";
import { leaderboardRoutes } from "@/features/leaderboards/leaderboardRoutes";
// import { raffleRoutes } from "@/features/Raffle/raffleRoutes";
// import { WheelRoutes } from "@/features/Wheel/wheelRoutes";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/leaderboards" replace />,
      },

      // feature routes (clean composition)
      ...leaderboardRoutes,
      // ...raffleRoutes,
      // ...WheelRoutes,

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
