import React from "react";
import {
  TextField,
  Box,
  InputAdornment,
  IconButton,
  Tooltip,
  Paper,
  alpha,
  useTheme,
  MenuItem,
} from "@mui/material";
import {
  WorkspacePremium,
  Tag,
  Numbers,
  Delete,
  DragIndicator,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TYPE_CONFIG } from "./Config";

interface PrizeItemProps {
  id: string;
  field: any;
  index: number;
  rankInfo: { base: string; label: string };
  register: any;
  remove: (index: number) => void;
  fieldsLength: number;
}

export const PrizeItem: React.FC<PrizeItemProps> = ({
  id,
  field,
  index,
  rankInfo,
  register,
  remove,
  fieldsLength,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={0}
      className="!rounded-lg"
      sx={{
        border: `1px solid ${alpha(rankInfo.base, isDark ? 0.15 : 0.12)}`,
        bgcolor: isDark ? alpha("#0d1629", 0.55) : alpha(rankInfo.base, 0.03),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
        <DragIndicator
          {...listeners}
          {...attributes}
          sx={{ cursor: "grab", color: theme.palette.text.secondary }}
        />

        <div
          className="shrink-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center"
          style={{
            backgroundColor: alpha(rankInfo.base, isDark ? 0.12 : 0.1),
            border: `1px solid ${alpha(rankInfo.base, isDark ? 0.3 : 0.22)}`,
          }}
        >
          <WorkspacePremium sx={{ color: rankInfo.base, fontSize: 18 }} />
          <span
            className="text-[10px] font-extrabold mt-1"
            style={{ color: rankInfo.base }}
          >
            {rankInfo.label}
          </span>
        </div>

        <TextField
          label="Name"
          size="small"
          {...register(`prizes.${index}.name`)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tag
                  fontSize="small"
                  sx={{ color: theme.palette.text.secondary }}
                />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: 0 }}
        />

        <TextField
          label="Type"
          select
          size="small"
          defaultValue={field.type}
          {...register(`prizes.${index}.type`)}
          sx={{ width: 140 }}
        >
          {Object.entries(TYPE_CONFIG).map(([value, cfg]) => {
            const Icon = cfg.icon;
            return (
              <MenuItem key={value} value={value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ color: cfg.hue, display: "flex" }}>
                    <Icon fontSize="small" />
                  </Box>
                  {cfg.label}
                </Box>
              </MenuItem>
            );
          })}
        </TextField>

        <TextField
          label="Amount"
          type="number"
          size="small"
          {...register(`prizes.${index}.amount`, { valueAsNumber: true })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Numbers
                  fontSize="small"
                  sx={{ color: theme.palette.text.secondary }}
                />
              </InputAdornment>
            ),
          }}
          sx={{ width: 110 }}
        />

        <Tooltip
          title={
            fieldsLength === 1 ? "At least one prize required" : "Remove prize"
          }
          placement="top"
        >
          <span>
            <IconButton
              disabled={fieldsLength === 1}
              onClick={() => remove(index)}
              size="small"
              sx={{
                color: theme.palette.error.main,
                bgcolor: alpha(theme.palette.error.main, isDark ? 0.08 : 0.06),
                border: `1px solid ${alpha(theme.palette.error.main, isDark ? 0.2 : 0.16)}`,
                borderRadius: "10px",
                width: 34,
                height: 34,
                transition: "all 0.15s ease",
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
};
