import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import { Add, Help } from "@mui/icons-material";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { useNotification } from "@/shared/hooks/useNotification";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  DateFormatter,
  StatusFormatter,
  TableActionsFormatter,
} from "@/shared/formatters";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants/routes";

const statuses = ["draft", "active", "drawn", "cancelled"] as const;

export const RaffleListTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { setUrlParams } = useQueryParams();

  const { deleteRaffle } = useRaffleManagement();
  const { raffles } = useRaffleManagement({
    _page: paginationModel.page + 1,
    _per_page: paginationModel.pageSize,
    status: filterStatus || undefined,
    startDate_gte: filterStartDate || undefined,
    endDate_lte: filterEndDate || undefined,
  });

  const handleBulkToggle = () => setSelectedIds([]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<string>) => (
        <div className="flex items-center gap-2">
          <span>{params.value}</span>
          {params.row.description && (
            <Tooltip
              disableInteractive
              title={params.row.description ?? ""}
              className="cursor-pointer"
            >
              <Help fontSize="small" color="info" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: (params) => <StatusFormatter value={params.value} />,
    },
    {
      field: "ticketPrice",
      headerName: "Ticket Price",
      minWidth: 120,
      type: "number",
    },
    {
      field: "maxTicketsPerUser",
      headerName: "Max Tickets/User",
      minWidth: 150,
      type: "number",
    },
    {
      field: "totalTicketLimit",
      headerName: "Total Ticket Limit",
      minWidth: 150,
      type: "number",
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 150,
      renderCell: (params) => <DateFormatter value={params.value} />,
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 150,
      renderCell: (params) => <DateFormatter value={params.value} />,
    },
    {
      field: "drawDate",
      headerName: "Draw Date",
      minWidth: 150,
      renderCell: (params) => <DateFormatter value={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <TableActionsFormatter
          id={params.row.id}
          showEdit={params.row.status === "drawn" ? false : true}
          editTooltip="Edit raffle"
          infoTooltip="View raffle info"
          deleteTooltip="Delete raffle"
          confirmText="Do you really want to delete this raffle?"
          onEditClick={() =>
            setUrlParams({
              raffleId: params.row.id,
            })
          }
          onInfoClick={() => navigate(ROUTE_PATHS.raffleDetails(params.row.id))}
          onDeleteClick={(id) =>
            deleteRaffle.mutate(id, {
              onSuccess: () =>
                notify(`${params.row.name} deleted successfully`, "success"),
              onError: () => notify("Failed to delete raffle!", "error"),
            })
          }
        />
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<Add />}
          className="!capitalize !h-10"
          onClick={() =>
            setUrlParams({
              createRaffle: true,
            })
          }
        >
          Create Raffle
        </Button>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            label="Status Filter"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Start Date"
          value={filterStartDate ? dayjs(filterStartDate) : null}
          format="DD MMM, YYYY"
          onChange={(date: Dayjs | null) =>
            setFilterStartDate(date ? date.toISOString() : null)
          }
        />
        <DatePicker
          label="End Date"
          value={filterEndDate ? dayjs(filterEndDate) : null}
          format="DD MMM, YYYY"
          onChange={(date: Dayjs | null) =>
            setFilterEndDate(date ? date.toISOString() : null)
          }
        />

        {selectedIds.length > 0 && (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => handleBulkToggle()}
            >
              Set Active
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => handleBulkToggle()}
            >
              Set Draft
            </Button>
          </Box>
        )}
      </Box>

      <div style={{ maxHeight: 630, width: "100%" }}>
        <DataGrid
          rows={raffles.items ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          rowCount={raffles.totalRows}
          disableRowSelectionOnClick
          disableColumnMenu
          paginationMode="server"
          pageSizeOptions={[10, 25, 50, 100, 300]}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={raffles.isLoading}
        />
      </div>
    </Box>
  );
};
