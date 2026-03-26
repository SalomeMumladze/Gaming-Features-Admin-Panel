import React from "react";
import { Box, Typography, Chip, Button, alpha, useTheme } from "@mui/material";
import { EmojiEvents, Add } from "@mui/icons-material";
import { useFieldArray } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PrizeItem } from "./PrizeItem";

import type { DragEndEvent } from "@dnd-kit/core";
interface PrizeFieldsProps {
  control: any;
  register: any;
}

const RANK_COLORS = [
  { base: "#f59e0b", label: "1ST" },
  { base: "#94a3b8", label: "2ND" },
  { base: "#c2763e", label: "3RD" },
];

export const PrizeFields: React.FC<PrizeFieldsProps> = ({
  control,
  register,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const amberBase = isDark ? "#f59e0b" : "#d97706";

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "prizes",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <EmojiEvents sx={{ color: amberBase, fontSize: 20 }} />
        <Typography
          className="!font-bold !text-sm"
          sx={{ color: theme.palette.text.primary }}
        >
          Prizes
        </Typography>
        <Chip
          label={fields.length}
          size="small"
          sx={{
            bgcolor: alpha(amberBase, isDark ? 0.12 : 0.1),
            color: amberBase,
            border: `1px solid ${alpha(amberBase, 0.25)}`,
          }}
        />
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => {
            const rank = index + 1;
            const rankInfo = RANK_COLORS[index] ?? {
              base: isDark ? "#4f8eff" : "#3b6ef0",
              label: `#${rank}`,
            };
            return (
              <PrizeItem
                key={field.id}
                id={field.id}
                field={field}
                index={index}
                rankInfo={rankInfo}
                register={register}
                remove={remove}
                fieldsLength={fields.length}
              />
            );
          })}
        </SortableContext>
      </DndContext>

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            rank: fields.length + 1,
            name: "",
            type: "coins",
            amount: 0,
          })
        }
        className="!font-bold !capitalize !rounded-lg !p-2"
        sx={{
          borderColor: alpha(amberBase, isDark ? 0.3 : 0.28),
          color: amberBase,
          bgcolor: alpha(amberBase, isDark ? 0.05 : 0.04),
        }}
      >
        Add Prize
      </Button>
    </Box>
  );
};
