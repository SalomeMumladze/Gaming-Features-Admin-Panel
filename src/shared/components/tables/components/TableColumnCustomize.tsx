import React, { useMemo, useState } from "react";
import {
  Button,
  Popover,
  Stack,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { ViewColumn } from "@mui/icons-material";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import type { GridColDef } from "@mui/x-data-grid";

export const TableColumnCustomize = () => {
  const { columns, columnConfig, toggleColumn } = useServerTable();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const isChecked = (field: string) => {
    const config = columnConfig?.find(
      (c: { field: string; visible: boolean }) => c.field === field,
    );
    return config ? config.visible : true;
  };

  const allSelected = useMemo(() => {
    return columns.every((col: GridColDef) => isChecked(col.field));
  }, [columns, columnConfig]);

  const handleToggleAll = () => {
    columns.forEach((col: GridColDef) => {
      const checked = isChecked(col.field);

      if (allSelected && checked) {
        toggleColumn(col.field);
      }

      if (!allSelected && !checked) {
        toggleColumn(col.field);
      }
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ViewColumn />}
        onClick={handleOpen}
      >
        Columns
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
            minWidth: 250,
          },
        }}
      >
        <Stack sx={{ py: 1 }} spacing={1}>
          <FormControlLabel
            className="h-6"
            control={
              <Checkbox
                size="small"
                checked={allSelected}
                onChange={handleToggleAll}
              />
            }
            label="Select All"
          />

          <Divider />

          {columns.map((col: GridColDef) => (
            <FormControlLabel
              key={col.field}
              className="h-6"
              control={
                <Checkbox
                  size="small"
                  checked={isChecked(col.field)}
                  onChange={() => toggleColumn(col.field)}
                />
              }
              label={col.headerName || col.field}
            />
          ))}
        </Stack>
      </Popover>
    </>
  );
};
