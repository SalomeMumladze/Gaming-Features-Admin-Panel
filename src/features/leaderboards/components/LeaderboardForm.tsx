import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { leaderboardSchema } from "../schemas/leaderboard.schema";
import type { LeaderboardFormValues } from "../schemas/leaderboard.schema";
import { PrizeFields } from "./PrizeFields";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";
import { StatusFormatter, ScoringTypeFormatter } from "@/shared/formatters";
import dayjs from "dayjs";

interface Props {
  initialData?: any;
  onSubmit: (data: LeaderboardFormValues) => void;
}

export const LeaderboardForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const form = useForm<LeaderboardFormValues>({
    resolver: zodResolver(leaderboardSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "draft",
      scoringType: "points",
      maxParticipants: 2,
      prizes: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
      });
    }
  }, [initialData]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Title"
          {...form.register("title")}
          error={!!form.formState.errors.title}
          helperText={form.formState.errors.title?.message}
        />
        <TextField
          multiline={true}
          label="Description"
          {...form.register("description")}
        />
        <div className="flex sm:flex-row flex-col  items-center justify-between gap-3">
          <Controller
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                className="w-full "
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
                  className="w-full "
                  format="DD MMM, YYYY"
                  label="End Date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toISOString() || "")}
                  minDate={startDate ? dayjs(startDate) : undefined}
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
        <div className="flex sm:flex-row flex-col  items-center justify-between gap-3">
          <Controller
            control={form.control}
            name="status"
            defaultValue={form.formState.defaultValues.status}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select labelId="status-label" {...field} label="Status">
                  <MenuItem value="draft">
                    <StatusFormatter value="draft" />
                  </MenuItem>
                  <MenuItem value="active">
                    <StatusFormatter value="active" />
                  </MenuItem>
                  <MenuItem value="completed">
                    <StatusFormatter value="completed" />
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={form.control}
            name="scoringType"
            defaultValue={form.formState.defaultValues.scoringType}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="scoringType-label">Scoring Type</InputLabel>
                <Select
                  labelId="scoringType-label"
                  {...field}
                  label="Scoring Type"
                >
                  <MenuItem value="points">
                    <ScoringTypeFormatter value="points" />
                  </MenuItem>
                  <MenuItem value="wins">
                    <ScoringTypeFormatter value="wins" />
                  </MenuItem>
                  <MenuItem value="wagered">
                    <ScoringTypeFormatter value="wagered" />
                  </MenuItem>
                </Select>
              </FormControl>
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
        <PrizeFields control={form.control} register={form.register} />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </form>
  );
};
