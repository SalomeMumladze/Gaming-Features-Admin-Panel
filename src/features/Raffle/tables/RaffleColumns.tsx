import type { GridColDef } from "@mui/x-data-grid";
import {
  DateFormatter,
  StatusFormatter,
  TableActionsFormatter,
} from "@/shared/formatters";
import { TableCellWithTooltip } from "@/shared/components/InfoTooltipLabel";

export const getRafflceColumns = ({
  onEdit,
  onDelete,
  onView,
}: any): GridColDef[] => [
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
