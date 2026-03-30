import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  color?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  subtitle,
  children,
  color,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const mainColor = color || theme.palette.primary.main;

  return (
    <Box
      sx={{
        borderRadius: "18px",
        overflow: "hidden",
        border: `1px solid ${alpha(mainColor, isDark ? 0.15 : 0.13)}`,
        bgcolor: isDark ? alpha("#0d1629", 0.6) : "#fff",
        backdropFilter: "blur(12px)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: alpha(mainColor, isDark ? 0.28 : 0.24),
          boxShadow: `0 4px 24px ${alpha(mainColor, isDark ? 0.09 : 0.07)}`,
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
          borderBottom: `1px solid ${alpha(mainColor, isDark ? 0.1 : 0.09)}`,
          background: `linear-gradient(90deg, ${alpha(
            mainColor,
            isDark ? 0.1 : 0.06,
          )} 0%, transparent 75%)`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "10px",
            bgcolor: alpha(mainColor, 0.2),
            color: mainColor,
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="caption"
              color={isDark ? "gray.400" : "text.secondary"}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {children}
      </Box>
    </Box>
  );
};
