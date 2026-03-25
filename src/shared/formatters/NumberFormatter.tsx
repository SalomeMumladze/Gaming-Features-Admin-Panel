import React from "react";

type Props = {
  value?: number | null;
  suffix?: string;
};

export const NumberFormatter: React.FC<Props> = ({ value, suffix }) => {
  if (value === null || value === undefined) return <>-</>;

  const formatted = value.toLocaleString();

  return (
    <span className="text-sm">
      {formatted}
      {suffix ? ` ${suffix}` : ""}
    </span>
  );
};
