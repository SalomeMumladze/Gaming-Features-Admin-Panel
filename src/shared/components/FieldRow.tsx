import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

interface FieldRowProps {
  index: number;
  onRemove: () => void;
  removeDisabled?: boolean;
  removeTooltip?: string;
  children: React.ReactNode;
  color?: string;
}

export const FieldRow: React.FC<FieldRowProps> = ({
  index,
  onRemove,
  removeDisabled,
  removeTooltip,
  children,
  color,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const mainColor = color || theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        py: 2.5,
        borderRadius: "12px",
        border: `1px solid ${alpha(mainColor, isDark ? 0.12 : 0.1)}`,
        bgcolor: isDark ? alpha("#0d1629", 0.4) : alpha(mainColor, 0.03),
        transition: "all 0.2s",
        "&:hover": {
          borderColor: alpha(mainColor, isDark ? 0.25 : 0.2),
          bgcolor: alpha(mainColor, isDark ? 0.08 : 0.06),
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 24,
          height: 24,
          mt: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            color: alpha(theme.palette.text.primary, isDark ? 0.5 : 0.4),
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {children}
      </Box>

      <Tooltip title={removeTooltip ?? "Remove"}>
        <span>
          <IconButton
            onClick={onRemove}
            disabled={removeDisabled}
            sx={{
              color: theme.palette.error.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.1),
              },
            }}
          >
            <Delete />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
