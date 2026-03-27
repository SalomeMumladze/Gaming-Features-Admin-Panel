import React, { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import type { RafflePrize } from "../hooks/useRaffleManagement";
import PrizeCard from "./PrizeCard";

interface PrizeFieldsProps {
  register: unknown;
  errors: any;
  setValue: unknown;
}

const PrizesForm: React.FC<PrizeFieldsProps> = ({
  register,
  errors,
  setValue,
}) => {
  const [prizes, setPrizes] = useState<
    (RafflePrize & { imagePreview?: string })[]
  >([
    {
      id: crypto.randomUUID(),
      name: "",
      type: "coins",
      amount: 0,
      quantity: 1,
      imageUrl: "",
    },
  ]);

  useEffect(() => {
    setValue("prizes", prizes);
  }, [prizes, setValue]);

  const handleChange = (
    id: string,
    field: keyof RafflePrize,
    value: string | number | File | null,
  ) => {
    setPrizes((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        if (field === "imageUrl" && value instanceof File) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPrizes((prev) =>
              prev.map((pr) =>
                pr.id === id
                  ? {
                      ...pr,
                      imageUrl: reader.result as string,
                      imagePreview: reader.result as string,
                    }
                  : pr,
              ),
            );
          };
          reader.readAsDataURL(value);
          return p;
        }

        return { ...p, [field]: value as any };
      }),
    );
  };

  const removeImage = (id: string) => {
    setPrizes((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, imageUrl: "", imagePreview: undefined } : p,
      ),
    );
  };

  const addPrize = () =>
    setPrizes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        type: "coins",
        amount: 0,
        quantity: 1,
        imageUrl: "",
      },
    ]);

  const removePrize = (id: string) =>
    setPrizes((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="w-full">
      <div
        className="rounded-2xl border relative"
        style={{
          border: "1px solid rgba(201,168,76,0.3)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            background: "rgba(201,168,76,0.06)",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-sm font-semibold"
              style={{ color: "#C9A84C", letterSpacing: "0.05em" }}
            >
              PRIZES
            </span>
            <span className="text-xs text-gray-500">
              Add and manage raffle rewards
            </span>
          </div>

          <Button variant="outlined" startIcon={<Add />} onClick={addPrize}>
            Add Prize
          </Button>
        </div>

        <div className="relative">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxHeight: "42vh",
              overflowY: "auto",
              padding: "16px",
            }}
          >
            {prizes.map((prize, i) => (
              <PrizeCard
                key={prize.id}
                id={prize.id}
                prize={prize}
                index={i}
                register={register}
                errors={errors?.[i]}
                canDelete={prizes.length > 1}
                onChange={handleChange}
                onRemove={removePrize}
                onRemoveImage={removeImage}
              />
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default PrizesForm;
