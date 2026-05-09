import { TableFilterButton } from "./TableFilterButton";
import { SavedFilterList } from "./SavedFilters/SavedFilterList";
import { TableColumnCustomize } from "./TableColumnCustomize";
import { ExportCsvButton } from "./ExportCsvButton";
import { TableSearch } from "./TableSearch";
import { useServerTable } from "@/shared/components/tables/serverTable.context";

type Props = {
  filterComponent?: React.ComponentType;
};

export const ServerTableToolbar = ({
  filterComponent: filterComponent,
}: Props) => {
  const {
    disabledFilter,
    disabledSavedFilter,
    disabledColumnsControl,
    disabledExport,
    disabledSearching,
    searchLabel,
    searchKey,
  } = useServerTable();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!disabledFilter && (
        <TableFilterButton filterComponent={filterComponent} />
      )}
      {!disabledSavedFilter && <SavedFilterList />}
      {!disabledColumnsControl && <TableColumnCustomize />}
      {!disabledExport && <ExportCsvButton />}
      {!disabledSearching && (
        <TableSearch label={searchLabel} filterKey={searchKey} />
      )}
    </div>
  );
};
