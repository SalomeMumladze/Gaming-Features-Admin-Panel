import type { GridColDef } from "@mui/x-data-grid";
import { StatusFormatter, TableActionsFormatter } from "@/shared/formatters";
import { TableCellWithTooltip } from "@/shared/components/InfoTooltipLabel";
import { SegmentsPreview } from "../components/SegmentsPreview";

export const getWheelColumns = ({
  onEdit,
  onDelete,
  onView,
}: any): GridColDef[] => [
  {
    field: "name",
    headerName: "Wheel Preview",
    flex: 1,
    minWidth: 250,
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
    width: 130,
    renderCell: (params) => <StatusFormatter status={params.value} />,
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
    renderCell: (params) => <SegmentsPreview segments={params.row.segments} />,
  },
  {
    field: "spinCost",
    headerName: "Spin cost",
    width: 150,
    type: "number",
  },
  {
    field: "actions",
    minWidth: 110,
    headerName: "Actions",
    renderCell: (p) => (
      <TableActionsFormatter
        id={p.row.id}
        onEditClick={() => onEdit(p.row.id)}
        onInfoClick={() => onView(p.row.id)}
        onDeleteClick={() => onDelete(p.row.id)}
      />
    ),
  },
];
