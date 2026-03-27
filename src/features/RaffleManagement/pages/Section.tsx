import React from "react";
import { Box, Typography, Paper, useTheme, alpha } from "@mui/material";

export const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  accent: { light: string; dark: string };
  children: React.ReactNode;
}> = ({ icon, title, accent, children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const color = isDark ? accent.dark : accent.light;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "18px",
        overflow: "hidden",
        border: `1px solid ${alpha(color, isDark ? 0.15 : 0.13)}`,
        bgcolor: isDark ? alpha("#0d1629", 0.6) : "#fff",
        backdropFilter: "blur(12px)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: alpha(color, isDark ? 0.28 : 0.24),
          boxShadow: `0 4px 24px ${alpha(color, isDark ? 0.09 : 0.07)}`,
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: `1px solid ${alpha(color, isDark ? 0.1 : 0.09)}`,
          background: `linear-gradient(90deg, ${alpha(color, isDark ? 0.1 : 0.06)} 0%, transparent 75%)`,
        }}
      >
        <Box sx={{ color, display: "flex" }}>{icon}</Box>
        <Typography
          sx={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: alpha(color, isDark ? 0.75 : 0.8),
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Paper>
  );
};
