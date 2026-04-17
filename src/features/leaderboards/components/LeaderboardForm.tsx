import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box } from "@mui/material";
import { leaderboardSchema } from "../schemas/leaderboard.schema";
import type { LeaderboardFormValues } from "../schemas/leaderboard.schema";
import { LeaderBoardPrizeForm } from "./LeaderBoardPrizeForm";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import type { Leaderboard } from "../types/leaderboard.types";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { LEADERBOARD_STATUSES } from "../constants";
import { ScoringTypeSelector } from "./ScoringTypeSelector";
import { SectionCard } from "@/shared/components/SectionCard";
import {
  TuneRounded,
  EmojiEventsRounded,
  CalendarMonth,
  Settings,
} from "@mui/icons-material";

interface Props {
  initialData?: Leaderboard;
  onSubmit: (data: LeaderboardFormValues) => void;
  isSubmitting?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

export const LeaderboardForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onDirtyChange,
}) => {
  const form = useForm<LeaderboardFormValues>({
    resolver: zodResolver(leaderboardSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: undefined,
      scoringType: undefined,
      maxParticipants: 2,
      prizes: [
        {
          id: crypto.randomUUID(),
          name: "",
          type: "",
          amount: 0,
          rank: 1,
        },
      ],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({ ...initialData });
    }
  }, [initialData]);

  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty);
  }, [form.formState.isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
      <Box display="flex" flexDirection="column" gap={3} height="100%">
        {/* General Info */}
        <SectionCard
          icon={<TuneRounded fontSize="small" />}
          title="General Info"
        >
          <TextField
            label="Title"
            {...form.register("title")}
            error={!!form.formState.errors.title}
            helperText={form.formState.errors.title?.message}
          />
          <TextField
            multiline
            label="Description"
            {...form.register("description")}
          />
        </SectionCard>

        <SectionCard icon={<CalendarMonth />} title="Dates">
          <div className="flex sm:flex-row flex-col items-center justify-between gap-6">
            <Controller
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  className="w-full"
                  label="Start Date"
                  format="DD MMM, YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toISOString() || "")}
                  slotProps={{
                    textField: {
                      error: !!form.formState.errors.startDate,
                      helperText: form.formState.errors.startDate?.message,
                    },
                  }}
                />
              )}
            />

            <Controller
              control={form.control}
              name="endDate"
              render={({ field }) => {
                const startDate = form.watch("startDate");

                return (
                  <DatePicker
                    className="w-full"
                    label="End Date"
                    format="DD MMM, YYYY"
                    value={field.value ? dayjs(field.value) : null}
                    minDate={startDate ? dayjs(startDate) : undefined}
                    onChange={(date) =>
                      field.onChange(date?.toISOString() || "")
                    }
                    slotProps={{
                      textField: {
                        error: !!form.formState.errors.endDate,
                        helperText: form.formState.errors.endDate?.message,
                      },
                    }}
                  />
                );
              }}
            />
          </div>
        </SectionCard>

        <SectionCard icon={<Settings />} title="Configuration">
          <div className="flex sm:flex-row flex-col items-center justify-between gap-6">
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <StatusesSelector
                  statuses={LEADERBOARD_STATUSES}
                  {...field}
                  allowNull
                  label="Choose Status"
                  error={!!form.formState.errors.status}
                  helperText={form.formState.errors.status?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="scoringType"
              render={({ field }) => (
                <ScoringTypeSelector
                  {...field}
                  allowNull
                  label="Scoring Type"
                  error={!!form.formState.errors.scoringType}
                  helperText={form.formState.errors.scoringType?.message}
                />
              )}
            />
          </div>

          <TextField
            label="Max Participants"
            type="number"
            {...form.register("maxParticipants", {
              valueAsNumber: true,
            })}
            error={!!form.formState.errors.maxParticipants}
            helperText={form.formState.errors.maxParticipants?.message}
          />
        </SectionCard>

        <SectionCard icon={<EmojiEventsRounded />} title="Prizes">
          <LeaderBoardPrizeForm
            control={form.control}
            register={form.register}
            errors={form.formState.errors.prizes}
            setValue={form.setValue}
          />
        </SectionCard>

        <Box display="flex" justifyContent="center">
          <Button
            size="large"
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
};
