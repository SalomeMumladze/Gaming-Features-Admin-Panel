import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box } from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { raffleSchema } from "../schema/raffle.schema";
import type { RaffleFormValues } from "../schema/raffle.schema";
import { RafflePrizeForm } from "./RafflePrizeForm";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { RAFFLE_STATUSES } from "../constants";
import { SectionCard } from "@/shared/components/SectionCard";
import {
  TuneRounded,
  ConfirmationNumber,
  CalendarMonth,
} from "@mui/icons-material";

interface Props {
  initialData?: Partial<RaffleFormValues>;
  onSubmit: (data: RaffleFormValues) => void;
  isSubmitting?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

export const RaffleForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onDirtyChange,
}) => {
  const form = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      drawDate: "",
      status: "",
      ticketPrice: 0,
      maxTicketsPerUser: 1,
      totalTicketLimit: null,
      prizes: [
        {
          id: crypto.randomUUID(),
          name: "",
          type: "coins",
          amount: 0,
          quantity: 0,
          imageUrl: "",
        },
      ],
    },
  });

  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty);
  }, [form.formState.isDirty]);

  useEffect(() => {
    if (initialData) form.reset({ ...form.getValues(), ...initialData });
  }, [initialData]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-3xl mx-auto "
    >
      <SectionCard
        icon={<TuneRounded fontSize="small" />}
        title="Raffle Identity"
        subtitle="General Information"
      >
        <TextField
          label="Raffle Name"
          {...form.register("name")}
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
        />
        <TextField
          multiline
          label="Description"
          {...form.register("description")}
        />{" "}
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <StatusesSelector
              statuses={[...RAFFLE_STATUSES]}
              {...field}
              allowNull
              label="Choose Status"
              error={!!form.formState.errors.status}
              helperText={form.formState.errors.status?.message}
            />
          )}
        />
      </SectionCard>

      <SectionCard icon={<CalendarMonth />} title="Dates">
        <div className="flex flex-col sm:flex-row gap-4">
          <Controller
            control={form.control}
            name="startDate"
            render={({ field }) => {
              const startDate = form.watch("startDate");
              return (
                <DatePicker
                  label="Start Date"
                  format="DD MMM, YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  minDate={startDate ? dayjs(startDate) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString() || "")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!form.formState.errors.startDate,
                      helperText: form.formState.errors.startDate?.message,
                    },
                  }}
                />
              );
            }}
          />
          <Controller
            control={form.control}
            name="endDate"
            render={({ field }) => {
              const startDate = form.watch("startDate");
              return (
                <DatePicker
                  label="End Date"
                  format="DD MMM, YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  minDate={startDate ? dayjs(startDate) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString() || "")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!form.formState.errors.endDate,
                      helperText: form.formState.errors.endDate?.message,
                    },
                  }}
                />
              );
            }}
          />
          <Controller
            control={form.control}
            name="drawDate"
            render={({ field }) => {
              const endDate = form.watch("endDate");
              return (
                <DatePicker
                  label="Draw Date"
                  format="DD MMM, YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  minDate={endDate ? dayjs(endDate) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString() || "")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!form.formState.errors.drawDate,
                      helperText: form.formState.errors.drawDate?.message,
                    },
                  }}
                />
              );
            }}
          />
        </div>
      </SectionCard>

      <SectionCard icon={<ConfirmationNumber />} title=" Ticket Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label="Ticket Price"
            type="number"
            {...form.register("ticketPrice", { valueAsNumber: true })}
            error={!!form.formState.errors.ticketPrice}
            helperText={form.formState.errors.ticketPrice?.message}
          />
          <TextField
            label="Max Tickets Per User"
            type="number"
            {...form.register("maxTicketsPerUser", { valueAsNumber: true })}
            error={!!form.formState.errors.maxTicketsPerUser}
            helperText={form.formState.errors.maxTicketsPerUser?.message}
          />
          <TextField
            label="Total Ticket Limit"
            type="number"
            {...form.register("totalTicketLimit", { valueAsNumber: true })}
          />
        </div>
      </SectionCard>

      <RafflePrizeForm
        errors={form.formState.errors.prizes}
        setValue={form.setValue}
        register={form.register}
        initialPrizes={initialData?.prizes}
      />

      <Box className="flex justify-center !my-4">
        <Button
          size="large"
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {initialData ? "Update Raffle" : "Create Raffle"}
        </Button>
      </Box>
    </form>
  );
};
