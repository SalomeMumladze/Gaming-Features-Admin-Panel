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
import { ServerTableToolbar } from "./components/ServerTableToolbar";

type Props<R> = {
  tableName: string;
  api: (params: any) => Promise<R>;
  columns: GridColDef[];
  header?: React.ComponentType;
  filterComponent?: React.ComponentType;
  getRowId?: (row: any) => string | number;

  disabledSavedFilter?: boolean;
  disabledFilter?: boolean;
  disabledExport?: boolean;

  disabledSearching?: boolean;
  searchKey?: string;
  searchLabel?: string;

  disabledColumnsControl?: boolean;
  hideFooter?: boolean;
  checkboxSelection?: boolean;
};

type ColumnConfig = {
  field: string;
  visible: boolean;
};

export function ServerTableProvider<R>({
  tableName,
  api,
  columns,
  header: Header,

  filterComponent,
  getRowId,
  hideFooter = false,
  checkboxSelection = true,
  disabledSavedFilter = false,
  disabledExport = false,

  searchKey = "name",
  searchLabel,
  disabledSearching = false,

  disabledColumnsControl = false,
  disabledFilter = false,
}: Props<R>) {
  const STORAGE_KEY = "server_table_columns";

  const [filters, setFilters] = useState<Record<string, any>>({});

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

  const getInitialColumns = (): ColumnConfig[] =>
    columns.map((c) => ({
      field: c.field,
      visible: true,
    }));

  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : getInitialColumns();
  });

  const toggleColumn = (field: string) => {
    setColumnConfig((prev) => {
      const updated = prev.map((col) =>
        col.field === field ? { ...col, visible: !col.visible } : col,
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => {
      const config = columnConfig.find((c) => c.field === col.field);

      return config ? config.visible : true;
    });
  }, [columns, columnConfig]);

  const setFilter = (key: string | Record<string, any>, value?: any) => {
    if (typeof key === "object") {
      setFilters((prev) => ({
        ...prev,
        ...key,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }

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
    tableName,

    filters,
    setFilter,
    clearFilters,
    disabledFilter,
    disabledSavedFilter,
    disabledColumnsControl,
    disabledExport,

    searchKey,
    searchLabel,
    disabledSearching,

    paginationModel,
    setPaginationModel,

    rowSelectionModel,
    setRowSelectionModel,

    clearSelectedRows,
    selectedRowIds,

    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,

    columns,
    columnConfig,
    toggleColumn,
  };

  return (
    <ServerTableContext.Provider value={value}>
      <div className="flex items-center justify-between flex-wrap gap-2 py-4 ">
        {Header && <Header />}
        <ServerTableToolbar filterComponent={filterComponent} />
      </div>
      <Box>
        {query.isError ? (
          <Alert severity="error">Failed to load table data</Alert>
        ) : (
          <DataGrid
            rows={rows}
            columns={visibleColumns}
            getRowId={getRowId}
            loading={query.isLoading}
            checkboxSelection={checkboxSelection}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={rowCount}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            disableColumnMenu
            hideFooter={hideFooter}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={setRowSelectionModel}
            sx={{ maxHeight: 630 }}
          />
        )}
      </Box>
    </ServerTableContext.Provider>
  );
}
