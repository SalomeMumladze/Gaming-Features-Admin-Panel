import { useState } from "react";
import { Button } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import type { GridColDef } from "@mui/x-data-grid";
import { useServerTable } from "@/shared/components/tables/serverTable.context";

type ColumnConfig = {
  field: string;
  visible: boolean;
};

export const ExportCsvButton = () => {
  const { data, columns, columnConfig, tableName } = useServerTable();

  const [loading, setLoading] = useState(false);

  const rows = (data as any)?.data?.data ?? [];

  const visibleFields = (columnConfig as ColumnConfig[])
    .filter((c) => c.visible)
    .map((c) => c.field);

  const visibleColumns: GridColDef[] = (columns as GridColDef[]).filter(
    (col) => visibleFields.includes(col.field) && col.field !== "actions",
  );

  const handleExport = async () => {
    try {
      setLoading(true);

      await new Promise((r) => setTimeout(r, 50));

      const formattedRows = rows.map((row: Record<string, unknown>) => {
        const obj: Record<string, unknown> = {};

        visibleColumns.forEach((col: GridColDef) => {
          obj[col.headerName || col.field] = row[col.field];
        });

        return obj;
      });

      const csvConfig = mkConfig({
        filename: `${tableName}-export`,
        useKeysAsHeaders: true,
      });

      const csv = generateCsv(csvConfig)(formattedRows);
      download(csvConfig)(csv);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? "Exporting..." : "Export CSV"}
    </Button>
  );
};
