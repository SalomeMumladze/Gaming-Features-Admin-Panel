import { useState, useEffect } from "react";
import { TextField, CircularProgress, InputAdornment } from "@mui/material";
import { useServerTable } from "@/shared/components/tables/serverTable.context";
import { makeStyles } from "@mui/styles";
import { Search } from "@mui/icons-material";

type Props = {
  filterKey: string;
  label?: string;
};

export const TableSearch = ({ filterKey, label = "Search..." }: Props) => {
  const classes = useStyles();

  const { filters, setFilter } = useServerTable();

  const [input, setInput] = useState(filters?.[filterKey] ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      const value = input.trim();

      const current = filters?.[filterKey] ?? "";

      if (value === current) {
        setLoading(false);
        return;
      }

      setFilter(filterKey, value === "" ? null : value);
      setLoading(false);
    }, 500);

    setLoading(true);

    return () => clearTimeout(handler);
  }, [input]);

  return (
    <TextField
      placeholder={label}
      size="small"
      className={classes.input}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      InputProps={{
        endAdornment: loading ? <CircularProgress size={14} /> : null,
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};

export const useStyles = makeStyles({
  input: {
    maxWidth: "12rem",
    width: "100%",
    "& .MuiInputBase-input": {
      height: "20px",
    },
  },
});
