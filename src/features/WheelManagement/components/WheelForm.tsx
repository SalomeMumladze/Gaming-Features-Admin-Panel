import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import { wheelSchema } from "../schema/wheel.schema";
import type { WheelFormValues } from "../schema/wheel.schema";
import {
  Add,
  TuneRounded,
  EmojiEventsRounded,
  SavingsRounded,
} from "@mui/icons-material";
import { WHEEL_STATUSES } from "../constants";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { SectionCard } from "@/shared/components/SectionCard";
import { FieldRow } from "@/shared/components/FieldRow";
import { RouletteWheel } from "./RouletteWheel";

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
      backgroundColor: "#ffffff",
      borderColor: "#000000",
      segments: [
        { label: "", weight: 50, color: "#6366f1" },
        { label: "", weight: 50, color: "#10b981" },
      ],
      spinCost: 0,
      maxSpinsPerUser: 1,
      prizes: [{ name: "", prizeType: "nothing", prizeAmount: 0 }],
    },
  });

  const prizes = form.watch("prizes");
  const segments = form.watch("segments");

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

  const segmentCount = segmentsFields.length;
  const prizeCount = prizesFields.length;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-3xl mx-auto "
    >
      <SectionCard
        icon={<TuneRounded fontSize="small" />}
        title="Wheel Identity"
        subtitle="Basic details and visibility"
      >
        <TextField
          label="Wheel Name"
          fullWidth
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
              label="Status"
              helperText={form.formState.errors.status?.message}
            />
          )}
        />
      </SectionCard>

      <SectionCard
        icon={<span className="text-sm font-bold">⬡</span>}
        title="Wheel Segments"
        subtitle={`${segmentCount} segment${segmentCount !== 1 ? "s" : ""} · 2–12 allowed`}
      >
        <RouletteWheel
          segments={segments}
          withSpin
          useWeight
          backgroundColor={form.formState?.values?.backgroundColor}
          borderColor={form.formState?.values?.borderColor}
        />
        <Box className="grid grid-cols-2 gap-4">
          <Box>
            <Typography variant="caption">Background Color</Typography>
            <Box className="flex items-center gap-2 border p-2 rounded-lg">
              <input type="color" {...form.register("backgroundColor")} />
              <Typography variant="caption">
                {form.watch("backgroundColor")}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption">Border Color</Typography>
            <Box className="flex items-center gap-2 border p-2 rounded-lg">
              <input type="color" {...form.register("borderColor")} />
              <Typography variant="caption">
                {form.watch("borderColor")}
              </Typography>
            </Box>
          </Box>
        </Box>
        {segmentsFields.map((field, index) => (
          <FieldRow
            key={field.id}
            index={index}
            onRemove={() => removeSegment(index)}
            removeDisabled={segmentsFields.length <= 2}
            removeTooltip={
              segmentsFields.length <= 2
                ? "Minimum 2 segments required"
                : "Remove segment"
            }
          >
            <TextField
              label="Label"
              size="small"
              className="flex-1 min-w-[140px]"
              {...form.register(`segments.${index}.label` as const)}
              error={!!form.formState.errors.segments?.[index]?.label}
              helperText={
                form.formState.errors.segments?.[index]?.label?.message
              }
            />
            <TextField
              label="Weight"
              type="number"
              size="small"
              className="w-24"
              {...form.register(`segments.${index}.weight` as const, {
                valueAsNumber: true,
              })}
              error={!!form.formState.errors.segments?.[index]?.weight}
              helperText={
                form.formState.errors.segments?.[index]?.weight?.message
              }
            />
            <Box className="flex flex-col gap-1">
              <Box className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-300 bg-white h-10">
                <input
                  type="color"
                  className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                  {...form.register(`segments.${index}.color` as const)}
                />
                <Typography
                  variant="caption"
                  className="!font-mono text-gray-600 uppercase"
                >
                  {form.watch(`segments.${index}.color`) || "#000000"}
                </Typography>
              </Box>
            </Box>
          </FieldRow>
        ))}

        {form.formState.errors.segments?.root?.message && (
          <Typography variant="caption" color="error">
            {form.formState.errors.segments.root.message}
          </Typography>
        )}

        {segmentsFields.length < 12 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={() =>
              appendSegment({ label: "", weight: 0, color: "#6366f1" })
            }
            className="!self-start !rounded-lg !border-dashed !border-gray-300 !text-gray-600 hover:!border-indigo-400 hover:!text-indigo-600"
          >
            Add Segment
          </Button>
        )}
      </SectionCard>

      <SectionCard
        icon={<SavingsRounded fontSize="small" />}
        title="Spin Settings"
        subtitle="Cost and usage limits per user"
      >
        <Box className="grid grid-cols-2 gap-6">
          <TextField
            label="Spin Cost"
            type="number"
            fullWidth
            inputProps={{ min: 0 }}
            {...form.register("spinCost", { valueAsNumber: true })}
            error={!!form.formState.errors.spinCost}
            helperText={
              form.formState.errors.spinCost?.message ??
              "Coins deducted per spin"
            }
          />
          <TextField
            label="Max Spins Per User"
            type="number"
            fullWidth
            inputProps={{ min: 1 }}
            {...form.register("maxSpinsPerUser", { valueAsNumber: true })}
            error={!!form.formState.errors.maxSpinsPerUser}
            helperText={
              form.formState.errors.maxSpinsPerUser?.message ?? "0 = unlimited"
            }
          />
        </Box>
      </SectionCard>

      <SectionCard
        icon={<EmojiEventsRounded fontSize="small" />}
        title="Prizes"
        subtitle={`${prizeCount} prize${prizeCount !== 1 ? "s" : ""} configured`}
      >
        {prizesFields.map((field, index) => {
          const prizeType = prizes?.[index]?.prizeType;
          const isNothing = prizeType === "nothing";

          return (
            <Box key={field.id} className="flex flex-col gap-1">
              <FieldRow
                removeDisabled={prizesFields.length <= 1}
                index={index}
                onRemove={() => removePrize(index)}
                removeTooltip="Remove prize"
              >
                <TextField
                  label="Prize Name"
                  placeholder="e.g. 100 Coins"
                  size="small"
                  className="flex-1 min-w-[140px]"
                  {...form.register(`prizes.${index}.name` as const)}
                  error={!!form.formState.errors.prizes?.[index]?.name}
                  helperText={
                    form.formState.errors.prizes?.[index]?.name?.message
                  }
                />
                <TextField
                  select
                  label="Type"
                  size="small"
                  className="w-32"
                  defaultValue="nothing"
                  {...form.register(`prizes.${index}.prizeType` as const)}
                >
                  <MenuItem value="nothing">
                    <Box className="flex items-center gap-2">Nothing</Box>
                  </MenuItem>
                  <MenuItem value="coins">
                    <Box className="flex items-center gap-2">Coins</Box>
                  </MenuItem>
                  <MenuItem value="item">
                    <Box className="flex items-center gap-2">Item</Box>
                  </MenuItem>
                </TextField>
                <TextField
                  label="Amount"
                  type="number"
                  size="small"
                  className="w-28"
                  disabled={isNothing}
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
              </FieldRow>
              {form.formState.errors?.prizes?.root?.message && (
                <Typography variant="caption" color="error" className="pl-10">
                  {form.formState.errors.prizes.root.message}
                </Typography>
              )}
            </Box>
          );
        })}

        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={() =>
            appendPrize({ name: "", prizeType: "nothing", prizeAmount: 0 })
          }
          className="!self-start !rounded-lg !border-dashed !border-gray-300 !text-gray-600 "
        >
          Add Prize
        </Button>
      </SectionCard>

      <Box className="flex justify-end gap-3 pt-2">
        <Button
          variant="outlined"
          size="large"
          className="!rounded-xl !px-6 !text-gray-600 !border-gray-300"
          onClick={() => form.reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          className="!rounded-xl !px-8 ! !shadow-md !shadow-indigo-200"
        >
          {isSubmitting ? "Saving…" : "Save Wheel"}
        </Button>
      </Box>
    </form>
  );
};
