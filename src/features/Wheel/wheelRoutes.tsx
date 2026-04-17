import { WheelDetailPage } from "./pages/WheelDetailPage";
import { WheelPage } from "./pages/WheelPage";
import { P } from "@/app/router/paths";

export const WheelRoutes = [
  {
    path: P.WHEELS.INDEX,
    children: [
      { index: true, element: <WheelPage /> },
      { path: P.WHEELS.DETAILS, element: <WheelDetailPage /> },
    ],
  },
];
