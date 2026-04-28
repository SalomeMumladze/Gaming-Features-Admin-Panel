import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
} from "@mui/material";
import { StatusFormatter } from "@/shared/formatters";

export type Status = string;

interface StatusesSelectorProps {
  value: Status | "" | null | undefined;
  onChange: (value: Status | "") => void;
  label?: string;
  className?: string;
  allowNull?: boolean;
  statuses: string[];
  error?: boolean;
  helperText?: string;
}

export const StatusesSelector: React.FC<StatusesSelectorProps> = ({
  value,
  onChange,
  label = "Choose Status",
  allowNull = false,
  className = "w-full h-full",
  statuses,
  error,
  helperText,
}) => {
  return (
    <FormControl className={className} error={error}>
      <InputLabel>{label}</InputLabel>

      <Select
        value={value ?? ""}
        label={label}
        className="h-full"
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => {
          if (!selected) return allowNull ? "None" : "";
          return <StatusFormatter status={selected} />;
        }}
      >
        {allowNull && <MenuItem value="">None</MenuItem>}

        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            <Box display="flex" alignItems="center">
              <StatusFormatter status={status} />
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
