import { useEffect, useState } from "react";
import { Button, Collapse, TextField } from "@mui/material";
import { Save, Close } from "@mui/icons-material";
import { useNotification } from "@/shared/providers/useNotification";
import { makeStyles } from "@mui/styles";

type Props<T> = {
  tableName: string;
  filters: T;
};

type SavedFilter<T> = {
  name: string;
  filters: T;
};

export const SavedFilters = <T extends Record<string, any>>({
  tableName,
  filters,
}: Props<T>) => {
  const classes = useStyles();
  const { notify } = useNotification();

  const STORAGE_KEY = `${tableName}_saved_filters`;
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [savedFilters, setSavedFilters] = useState<SavedFilter<T>[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setSavedFilters(JSON.parse(stored));
    }
  }, [STORAGE_KEY]);

  const persist = (data: SavedFilter<T>[]) => {
    setSavedFilters(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleSave = () => {
    if (!saveName.trim()) return;

    const updated = [
      ...savedFilters,
      {
        name: saveName,
        filters,
      },
    ];
    notify(`${saveName} Filter saved successfully`, "success");

    persist(updated);
    setSaveName("");
    setShowSave(false);
  };

  return (
    <div>
      <div className="flex items-center justify-end">
        {!showSave && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Save />}
            onClick={() => setShowSave(true)}
          >
            Save Filter
          </Button>
        )}
      </div>
      <Collapse in={showSave}>
        <div className="flex gap-2">
          <TextField
            fullWidth
            size="small"
            placeholder="Filter Name"
            value={saveName}
            className={classes.input}
            onChange={(e) => setSaveName(e.target.value)}
          />

          <Button
            size="small"
            variant="contained"
            className={classes.Button}
            disabled={!saveName.trim()}
            startIcon={<Save />}
            onClick={handleSave}
          >
            Save
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="inherit"
            className={classes.Button}
            onClick={() => {
              setShowSave(false);
              setSaveName("");
            }}
          >
            <Close />
          </Button>
        </div>
      </Collapse>
    </div>
  );
};

export const useStyles = makeStyles({
  input: {
    "& .MuiInputBase-input": {
      height: "14px ",
      width: "100px",
    },
  },

  Button: {
    minWidth: "fit-content !important",
    height: "30px",
  },
});
