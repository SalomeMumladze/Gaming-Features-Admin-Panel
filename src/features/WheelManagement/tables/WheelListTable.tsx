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
import { useWheelsManagement } from "../hooks/useWheelManagement";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { useNotification } from "@/shared/hooks/useNotification";
import { SegmentsPreview } from "../components/SegmentsPreview";
import {
  DateFormatter,
  StatusFormatter,
  TableActionsFormatter,
} from "@/shared/formatters";
import { useNavigate } from "react-router-dom";
import type { GridColDef } from "@mui/x-data-grid";

const statuses = ["draft", "active", "drawn", "cancelled"] as const;

export const WheelListTable: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { setUrlParams } = useQueryParams();

  const { deleteWheel } = useWheelsManagement();
  const { wheels } = useWheelsManagement({
    _page: paginationModel.page,
    _per_page: paginationModel.pageSize,
    status: filterStatus || undefined,
  });

  const handleBulkToggle = () => setSelectedIds([]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Wheel Preview",
      flex: 1,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-4 flex-shrink-0 shadow-sm"
            style={{
              backgroundColor: params.row.backgroundColor,
              borderColor: params.row.borderColor,
            }}
          />
          <div className="flex items-center gap-2">
            <span> {params.value}</span>
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
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value as string;
        const statusStyles: Record<string, string> = {
          active: "bg-emerald-100 text-emerald-700 border-emerald-200",
          draft: "bg-slate-100 text-slate-600 border-slate-200",
          drawn: "bg-blue-100 text-blue-700 border-blue-200",
          cancelled: "bg-rose-100 text-rose-700 border-rose-200",
        };

        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${statusStyles[status] || statusStyles.draft}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      field: "maxSpinsPerUser",
      headerName: "Max Spins/User",
      minWidth: 120,
      type: "number",
    },
    {
      field: "segments",
      headerName: "Segments & Prizes",
      width: 200,
      renderCell: (params) => (
        <SegmentsPreview segments={params.row.segments} />
      ),
    },
    {
      field: "spinCost",
      headerName: "Spin cost",
      width: 150,
      type: "number",
    },

    {
      field: "createdAt",
      headerName: "Create Date",
      minWidth: 150,
      renderCell: (params) => <DateFormatter value={params.value} />,
    },
    {
      field: "updatedAt",
      headerName: "Update Date",
      minWidth: 150,
      renderCell: (params) => <DateFormatter value={params.value} />,
    },
    {
      field: "actions",
      headerName: "actions",
      sortable: false,
      width: 120,
      align: "right",
      renderCell: (params) => (
        <TableActionsFormatter
          id={params.row.id}
          editTooltip="Edit wheel"
          infoTooltip="View wheel info"
          deleteTooltip="Delete wheel"
          confirmText="Do you really want to delete this wheel?"
          onEditClick={() =>
            setUrlParams({
              wheelId: params.row.id,
            })
          }
          onInfoClick={() => navigate(`/wheels/${params.row.id}`)}
          onDeleteClick={(id) =>
            deleteWheel.mutate(id, {
              onSuccess: () =>
                notify(`${params.row.name} deleted successfully`, "success"),
              onError: () => notify("Failed to delete wheel!", "error"),
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
              createWheel: true,
            })
          }
        >
          Create wheels
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
          rows={wheels.data?.items ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          rowCount={wheels.data?.totalRows}
          disableRowSelectionOnClick
          disableColumnMenu
          paginationMode="server"
          pageSizeOptions={[10, 25, 50, 100, 300]}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={wheels.isLoading}
        />
      </div>
    </Box>
  );
};
