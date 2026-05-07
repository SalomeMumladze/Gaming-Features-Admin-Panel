import type { GridColDef } from "@mui/x-data-grid";
import {
  DateFormatter,
  StatusFormatter,
  TableActionsFormatter,
  NumberFormatter,
} from "@/shared/formatters";
import { TableCellWithTooltip } from "@/shared/components/InfoTooltipLabel";
import { ScoringTypeFormatter } from "../ScoringTypeFormatter";

export const getLeaderboardColumns = ({
  onEdit,
  onDelete,
  onView,
}: any): GridColDef[] => [
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    minWidth: 200,
    renderCell: (p) => (
      <TableCellWithTooltip value={p.value} description={p.row.description} />
    ),
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 150,
    renderCell: (p) => <StatusFormatter status={p.value} />,
  },
  {
    field: "scoringType",
    headerName: "Scoring Type",
    minWidth: 150,
    renderCell: (p) => <ScoringTypeFormatter value={p.value} />,
  },
  {
    field: "maxParticipants",
    headerName: "Max Participants",
    minWidth: 150,
    renderCell: (p) => <NumberFormatter value={p.value} />,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    minWidth: 200,
    renderCell: (p) => <DateFormatter value={p.value} />,
  },
  {
    field: "endDate",
    headerName: "End Date",
    minWidth: 200,
    renderCell: (p) => <DateFormatter value={p.value} />,
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
