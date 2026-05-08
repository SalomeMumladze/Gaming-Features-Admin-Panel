import { useEffect, useState } from "react";
import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Stack,
  Badge,
  Typography,
  Divider,
} from "@mui/material";
import { Delete, BookmarkBorder } from "@mui/icons-material";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { useNotification } from "@/shared/providers/useNotification";

type Props<T> = {
  tableName: string;
  filters: T;
};

type SavedFilter<T> = {
  name: string;
  filters: T;
};

export const SavedFilterList = <T extends Record<string, any>>({
  tableName,
}: Props<T>) => {
  const STORAGE_KEY = `${tableName}_saved_filters`;

  const { notify } = useNotification();
  const { setFilter, filters } = useServerTable();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [savedFilters, setSavedFilters] = useState<SavedFilter<T>[]>([]);
  const [selectedFilterName, setSelectedFilterName] = useState<string | null>(
    null,
  );

  const open = Boolean(anchorEl);

  useEffect(() => {
    const hasAnyFilter = Object.values(filters || {}).some(
      (v) => v !== null && v !== "" && v !== undefined,
    );

    if (!hasAnyFilter) {
      setSelectedFilterName(null);
    }
  }, [filters]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedFilters(JSON.parse(stored));
    }
  }, [STORAGE_KEY]);

  const updateStorage = (data: SavedFilter<T>[]) => {
    setSavedFilters(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleDelete = (name: string) => {
    const updated = savedFilters.filter((item) => item.name !== name);
    updateStorage(updated);
    if (selectedFilterName === name) {
      setSelectedFilterName(null);
    }
    notify(`${name} Filter deleted successfully`, "success");
  };

  const handleApply = (name: string, filters: T) => {
    setFilter(filters);
    setSelectedFilterName(name);
    setAnchorEl(null);
  };

  return (
    <div className="flex items-center gap-2">
      <Badge color="primary" variant="dot" invisible={!selectedFilterName}>
        <Button
          variant="outlined"
          startIcon={<BookmarkBorder />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {selectedFilterName || "Saved Filters"}
        </Button>
      </Badge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
            width: 320,
          },
        }}
      >
        <Stack spacing={1} sx={{ p: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              px: 1,
              fontWeight: 600,
              color: "text.secondary",
              letterSpacing: "0.5px",
            }}
          >
            SAVED FILTERS
          </Typography>
          <Divider />
          <List disablePadding>
            {savedFilters.map((item) => {
              const isSelected = selectedFilterName === item.name;
              return (
                <ListItem
                  key={item.name}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item.name)}
                      sx={{ mr: 0.5 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    mb: 0.5,
                    borderRadius: "6px",
                    overflow: "hidden",
                    backgroundColor: isSelected
                      ? "action.selected"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? "action.selected"
                        : "action.hover",
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleApply(item.name, item.filters)}
                    sx={{ py: 0.75, px: 1 }}
                  >
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? "primary.main" : "text.primary",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {!savedFilters.length && (
              <ListItem sx={{ py: 2, justifyContent: "center" }}>
                <ListItemText
                  primary="No saved filters yet."
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "text.secondary",
                    align: "center",
                    sx: { fontStyle: "italic" },
                  }}
                />
              </ListItem>
            )}
          </List>
        </Stack>
      </Popover>
    </div>
  );
};
