import { useState, useEffect } from "react";
import { Button, Box, TextField, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { useUpdateLeaderboardStatus } from "../../hooks/useLeaderboard";
import { useNotification } from "@/shared/providers/useNotification";
import { LeaderboardFiltersPanel } from "../tables/LeaderboardFiltersPanel";

const LeaderboardToolBar = () => {
  const { setUrlParams } = useQueryParams();
  const { mutateAsync } = useUpdateLeaderboardStatus();
  const { notify } = useNotification();

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
    <div className="bg-white/10 p-2 flex gap-2 items-center flex-wrap">
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
        className="max-w-48 w-full"
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        InputProps={{
          endAdornment: titleLoading ? <CircularProgress size={14} /> : null,
        }}
      />
      <LeaderboardFiltersPanel />

      {selectedRowIds.length > 0 && (
        <Box display="flex" alignItems="center" gap={2} px={2}>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleBulkChange("active")}
          >
            Set Active
          </Button>

          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={() => handleBulkChange("draft")}
          >
            Set Draft
          </Button>

          <Button size="small" onClick={() => clearSelectedRows()}>
            Clear
          </Button>
        </Box>
      )}
    </div>
  );
};

export default LeaderboardToolBar;
