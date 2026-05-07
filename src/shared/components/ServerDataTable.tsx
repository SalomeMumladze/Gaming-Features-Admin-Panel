import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

interface ServerDataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  rowCount: number;
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: (model: { page: number; pageSize: number }) => void;
  getRowId?: (row: T) => string | number;
  hideFooter?: boolean;
  checkboxSelection?: boolean;
  onSelectionModelChange?: (ids: (string | number)[]) => void;
  noRowsOverlay?: React.ReactNode;
  header?: React.ComponentType<any>;
  headerProps?: any;
}

export function ServerDataTable<T>({
  rows,
  columns,
  rowCount,
  loading,
  paginationModel,
  setPaginationModel,
  getRowId,
  hideFooter,
  checkboxSelection,
  onSelectionModelChange,
  noRowsOverlay,
  header,
  headerProps,
}: ServerDataTableProps<T>) {
  const Header = header;

  return (
    <Box sx={{ width: "100%" }}>
      {Header && (
        <Box mb={2}>
          <Header {...headerProps} />
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        loading={loading}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter={hideFooter}
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={(data) =>
          onSelectionModelChange?.(Array.from(data.ids))
        }
        slots={{
          noRowsOverlay: () => (
            <Box p={2} textAlign="center">
              {noRowsOverlay ?? "No Data Found"}
            </Box>
          ),
        }}
        sx={{ maxHeight: 630 }}
      />
    </Box>
  );
}
