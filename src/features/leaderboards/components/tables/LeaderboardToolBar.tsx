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
import { Add, CancelOutlined } from "@mui/icons-material";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { useUpdateLeaderboardStatus } from "@/features/leaderboards/hooks/useLeaderboard";
import { useNotification } from "@/shared/providers/useNotification";
import { useState } from "react";
import { StatusFormatter } from "@/shared/formatters";
import { makeStyles } from "@mui/styles";

const LeaderboardToolBar = () => {
  const { setUrlParams } = useQueryParams();
  const { mutateAsync } = useUpdateLeaderboardStatus();
  const { notify } = useNotification();
  const classes = useStyles();

  const { selectedRowIds, clearSelectedRows } = useServerTable();

  const [status, setStatus] = useState<"draft" | "active" | "">("");

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

  const hasSelection = selectedRowIds.length > 0;

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setUrlParams({ createLeaderboard: "true" })}
      >
        Create
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

export default LeaderboardToolBar;

export const useStyles = makeStyles({
  select: {
    "& .MuiInputBase-root": {
      height: "37px !important",
    },
  },
});
