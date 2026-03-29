import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SvgIcon,
  FormHelperText,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { ScoringTypeFormatter } from "@/shared/formatters";

export type ScoringTypes = "points" | "wins" | "wagered";

interface ScoringTypeSelectorProps {
  value: ScoringTypes | "" | null;
  onChange: (value: ScoringTypes | null) => void;
  label?: string;
  fullWidth?: boolean;
  allowNull?: boolean;
  error?: boolean;
  helperText?: string;
  options?: ScoringTypes[];
}

export const ScoringTypeSelector: React.FC<ScoringTypeSelectorProps> = ({
  value,
  onChange,
  label = "Scoring Type",
  fullWidth = true,
  allowNull = true,
  error,
  helperText,
  options = ["points", "wins", "wagered"],
}) => {
  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value ?? ""}
        label={label}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? null : (val as ScoringTypes));
        }}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Box display="flex" alignItems="center" gap={0.5}>
                <SvgIcon fontSize="small">
                  <Close />
                </SvgIcon>
                None
              </Box>
            );
          }
          return <ScoringTypeFormatter value={selected} />;
        }}
      >
        {allowNull && (
          <MenuItem value="">
            <Box display="flex" alignItems="center" gap={0.5}>
              <Close fontSize="small" color="action" />
              None
            </Box>
          </MenuItem>
        )}

        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            <ScoringTypeFormatter value={opt} />
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
