import { useEffect, useState } from "react";
import { Button, Card, TextField } from "@mui/material";
import { FilterList, RefreshOutlined } from "@mui/icons-material";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { WHEEL_STATUSES } from "../constants";
import { SavedFilters } from "@/shared/components/tables/components/SavedFilters";

export const WheelFiltersPanel = () => {
  const { filters, setFilter, clearFilters } = useServerTable();
  const [defaultFilters, setDefaultFilters] = useState({
    status: filters?.status ?? null,
    spinCost: filters?.ticketPrice ?? null,
    maxTicketsPerUser: filters?.maxTicketsPerUser ?? null,
  });

  useEffect(() => {
    setDefaultFilters(filters);
  }, [filters]);

  const handleFilter = () => {
    setFilter(defaultFilters);
  };

  const handleReset = () => {
    const resetValues = {
      status: null,
      spinCost: null,
      maxTicketsPerUser: null,
    };

    setDefaultFilters(resetValues);
    clearFilters();
  };

  return (
    <Card sx={{ p: 2 }}>
      <div className="grid gap-2 mb-2">
        <StatusesSelector
          value={defaultFilters.status}
          label="Status Filter"
          allowNull
          statuses={[...WHEEL_STATUSES]}
          onChange={(v) =>
            setDefaultFilters((prev) => ({
              ...prev,
              status: v,
            }))
          }
        />
        <TextField
          label="Max.Tickets Per User"
          type="number"
          value={defaultFilters.maxTicketsPerUser || ""}
          onChange={(e) =>
            setDefaultFilters((prev) => ({
              ...prev,
              maxTicketsPerUser: e.target.value,
            }))
          }
        />
        <TextField
          label="Spin Cost"
          type="number"
          value={defaultFilters.spinCost || ""}
          onChange={(e) =>
            setDefaultFilters((prev) => ({
              ...prev,
              spinCost: e.target.value,
            }))
          }
        />
      </div>

      <div className="flex gap-2 items-center w-full justify-between">
        <Button
          color="error"
          variant="outlined"
          size="small"
          onClick={handleReset}
          startIcon={<RefreshOutlined />}
        >
          Reset
        </Button>
        <div className="flex flex-wrap gap-2 w-fit">
          <SavedFilters tableName="raffles" filters={filters} />

          <Button
            variant="contained"
            size="small"
            startIcon={<FilterList />}
            onClick={handleFilter}
          >
            Filter
          </Button>
        </div>
      </div>
    </Card>
  );
};
