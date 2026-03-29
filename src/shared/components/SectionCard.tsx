import React from "react";
import { Box, Typography } from "@mui/material";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  subtitle,
  children,
}) => (
  <Box className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <Box className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
      <Box className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600">
        {icon}
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          className="!font-semibold !leading-tight text-gray-800"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" className="text-gray-500">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    <Box className="p-6 flex flex-col gap-6">{children}</Box>
  </Box>
);
