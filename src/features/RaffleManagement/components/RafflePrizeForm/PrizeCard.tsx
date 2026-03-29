import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import { Clear, AutoAwesome } from "@mui/icons-material";
import type { RafflePrize } from "../hooks/useRaffleManagement";
import { TYPE_META } from "../Config";
import { FieldRow } from "@/shared/components/FieldRow";

interface PrizeCardProps {
  id: string;
  prize: RafflePrize & { imagePreview?: string };
  index: number;
  canDelete: boolean;
  onChange: (
    id: string,
    field: keyof RafflePrize,
    value: string | number | File | null,
  ) => void;
  onRemove: (id: string) => void;
  onRemoveImage: (id: string) => void;
  errors: unknown;
  register: unknown;
}

const PrizeCard: React.FC<PrizeCardProps> = ({
  prize,
  index,
  canDelete,
  onChange,
  onRemove,
  onRemoveImage,
  errors,
}) => {
  return (
    <FieldRow
      removeDisabled={!canDelete}
      index={index}
      onRemove={() => onRemove(prize.id)}
      removeTooltip="Remove prize"
    >
      <div>
        <div className="md:flex grid gap-3">
          <TextField
            label="Prize Name"
            value={prize.name}
            error={errors?.name}
            helperText={errors?.name?.message}
            onChange={(e) => onChange(prize.id, "name", e.target.value)}
            fullWidth
            size="small"
            placeholder="e.g. Golden Ticket"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={prize.type}
              onChange={(e) =>
                onChange(
                  prize.id,
                  "type",
                  e.target.value as RafflePrize["type"],
                )
              }
              label="Type"
            >
              {(Object.keys(TYPE_META) as RafflePrize["type"][]).map((t) => {
                const Icon = TYPE_META[t].icon;
                return (
                  <MenuItem key={t} value={t}>
                    <span className="flex items-center gap-2">
                      <Box className="flex" sx={{ color: TYPE_META[t].color }}>
                        <Icon />
                      </Box>
                      <span>{TYPE_META[t].label}</span>
                    </span>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            type="number"
            value={prize.amount}
            onChange={(e) =>
              onChange(prize.id, "amount", Number(e.target.value))
            }
            fullWidth
            size="small"
          />

          <TextField
            label="Quantity"
            type="number"
            value={prize.quantity}
            onChange={(e) =>
              onChange(prize.id, "quantity", Number(e.target.value))
            }
            fullWidth
            size="small"
            error={errors?.quantity}
            helperText={errors?.quantity?.message}
          />
        </div>
        <div className="m-2 rounded-xl border border-dashed border-gray-300 p-2 flex items-center justify-center">
          {!prize.imagePreview ? (
            <label className="flex flex-col items-center justify-center cursor-pointer gap-2  w-full text-center">
              <AutoAwesome
                sx={{ color: "rgba(201,168,76,0.4)", fontSize: 16 }}
              />
              <span className="text-xs text-gray-600">Upload image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0])
                    onChange(prize.id, "imageUrl", e.target.files[0]);
                }}
              />
            </label>
          ) : (
            <div className="flex items-center gap-4 p-2">
              <img
                src={prize.imagePreview}
                alt="Preview"
                className="rounded-lg object-cover w-24 h-24 border border-gray-300"
              />
              <Tooltip title="Remove image">
                <IconButton
                  size="small"
                  onClick={() => onRemoveImage(prize.id)}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </FieldRow>
  );
};

export default PrizeCard;
