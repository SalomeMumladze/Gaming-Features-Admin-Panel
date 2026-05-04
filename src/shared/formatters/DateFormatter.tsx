import React from "react";
import { Typography, Box } from "@mui/material";
import dayjs from "dayjs";
import { CalendarTodayOutlined } from "@mui/icons-material";

type Props = {
  value?: string | Date;
  format?: string;
  timeFormat?: string;
  showTime?: boolean;
};

export const DateFormatter: React.FC<Props> = ({
  value,
  format = "MMM D, YYYY",
  timeFormat = "HH:mm:ss",
  showTime = false,
}) => {
  if (!value) return null;

  const date = dayjs(value);

  if (!date.isValid()) return <>-</>;

  const datePart = date.format(format);
  const timePart = date.format(timeFormat);

  return (
    <div className="flex items-center h-full w-full gap-4">
      <CalendarTodayOutlined
        sx={{
          fontSize: 16,
          color: "text.secondary",
        }}
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        height="100%"
      >
        <Typography fontWeight={500} variant="subtitle2">
          {datePart}
        </Typography>
        {showTime && (
          <Typography variant="caption" color="text.secondary">
            {timePart}
          </Typography>
        )}
      </Box>
    </div>
  );
};
