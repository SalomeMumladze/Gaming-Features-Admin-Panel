import React from "react";
import { Button, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
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
import { RANK_COLORS } from "@/features/leaderboards/components/Config";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  Control,
} from "react-hook-form";
import type { LeaderboardFormValues } from "@/features/leaderboards/schemas/leaderboard.schema";

import type { DragEndEvent } from "@dnd-kit/core";

interface PrizeFieldsProps {
  register: UseFormRegister<LeaderboardFormValues>;
  errors: FieldErrors<LeaderboardFormValues["prizes"]>;
  setValue: UseFormSetValue<LeaderboardFormValues>;
  control: Control<LeaderboardFormValues>;
}

export const LeaderBoardPrizeForm: React.FC<PrizeFieldsProps> = ({
  control,
  register,
  errors,
  setValue,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
    <div>
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
        className="!self-start !rounded-lg !border-dashed !border-gray-300 !text-gray-600 "
      >
        Add Prize
      </Button>
    </div>
  );
};
