import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import type { RafflePrize } from "@/features/Raffle/types/raffle.types";
import PrizeCard from "./PrizeCard";
import type { RaffleFormValues } from "../../schema/raffle.schema";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { SectionCard } from "@/shared/components/SectionCard";
import { Add, EmojiEventsRounded } from "@mui/icons-material";

interface PrizeFieldsProps {
  register: UseFormRegister<RaffleFormValues>;
  errors: FieldErrors<RaffleFormValues["prizes"]>;
  setValue: UseFormSetValue<RaffleFormValues>;
  initialPrizes?: RafflePrize[];
}

export const RafflePrizeForm: React.FC<PrizeFieldsProps> = ({
  register,
  errors,
  setValue,
  initialPrizes,
}) => {
  const [prizes, setPrizes] = useState<
    (RafflePrize & { imagePreview?: string })[]
  >(
    initialPrizes?.map((p) => ({ ...p, imagePreview: p.imageUrl })) || [
      {
        id: crypto.randomUUID(),
        name: "",
        type: "coins",
        amount: 0,
        quantity: 1,
        imageUrl: "",
      },
    ],
  );

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

        return { ...p, [field]: value as unknown };
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
    <SectionCard
      icon={<EmojiEventsRounded fontSize="small" />}
      title="Prizes"
      subtitle="Add and manage raffle rewards"
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

      <Button
        variant="outlined"
        size="small"
        startIcon={<Add />}
        onClick={addPrize}
        className="!self-start !rounded-lg !border-dashed !border-gray-300 !text-gray-600 "
      >
        Add Prize
      </Button>
    </SectionCard>
  );
};
