import { useState } from "react";
import { Button, Badge, Popover, ListItemText, ListItem } from "@mui/material";
import { FilterList, RefreshOutlined } from "@mui/icons-material";
import { useServerTable } from "@/shared/components/tables/serverTable.context";

type Props = {
  filterComponent?: React.ComponentType;
};

export const TableFilterButton = ({
  filterComponent: FilterComponent,
}: Props) => {
  const { filters, clearFilters, searchKey } = useServerTable();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);

  const hasFilters = Object.entries(filters || {}).some(
    ([key, value]) =>
      key !== searchKey &&
      value !== null &&
      value !== undefined &&
      value !== "",
  );

  return (
    <>
      {hasFilters && (
        <Button
          color="error"
          variant="outlined"
          onClick={() => clearFilters()}
          startIcon={<RefreshOutlined />}
        >
          Reset
        </Button>
      )}

      <Badge color="error" variant="dot" invisible={!hasFilters}>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Filter
        </Button>
      </Badge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {FilterComponent ? (
          <FilterComponent />
        ) : (
          <ListItem sx={{ py: 2, justifyContent: "center" }}>
            <ListItemText
              primary="No filter provided"
              primaryTypographyProps={{
                variant: "body2",
                color: "text.secondary",
                align: "center",
                sx: { fontStyle: "italic" },
              }}
            />
          </ListItem>
        )}
      </Popover>
    </>
  );
};
