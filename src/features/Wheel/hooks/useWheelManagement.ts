import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wheelApi } from "../api/wheel.api";
import type { Wheel, WheelListParams } from "../types/wheel.types";

//  LIST
export const useWheels = (params?: WheelListParams) => {
  return useQuery({
    queryKey: ["wheels", params],
    queryFn: async () => {
      const { data } = await wheelApi.getList(params);
      return data;
    },
    placeholderData: (prev) => prev,
  });
};

//  GET BY ID
export const useWheelById = (id?: string) => {
  return useQuery<Wheel>({
    queryKey: ["wheels", id],
    queryFn: async () => {
      const { data } = await wheelApi.getById(id!);
      return data;
    },
    enabled: !!id,
  });
};

//  CREATE
export const useCreateWheel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wheelApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wheels"] });
    },
  });
};

//  UPDATE
export const useUpdateWheel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: Wheel) => wheelApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wheels"] });
    },
  });
};

//  DELETE
export const useDeleteWheel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => wheelApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wheels"] });
    },
  });
};
