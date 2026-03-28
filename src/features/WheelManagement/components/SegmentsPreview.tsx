import React from "react";
import { Tooltip } from "@mui/material";

type Segment = {
  id: string;
  label: string;
  color: string;
  weight: number;
};

interface Props {
  segments?: Segment[];
  maxVisible?: number;
}

export const SegmentsPreview: React.FC<Props> = ({
  segments = [],
  maxVisible = 5,
}) => {
  if (!segments.length) return null;

  const visible = segments.slice(0, maxVisible);
  const remaining = segments.length - maxVisible;

  return (
    <div className="flex h-full items-center justify-end -space-x-2 overflow-hidden m-auto">
      {visible.map((seg) => (
        <Tooltip key={seg.id} title={`${seg.label} (${seg.weight}%)`}>
          <div
            className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[10px] text-white font-bold"
            style={{ backgroundColor: seg.color }}
          >
            {seg.label.charAt(0)}
          </div>
        </Tooltip>
      ))}

      {remaining > 0 && (
        <div className="w-6 h-6 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] text-slate-600 font-bold">
          +{remaining}
        </div>
      )}
    </div>
  );
};
