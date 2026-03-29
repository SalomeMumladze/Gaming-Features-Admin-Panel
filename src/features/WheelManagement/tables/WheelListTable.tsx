import React, { useState } from "react";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button, Tooltip } from "@mui/material";
import { Add, Help } from "@mui/icons-material";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { useNotification } from "@/shared/hooks/useNotification";
import { SegmentsPreview } from "../components/SegmentsPreview";
import { TableActionsFormatter, StatusFormatter } from "@/shared/formatters";
import { useNavigate } from "react-router-dom";
import type { GridColDef } from "@mui/x-data-grid";
import { ROUTE_PATHS } from "@/shared/constants/routes";
import { WHEEL_STATUSES } from "../constants";
import { StatusesSelector } from "@/shared/components/StatusesSelector";
import { ServerDataTable } from "@/shared/components/ServerDataTable";

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
    _page: paginationModel.page + 1,
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
      renderCell: (params) => <StatusFormatter value={params.value} />,
    },
    {
      field: "maxSpinsPerUser",
      headerName: "Max Spins/User",
      minWidth: 120,
      type: "number",
    },
    {
      field: "segments",
      headerName: "Segments",
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
          onInfoClick={() => navigate(ROUTE_PATHS.wheelDetails(params.row.id))}
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
      <Box display="flex " gap={2} mb={2} flexWrap="wrap" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<Add />}
          className="!capitalize w-fit h-14"
          onClick={() =>
            setUrlParams({
              createWheel: true,
            })
          }
        >
          Create wheels
        </Button>
        <StatusesSelector
          statuses={WHEEL_STATUSES}
          value={filterStatus}
          allowNull
          className="w-44"
          label="Status Filter"
          onChange={(value) => setFilterStatus(value)}
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
        rows={wheels.items ?? []}
        columns={columns}
        rowCount={wheels.totalRows}
        loading={wheels.isLoading}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        getRowId={(row) => row.id}
        onSelectionModelChange={(ids) => setSelectedIds(ids as string[])}
        noRowsOverlay={
          wheels.isError ? (
            <Box color="error.main">Failed to load data</Box>
          ) : undefined
        }
      />
    </Box>
  );
};
