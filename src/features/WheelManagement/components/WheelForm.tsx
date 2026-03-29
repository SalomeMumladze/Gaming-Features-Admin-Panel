import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  MenuItem,
} from "@mui/material";
import { wheelSchema } from "../schema/wheel.schema";
import type { WheelFormValues } from "../schema/wheel.schema";
import { Delete } from "@mui/icons-material";
import { WHEEL_STATUSES } from "../constants";
import { StatusesSelector } from "@/shared/components/StatusesSelector";

interface Props {
  initialData?: Partial<WheelFormValues>;
  onSubmit?: (data: WheelFormValues) => void;
  isSubmitting?: boolean;
}

export const WheelForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<WheelFormValues>({
    resolver: zodResolver(wheelSchema),
    defaultValues: {
      name: "",
      status: "",
      segments: [
        { label: "", weight: 50, color: "#FF0000" },
        { label: "", weight: 50, color: "#00FF00" },
      ],
      spinCost: 0,
      maxSpinsPerUser: 1,
      prizes: [{ name: "", prizeType: "nothing", prizeAmount: 0 }],
    },
  });

  const prizes = form.watch("prizes");

  const {
    fields: segmentsFields,
    append: appendSegment,
    remove: removeSegment,
  } = useFieldArray({ control: form.control, name: "segments" });

  const {
    fields: prizesFields,
    append: appendPrize,
    remove: removePrize,
  } = useFieldArray({ control: form.control, name: "prizes" });

  useEffect(() => {
    if (initialData) form.reset({ ...form.getValues(), ...initialData });
  }, [initialData]);

  useEffect(() => {
    prizes.forEach((p, idx) => {
      if (p.prizeType === "nothing" && p.prizeAmount !== 0) {
        form.setValue(`prizes.${idx}.prizeAmount`, 0);
      }
    });
  }, [prizes, form]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <Typography variant="h6">Wheel Name</Typography>
      <Divider />
      <TextField
        label="Name"
        {...form.register("name")}
        error={!!form.formState.errors.name}
        helperText={form.formState.errors.name?.message}
      />

      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <StatusesSelector
            error={!!form.formState.errors.status}
            statuses={WHEEL_STATUSES}
            {...field}
            allowNull
            label="Choose Status"
            helperText={form.formState.errors.status?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <TextField
            select
            fullWidth
            label="Status"
            {...field}
            value={field.value || ""}
            error={!!form.formState.errors.status}
            helperText={form.formState.errors.status?.message}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </TextField>
        )}
      />
      <Box className="p-4 flex flex-col gap-4">
        <Typography variant="h6">Segments</Typography>
        <Divider />
        {segmentsFields.map((field, index) => (
          <Box key={field.id} className="flex gap-2 items-center">
            <TextField
              label="Label"
              {...form.register(`segments.${index}.label` as const)}
              error={!!form.formState.errors.segments?.[index]?.label}
              helperText={
                form.formState.errors.segments?.[index]?.label?.message
              }
            />
            <TextField
              label="Weight"
              type="number"
              {...form.register(`segments.${index}.weight` as const, {
                valueAsNumber: true,
              })}
              error={!!form.formState.errors.segments?.[index]?.weight}
              helperText={
                form.formState.errors.segments?.[index]?.weight?.message
              }
            />

            <TextField
              label="Color"
              type="color"
              {...form.register(`segments.${index}.color` as const)}
              error={!!form.formState.errors.segments?.[index]?.color}
            />

            <IconButton
              onClick={() => removeSegment(index)}
              disabled={segmentsFields.length <= 2}
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
        {segmentsFields.length <= 11 && (
          <Button
            onClick={() =>
              appendSegment({ label: "", weight: 0, color: "#000000" })
            }
          >
            Add Segment
          </Button>
        )}
        {form.formState.errors.segments?.root?.message && (
          <Typography color="error">
            {form.formState.errors.segments?.root?.message as string}
          </Typography>
        )}
      </Box>

      <Box className="p-4 border rounded-2xl bg-white shadow-sm flex flex-col gap-4">
        <Typography variant="h6">Spin Info</Typography>
        <Divider />
        <TextField
          label="Spin Cost"
          type="number"
          {...form.register("spinCost", { valueAsNumber: true })}
          error={!!form.formState.errors.spinCost}
          helperText={form.formState.errors.spinCost?.message}
        />
        <TextField
          label="Max Spins Per User"
          type="number"
          {...form.register("maxSpinsPerUser", { valueAsNumber: true })}
          error={!!form.formState.errors.maxSpinsPerUser}
          helperText={form.formState.errors.maxSpinsPerUser?.message}
        />
      </Box>

      <Box className="p-4 border rounded-2xl bg-white shadow-sm flex flex-col gap-4">
        <Typography variant="h6">Prizes</Typography>
        <Divider />

        {prizesFields.map((field, index) => {
          const prizeType = prizes?.[index]?.prizeType;

          return (
            <Box key={field.id}>
              <Box className="flex gap-2 items-center">
                <TextField
                  label="Name"
                  error={!!form.formState.errors.prizes?.[index]?.name}
                  helperText={
                    form.formState.errors.prizes?.[index]?.name?.message
                  }
                  {...form.register(`prizes.${index}.name` as const)}
                />
                <TextField
                  select
                  label="Type"
                  {...form.register(`prizes.${index}.prizeType` as const)}
                >
                  <MenuItem value="nothing">Nothing</MenuItem>
                  <MenuItem value="coins">Coins</MenuItem>
                  <MenuItem value="item">Item</MenuItem>
                </TextField>
                <TextField
                  label="Amount"
                  type="number"
                  disabled={prizeType === "nothing"}
                  error={!!form.formState.errors.prizes?.[index]?.prizeAmount}
                  helperText={
                    form.formState.errors.prizes?.[index]?.prizeAmount?.message
                  }
                  {...form.register(`prizes.${index}.prizeAmount` as const, {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === "" ? 0 : Number(v)),
                    validate: (value) => {
                      if (prizeType === "nothing") {
                        return (
                          value === 0 || "Amount must be 0 when type is Nothing"
                        );
                      }
                      return value > 0 || "Amount must be greater than 0";
                    },
                  })}
                />
                <IconButton onClick={() => removePrize(index)}>
                  <Delete />
                </IconButton>
              </Box>
              {form.formState.errors?.prizes?.root?.message && (
                <Typography color="error">
                  {form.formState.errors?.prizes?.root?.message as string}
                </Typography>
              )}
            </Box>
          );
        })}
        <Button
          onClick={() =>
            appendPrize({ name: "", prizeType: "nothing", prizeAmount: 0 })
          }
        >
          Add Prize
        </Button>
      </Box>

      <Box className="flex justify-center !my-4">
        <Button
          size="large"
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          Submit Wheel
        </Button>
      </Box>
    </form>
  );
};
