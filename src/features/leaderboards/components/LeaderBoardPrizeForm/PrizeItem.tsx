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

import { Tag, Numbers, Delete, DragIndicator } from "@mui/icons-material";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TYPE_CONFIG } from "../Config";
import { RankBadge } from "@/shared/formatters";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { LeaderboardFormValues } from "@/features/leaderboards/schemas/leaderboard.schema";

interface PrizeItemProps {
  id: string;
  field: LeaderboardFormValues["prizes"][number];
  index: number;
  rankInfo: { base: string; label: string };
  register: UseFormRegister<LeaderboardFormValues>;
  remove: (index: number) => void;
  fieldsLength: number;
  errors?: FieldErrors<LeaderboardFormValues["prizes"][number]>;
}

export const PrizeItem: React.FC<PrizeItemProps> = ({
  id,
  field,
  index,
  register,
  remove,
  fieldsLength,
  errors,
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
      className="rounded-lg py-4"
    >
      <Box className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-6">
        <Box className="flex items-center gap-1 sm:mb-0 mb-1">
          <DragIndicator
            {...listeners}
            {...attributes}
            className="cursor-grab text-gray-500"
          />
          <RankBadge rank={field} />
        </Box>

        <TextField
          label="Name"
          size="small"
          error={!!errors?.name}
          helperText={errors?.name?.message}
          {...register(`prizes.${index}.name`)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tag fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Type"
          select
          size="small"
          error={!!errors?.type}
          helperText={errors?.type?.message}
          defaultValue={field.type}
          {...register(`prizes.${index}.type`)}
          className="w-full sm:w-36"
        >
          {Object.entries(TYPE_CONFIG).map(([value, cfg]) => {
            const Icon = cfg.icon;

            return (
              <MenuItem key={value} value={value}>
                <Box className="flex items-center gap-1">
                  <Box style={{ color: cfg.hue }}>
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
          error={!!errors?.amount}
          helperText={errors?.amount?.message}
          {...register(`prizes.${index}.amount`, {
            valueAsNumber: true,
          })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Numbers fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip
          title={
            fieldsLength === 1 ? "At least one prize required" : "Remove prize"
          }
        >
          <span>
            <IconButton
              disabled={fieldsLength === 1}
              onClick={() => remove(index)}
              size="small"
              sx={{
                color: theme.palette.error.main,
                bgcolor: alpha(theme.palette.error.main, isDark ? 0.08 : 0.06),
                border: `1px solid ${alpha(
                  theme.palette.error.main,
                  isDark ? 0.2 : 0.16,
                )}`,
                borderRadius: "10px",
                width: 34,
                height: 34,
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
