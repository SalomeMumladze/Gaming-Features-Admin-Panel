import React, { useState } from "react";
import { Wheel as Roulette } from "react-custom-roulette";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import type { Wheel } from "../hooks/useWheelManagement";

export const WheelDetail: React.FC<{ data: Wheel }> = () => {
  const { id } = useParams<{ id: string }>();
  const { getWheel } = useWheelsManagement();
  const { data, isLoading } = getWheel(id);

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  if (isLoading) return <div className="py-20 text-center">Loading...</div>;
  if (!data) return <div className="py-20 text-center">Not Found</div>;

  const rouletteData = data.segments.map((seg) => ({
    option: seg.label,
    style: { backgroundColor: seg.color, textColor: "#fff" },
    image: seg.imageUrl
      ? { uri: seg.imageUrl, sizeMultiplier: 0.5 }
      : undefined,
  }));

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.segments.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <div className="p-8">
      <Box className="flex justify-between items-center mb-6">
        <div>
          <Typography variant="h4" className="font-bold ">
            {data.name}
          </Typography>
          <Typography variant="body1">{data.description}</Typography>
        </div>
        <Chip
          label={data.status.toUpperCase()}
          color={data.status === "active" ? "success" : "default"}
          variant="filled"
        />
      </Box>

      <div className="flex gap-2 w-full">
        <Grid item xs={12} md={5} className="w-full">
          <Card className="flex flex-col items-center p-6 shadow-lg h-full">
            <Typography variant="h6" className="mb-4 self-start font-semibold">
              Live Preview
            </Typography>
            <div
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={handleSpinClick}
            >
              <Roulette
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={rouletteData}
                backgroundColors={[data.backgroundColor]}
                outerBorderColor={data.borderColor}
                outerBorderWidth={10}
                innerRadius={20}
                innerBorderColor={data.borderColor}
                radiusLineColor={data.borderColor}
                radiusLineWidth={1}
                onStopSpinning={() => setMustSpin(false)}
              />
            </div>
            <Typography variant="caption" className="mt-4">
              Click the wheel to test animation
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={7} className="w-full">
          <Card className="shadow-lg mb-6">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                General Settings
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg">
                  <Typography variant="caption" className=" block">
                    Spin Cost
                  </Typography>
                  <Typography variant="h6">{data.spinCost} Credits</Typography>
                </div>
                <div className="p-3 rounded-lg">
                  <Typography variant="caption" className="block">
                    Max Spins/User
                  </Typography>
                  <Typography variant="h6">{data.maxSpinsPerUser}</Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <TableContainer component={Paper} className="shadow-lg">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Segment</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Weight (%)</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.segments.map((segment) => (
                  <TableRow key={segment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: segment.color }}
                        />
                        {segment.label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={segment.prizeType}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">{segment.prizeAmount}</TableCell>
                    <TableCell align="right">
                      <span className="font-mono">{segment.weight}%</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </div>
    </div>
  );
};
