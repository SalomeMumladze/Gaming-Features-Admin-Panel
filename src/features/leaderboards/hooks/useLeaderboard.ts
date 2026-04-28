import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { leaderboardApi } from "../api/leaderboard.api";
import type {
  Leaderboard,
  LeaderboardListParams,
} from "../types/leaderboard.types";

//  LIST
export const useLeaderboards = (params?: LeaderboardListParams) => {
  return useQuery({
    queryKey: ["leaderboards", params],
    queryFn: async () => {
      const { data } = await leaderboardApi.getList(params);
      return data;
    },
    placeholderData: (prev) => prev,
  });
};

//  GET BY ID
export const useLeaderboardById = (id?: string) => {
  return useQuery<Leaderboard>({
    queryKey: ["leaderboard", id],
    queryFn: async () => {
      const { data } = await leaderboardApi.getById(id!);
      return data;
    },
    enabled: !!id,
  });
};

//  CREATE
export const useCreateLeaderboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaderboardApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] });
    },
  });
};

//  UPDATE
export const useUpdateLeaderboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: Leaderboard) =>
      leaderboardApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] });
    },
  });
};

//  DELETE
export const useDeleteLeaderboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaderboardApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] });
    },
  });
};

//  BULK STATUS UPDATE
export const useUpdateLeaderboardStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "draft" | "active" }) =>
      leaderboardApi.bulkUpdateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] });
    },
  });
};
