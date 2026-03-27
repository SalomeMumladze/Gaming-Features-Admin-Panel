import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  InputLabel,
  FormControl,
  Select,
  Typography,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { raffleSchema } from "../schema/raffle.schema";
import type { RaffleFormValues } from "../schema/raffle.schema";
import PrizesForm from "./PrizesForm";

interface Props {
  initialData?: Partial<RaffleFormValues>;
  onSubmit: (data: RaffleFormValues) => void;
}

export const RaffleForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const form = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      drawDate: "",
      status: "draft",
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
    if (initialData) form.reset({ ...form.getValues(), ...initialData });
  }, [initialData]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="h-full flex flex-col gap-6 mb-4"
    >
      <Box className="p-4 border rounded-2xl bg-white shadow-sm flex flex-col gap-4">
        <Typography variant="caption" className="text-gray-700 font-semibold">
          General Information
        </Typography>
        <Divider className="!m-0" />

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
        />
      </Box>

      <Box className="p-4 border rounded-2xl bg-white shadow-sm flex flex-col gap-4">
        <Typography variant="h6" className="text-gray-700 font-semibold">
          Dates
        </Typography>
        <Divider />

        <div className="flex flex-col sm:flex-row gap-4">
          <Controller
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                label="Start Date"
                format="DD MMM, YYYY"
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString() || "")}
                slotProps={{
                  textField: {
                    fullWidth: true,
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
      </Box>

      <Box className="p-4 border rounded-2xl bg-white shadow-sm flex flex-col gap-4">
        <Typography variant="h6" className="text-gray-700 font-semibold">
          Ticket Information
        </Typography>
        <Divider />

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
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select {...field} value={field.value} label="Status">
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="drawn">Drawn</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </div>
      </Box>

      <PrizesForm
        errors={form.formState.errors.prizes}
        setValue={form.setValue}
        register={form.register}
        initialPrizes={initialData?.prizes}
      />

      <Box className="flex justify-center !my-4">
        <Button size="large" type="submit" variant="contained">
          {initialData ? "Update Raffle" : "Create Raffle"}
        </Button>
      </Box>
    </form>
  );
};
