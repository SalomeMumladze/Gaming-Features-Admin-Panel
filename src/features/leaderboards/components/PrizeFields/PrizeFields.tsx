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
import { RANK_COLORS } from "./Config";

import type { DragEndEvent } from "@dnd-kit/core";

interface PrizeFieldsProps {
  control: any;
  register: any;
  errors: any;
  setValue: any;
}

export const PrizeFields: React.FC<PrizeFieldsProps> = ({
  control,
  register,
  errors,
  setValue,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const amberBase = isDark ? "#f59e0b" : "#d97706";

  const { fields, append, move } = useFieldArray({
    control,
    name: "prizes",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleRemove = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);

    const withRanks = updated.map((item, i) => ({
      ...item,
      rank: i + 1,
    }));

    setValue("prizes", withRanks, { shouldValidate: true, shouldDirty: true });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);

    move(oldIndex, newIndex);

    const updated = [...fields];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    const withRanks = updated.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    setValue("prizes", withRanks, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="grid gap-4">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          maxHeight: "40vh",
          overflow: "scroll",
          padding: "20px 0px",
        }}
      >
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
              const rankInfo = RANK_COLORS[index] ?? {
                base: isDark ? "#4f8eff" : "#3b6ef0",
                label: `#${index + 1}`,
              };

              return (
                <PrizeItem
                  key={field.id}
                  id={field.id}
                  field={field}
                  index={index}
                  rankInfo={rankInfo}
                  register={register}
                  remove={handleRemove}
                  errors={errors?.[index]}
                  fieldsLength={fields.length}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </Box>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            name: "",
            type: "coins",
            amount: 0,
            rank: fields.length + 1,
          })
        }
        sx={{
          borderColor: alpha(amberBase, isDark ? 0.3 : 0.28),
          color: amberBase,
          bgcolor: alpha(amberBase, isDark ? 0.05 : 0.04),
        }}
      >
        Add Prize
      </Button>
    </div>
  );
};
