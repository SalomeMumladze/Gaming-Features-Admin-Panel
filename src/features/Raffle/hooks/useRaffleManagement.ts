import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { raffleApi } from "../api/raffle.api";
import type { Raffle, RaffleListParams } from "../types/raffle.types";

//  LIST
export const useRaffles = (params?: RaffleListParams) => {
  return useQuery({
    queryKey: ["raffles", params],
    queryFn: async () => {
      const { data } = await raffleApi.getList(params);
      return data;
    },
    placeholderData: (prev) => prev,
  });
};

//  GET BY ID
export const useRaffleById = (id?: string) => {
  return useQuery<Raffle>({
    queryKey: ["raffles", id],
    queryFn: async () => {
      const { data } = await raffleApi.getById(id!);

      return data;
    },
    enabled: !!id,
  });
};

//  CREATE
export const useCreateRaffle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: raffleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
    },
  });
};

//  UPDATE
export const useUpdateRaffle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: Raffle) => raffleApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
    },
  });
};

//  DELETE
export const useDeleteRaffle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => raffleApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
    },
  });
};

export const useUpdateRaffleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "draft" | "active" }) =>
      raffleApi.bulkUpdateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["server-table"] });
    },
  });
};
