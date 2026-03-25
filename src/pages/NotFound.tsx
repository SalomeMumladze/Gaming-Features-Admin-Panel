import React from "react";
import { Box, Typography } from "@mui/material";

export const NotFound: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      textAlign="center"
      p={2}
    >
      <Typography variant="h3" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h6">
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
};
