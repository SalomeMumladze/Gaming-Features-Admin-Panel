import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DataGrid,
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridColDef,
} from "@mui/x-data-grid";
import { Alert, Box } from "@mui/material";

import { ServerTableContext } from "./serverTable.context";

type Props<F, R> = {
  api: (params: any) => Promise<R>;
  columns: GridColDef[];
  header?: React.ComponentType;
  getRowId?: (row: any) => string | number;
  hideFooter?: boolean;
  checkboxSelection?: boolean;
};

export function ServerTableProvider<F, R>({
  api,
  columns,
  header: Header,
  getRowId,
  hideFooter = false,
  checkboxSelection = true,
}: Props<F, R>) {
  const [filters, setFilters] = useState<Partial<F>>({});

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });

  const selectedRowIds = useMemo(
    () => Array.from(rowSelectionModel.ids ?? []),
    [rowSelectionModel],
  );

  const setFilter = <K extends keyof F>(key: K, value: F[K] | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  const clearFilters = () => {
    setFilters({});

    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  const clearSelectedRows = () => {
    setRowSelectionModel({
      type: "include",
      ids: new Set(),
    });
  };

  const query = useQuery({
    queryKey: [
      "server-table",
      paginationModel.page,
      paginationModel.pageSize,
      JSON.stringify(filters),
    ],

    queryFn: () =>
      api({
        _page: paginationModel.page + 1,
        _per_page: paginationModel.pageSize,
        ...filters,
      }),

    placeholderData: (prev) => prev,
  });

  const rows = (query.data as any)?.data?.data ?? [];

  const rowCount = (query.data as any)?.data?.items ?? 0;

  const value = {
    filters,
    setFilter,
    clearFilters,

    paginationModel,
    setPaginationModel,

    rowSelectionModel,
    setRowSelectionModel,

    clearSelectedRows,
    selectedRowIds,

    data: query.data,

    isLoading: query.isLoading,
    isError: query.isError,
  };

  return (
    <ServerTableContext.Provider value={value}>
      {Header && <Header />}

      <Box>
        {query.isError ? (
          <Alert severity="error">Failed to load table data</Alert>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            loading={query.isLoading}
            checkboxSelection={checkboxSelection}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              setPaginationModel(model);
            }}
            rowCount={rowCount}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            disableColumnMenu
            hideFooter={hideFooter}
            rowSelectionModel={rowSelectionModel}
            disableRowSelectionExcludeModel
            onRowSelectionModelChange={(model) => {
              setRowSelectionModel(model);
            }}
          />
        )}
      </Box>
    </ServerTableContext.Provider>
  );
}
