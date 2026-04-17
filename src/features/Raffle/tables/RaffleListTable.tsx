import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useRaffles, useDeleteRaffle } from "../hooks/useRaffleManagement";
import useQueryParams from "@/shared/providers/useQueryParams";
import { useNotification } from "@/shared/providers/useNotification";
import type { GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  DateFormatter,
  StatusFormatter,
  TableActionsFormatter,
} from "@/shared/formatters";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/paths";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { RAFFLE_STATUSES } from "../constants";
import { ServerDataTable } from "@/shared/components/ServerDataTable";
import { TableCellWithTooltip } from "@/shared/components/InfoTooltipLabel";
import type { RaffleStatus } from "../types/raffle.types";

export const RaffleListTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterStatus, setFilterStatus] = useState<RaffleStatus | "">("");
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { setUrlParams } = useQueryParams();

  const deleteRaffle = useDeleteRaffle();
  const { data, isPending, isError } = useRaffles({
    _page: paginationModel.page + 1,
    _per_page: paginationModel.pageSize,
    ...(filterStatus ? { status: filterStatus } : {}),
    ...(filterStartDate ? { startDate_gte: filterStartDate } : {}),
    ...(filterEndDate ? { endDate_lte: filterEndDate } : {}),
  });

  const handleBulkToggle = () => setSelectedIds([]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <TableCellWithTooltip
          value={params.value}
          description={params.row.description}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: (params) => <StatusFormatter status={params.value} />,
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
      <Box display="flex " gap={2} mb={2} flexWrap="wrap" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<Add />}
          className="!capitalize w-fit h-14"
          onClick={() =>
            setUrlParams({
              createRaffle: true,
            })
          }
        >
          Create Raffle
        </Button>

        <StatusesSelector
          value={filterStatus}
          className="w-44"
          label="Status Filter"
          allowNull
          statuses={RAFFLE_STATUSES}
          onChange={(value) => setFilterStatus(value)}
        />

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

      <ServerDataTable
        rows={(!isPending && data.data) ?? []}
        columns={columns}
        rowCount={!isPending && data.items}
        loading={isPending}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noRowsOverlay={
          isError ? (
            <Box color="error.main">Failed to load data</Box>
          ) : undefined
        }
      />
    </Box>
  );
};
