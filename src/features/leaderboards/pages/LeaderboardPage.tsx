import React from "react";
import { Box } from "@mui/material";

import { LeaderboardTable } from "../tables/LeaderboardTable";

export const LeaderboardPage: React.FC = () => {
  return (
    <Box>
      <LeaderboardTable />
    </Box>
  );
};
