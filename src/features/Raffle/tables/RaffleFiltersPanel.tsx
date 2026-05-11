import { useEffect, useState } from "react";
import { Button, Card, TextField } from "@mui/material";
import { FilterList, RefreshOutlined } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { StatusesSelector } from "@/shared/components/StatusesSelector";

import { RAFFLE_STATUSES } from "../constants";
import { SavedFilters } from "@/shared/components/tables/components/SavedFilters";

export const RaffleFiltersPanel = () => {
  const { filters, setFilter, clearFilters } = useServerTable();
  const [defaultFilters, setDefaultFilters] = useState({
    status: filters?.status ?? null,
    ticketPrice: filters?.ticketPrice ?? null,
    maxTicketsPerUser: filters?.maxTicketsPerUser ?? null,
    totalTicketLimit: filters?.totalTicketLimit ?? null,
    startDate: filters?.startDate ?? null,
    endDate: filters?.endDate ?? null,
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
      ticketPrice: null,
      maxTicketsPerUser: null,
      totalTicketLimit: null,
      startDate: null,
      endDate: null,
    };

    setDefaultFilters(resetValues);
    clearFilters();
  };

  return (
    <Card sx={{ p: 2 }}>
      <div className="grid sm:grid-cols-2 gap-2 mb-2">
        <StatusesSelector
          value={defaultFilters.status}
          label="Status Filter"
          allowNull
          statuses={[...RAFFLE_STATUSES]}
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
          label="Ticket Price"
          type="number"
          value={defaultFilters.ticketPrice || ""}
          onChange={(e) =>
            setDefaultFilters((prev) => ({
              ...prev,
              ticketPrice: e.target.value,
            }))
          }
        />
        <TextField
          label="Total Ticket Limit"
          type="number"
          value={defaultFilters.totalTicketLimit || ""}
          onChange={(e) =>
            setDefaultFilters((prev) => ({
              ...prev,
              totalTicketLimit: e.target.value,
            }))
          }
        />
        <DatePicker
          label="Start Date"
          value={
            defaultFilters.startDate ? dayjs(defaultFilters.startDate) : null
          }
          onChange={(v) =>
            setDefaultFilters((prev) => ({
              ...prev,
              startDate: v ? v.format("YYYY-MM-DD") : null,
            }))
          }
        />
        <DatePicker
          label="End Date"
          value={defaultFilters.endDate ? dayjs(defaultFilters.endDate) : null}
          onChange={(v) =>
            setDefaultFilters((prev) => ({
              ...prev,
              endDate: v ? v.format("YYYY-MM-DD") : null,
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
