import { useState } from "react";
import {
  Button,
  Box,
  Chip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useNotification } from "@/shared/providers/useNotification";
import { Add, CancelOutlined } from "@mui/icons-material";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { StatusFormatter } from "@/shared/formatters";
import { makeStyles } from "@mui/styles";
import { useUpdateRaffleStatus } from "../hooks/useRaffleManagement";

const RaffleToolbar = () => {
  const classes = useStyles();
  const { mutateAsync } = useUpdateRaffleStatus();
  const { selectedRowIds, clearSelectedRows } = useServerTable();
  const [status, setStatus] = useState<"draft" | "active" | "">("");
  const { notify } = useNotification();
  const { setUrlParams } = useQueryParams();

  const hasSelection = selectedRowIds.length > 0;

  const handleBulkChange = async (value: "draft" | "active") => {
    try {
      await Promise.all(
        selectedRowIds.map((id: string) =>
          mutateAsync({ id: String(id), status: value }),
        ),
      );

      notify("Status updated successfully", "success");

      clearSelectedRows();
      setStatus("");
    } catch {
      notify("Failed to update status", "error");
    }
  };

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() =>
          setUrlParams({
            createRaffle: "true",
          })
        }
      >
        Create Raffle
      </Button>

      {hasSelection && (
        <>
          <Divider
            orientation="vertical"
            flexItem
            className="sm:block hidden"
          />

          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Chip
              label={`${selectedRowIds.length} selected`}
              size="small"
              sx={{ fontWeight: 500 }}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>

              <Select
                className={classes.select}
                value={status}
                label="Status"
                onChange={(e) => {
                  const value = e.target.value as "draft" | "active";

                  setStatus(value);

                  if (value) handleBulkChange(value);
                }}
              >
                <MenuItem value="active">
                  <StatusFormatter status="active" />
                </MenuItem>

                <MenuItem value="draft">
                  <StatusFormatter status="draft" />
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                clearSelectedRows();
                setStatus("");
              }}
              sx={{
                minWidth: "fit-content",
                height: 36,
              }}
            >
              <CancelOutlined sx={{ width: 20 }} />
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default RaffleToolbar;

export const useStyles = makeStyles({
  select: {
    "& .MuiInputBase-root": {
      height: "34px !important",
    },
  },
});
