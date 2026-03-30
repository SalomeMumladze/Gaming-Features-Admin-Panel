import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";

export const DetailField: React.FC<{
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
}> = ({ label, value, icon, accent }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        p: 2,
        borderRadius: "12px",
        bgcolor: isDark ? alpha("#fff", 0.025) : alpha("#3b6ef0", 0.03),
        border: `1px solid ${isDark ? alpha("#fff", 0.05) : alpha("#3b6ef0", 0.07)}`,
        transition: "background-color 0.15s",
        "&:hover": {
          bgcolor: isDark ? alpha("#fff", 0.04) : alpha("#3b6ef0", 0.055),
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        {icon && (
          <Box
            sx={{
              color: accent ?? theme.palette.text.secondary,
              display: "flex",
              "& svg": { fontSize: 13 },
            }}
          >
            {icon}
          </Box>
        )}
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: theme.palette.text.secondary,
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ pl: icon ? 2.5 : 0 }}>
        {typeof value === "string" || typeof value === "number" ? (
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
};
