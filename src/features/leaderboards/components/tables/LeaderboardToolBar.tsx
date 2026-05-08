import { useState, useEffect } from "react";
import {
  Button,
  Box,
  TextField,
  CircularProgress,
  Chip,
  ButtonGroup,
  Divider,
} from "@mui/material";
import { Add, FiberManualRecord, CancelOutlined } from "@mui/icons-material";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { useUpdateLeaderboardStatus } from "../../hooks/useLeaderboard";
import { useNotification } from "@/shared/providers/useNotification";
import { LeaderboardFiltersPanel } from "../tables/LeaderboardFiltersPanel";
import { makeStyles } from "@mui/styles";

const LeaderboardToolBar = () => {
  const { setUrlParams } = useQueryParams();
  const { mutateAsync } = useUpdateLeaderboardStatus();
  const { notify } = useNotification();
  const classes = useStyles();

  const { filters, setFilter, selectedRowIds, clearSelectedRows } =
    useServerTable();

  const [titleInput, setTitleInput] = useState(filters?.title ?? "");
  const [titleLoading, setTitleLoading] = useState(false);

  useEffect(() => {
    setTitleLoading(true);

    const timer = setTimeout(() => {
      setFilter("title", titleInput || null);
      setTitleLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [titleInput]);

  const handleBulkChange = async (status: "draft" | "active") => {
    try {
      await Promise.all(
        selectedRowIds.map((id: string) =>
          mutateAsync({ id: String(id), status }),
        ),
      );

      notify("Status updated successfully", "success");

      clearSelectedRows();
    } catch {
      notify("Failed to update status", "error");
    }
  };

  return (
    <div className="flex gap-2 py-4 px-2 items-center flex-wrap">
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setUrlParams({ createLeaderboard: "true" })}
      >
        Create
      </Button>

      <TextField
        label="Search by exact title..."
        size="small"
        className={classes.input}
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        InputProps={{
          endAdornment: titleLoading ? <CircularProgress size={14} /> : null,
        }}
      />
      <LeaderboardFiltersPanel />
      {selectedRowIds.length > 0 && (
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
            <ButtonGroup
              variant="outlined"
              color="inherit"
              className={classes.statuses}
            >
              <Button
                onClick={() => handleBulkChange("active")}
                startIcon={
                  <FiberManualRecord
                    sx={{ width: 12, color: "success.main" }}
                  />
                }
              >
                Set Active
              </Button>
              <Button
                onClick={() => handleBulkChange("draft")}
                startIcon={
                  <FiberManualRecord
                    sx={{ width: 12, color: "text.disabled" }}
                  />
                }
              >
                Set Draft
              </Button>
            </ButtonGroup>
            <Button
              variant="outlined"
              color="error"
              className={classes.cancel}
              onClick={() => clearSelectedRows()}
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
  statuses: {
    "& .MuiButton-root": {
      border: "1px solid #d0d0d0",
    },
  },
  cancel: {
    minWidth: "fit-content !important",
    height: "36px",
  },
  input: {
    maxWidth: "12rem",
    width: "100%",
    "& .MuiInputBase-input": {
      height: "20px ",
    },
  },
});
