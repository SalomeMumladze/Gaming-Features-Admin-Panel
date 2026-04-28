import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";

interface Segment {
  label: string;
  color: string;
  weight?: number;
  imageUrl?: string;
}

interface Props {
  segments: Segment[];
  withSpin?: boolean;
  useWeight?: boolean;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
}

export const RouletteWheel: React.FC<Props> = ({
  segments,
  withSpin = false,
  useWeight = false,
  backgroundColor,
  borderColor,
}) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const rouletteData = segments.map((seg) => ({
    option: seg.label || "—",
    style: {
      backgroundColor: seg.color,
      textColor: "#ffffff",
    },
    image: seg.imageUrl
      ? { uri: seg.imageUrl, sizeMultiplier: 0.5 }
      : undefined,
  }));

  const getWeightedIndex = () => {
    const totalWeight = segments.reduce((sum, s) => sum + (s.weight || 0), 0);

    const rand = Math.random() * totalWeight;

    let acc = 0;
    for (let i = 0; i < segments.length; i++) {
      acc += segments[i].weight || 0;
      if (rand <= acc) return i;
    }

    return 0;
  };

  const handleSpin = () => {
    if (mustSpin) return;

    const index = useWeight
      ? getWeightedIndex()
      : Math.floor(Math.random() * segments.length);

    setPrizeNumber(index);
    setMustSpin(true);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={withSpin ? "cursor-pointer hover:scale-105 transition" : ""}
        onClick={withSpin ? handleSpin : undefined}
        style={{
          backgroundColor: backgroundColor || "transparent",
          borderRadius: "50%",
        }}
      >
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={rouletteData}
          backgroundColors={backgroundColor ? [backgroundColor] : undefined}
          outerBorderColor={borderColor}
          outerBorderWidth={10}
          innerRadius={20}
          innerBorderColor={borderColor}
          radiusLineColor={borderColor}
          radiusLineWidth={1}
          onStopSpinning={() => setMustSpin(false)}
        />
      </div>

      {withSpin && (
        <span className="text-xs text-gray-500">Click wheel to spin</span>
      )}
    </div>
  );
};
