import React, { useState, createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

/**
 * CONTEXT
 */
export const ServerTableContext = createContext<any>(null);

export function useServerTable() {
  const ctx = React.useContext(ServerTableContext);
  if (!ctx)
    throw new Error("useServerTable must be inside ServerTableProvider");
  return ctx;
}

/**
 * PROVIDER PROPS
 */
type Props<F, R> = {
  api: (params: any) => Promise<R>;
  columns: any[];
  header?: React.ComponentType<any>;
  getRowId?: (row: any) => string | number;
  hideFooter?: boolean;
  checkboxSelection?: boolean;
};

/**
 * PROVIDER
 */
export function ServerTableProvider<F, R>({
  api,
  columns,
  header: Header,
  getRowId,
  hideFooter = false,
  checkboxSelection = true,
}: Props<F, R>) {
  const [filters, setFilters] = useState<Partial<F>>({});
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /**
   * FILTERS
   */
  const setFilter = <K extends keyof F>(key: K, value: F[K] | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => setFilters({});

  /**
   * API CALL (SERVER STATE)
   */
  const query = useQuery({
    queryKey: ["server-table", filters, pagination],
    queryFn: () =>
      api({
        _page: pagination.page + 1,
        _per_page: pagination.pageSize,
        ...filters,
      }),
  });

  const rows = (query.data as any)?.data?.data ?? [];
  const totals = (query.data as any)?.data?.items ?? [];

  /**
   * CONTEXT VALUE
   */
  const value = {
    filters,
    setFilter,
    clearFilters,
    pagination,
    setPagination,
    selectedIds,
    setSelectedIds,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };

  return (
    <ServerTableContext.Provider value={value}>
      {Header && <Header />}

      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          loading={query.isLoading}
          checkboxSelection={checkboxSelection}
          paginationMode="server"
          paginationModel={pagination}
          rowCount={totals}
          onPaginationModelChange={setPagination}
          onRowSelectionModelChange={(data) =>
            setSelectedIds(Array.from(data.ids))
          }
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          disableColumnMenu
          hideFooter={hideFooter}
        />
      </Box>
    </ServerTableContext.Provider>
  );
}
