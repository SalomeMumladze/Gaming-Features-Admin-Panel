import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGateway } from "@/shared/api/httpClient";

export interface LeaderboardPrize {
  id: string;
  rank: number;
  name: string;
  type: "coins" | "freeSpin" | "bonus";
  amount: number;
  imageUrl: string;
}

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "completed";
  scoringType: "points" | "wins" | "wagered";
  prizes: LeaderboardPrize[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export const useLeaderboard = (params?: {
  _page?: number;
  _per_page?: number;
  status?: string;
}) => {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ["leaderboards", params],
    queryFn: async () => {
      const { data } = await apiGateway.get("/leaderboards", {
        params,
      });

      return {
        items: data.data,
        totalRows: data.items,
      };
    },
    keepPreviousData: true,
  });

  const create = useMutation({
    mutationFn: (
      payload: Omit<Leaderboard, "id" | "createdAt" | "updatedAt">,
    ) => apiGateway.post("/leaderboards", payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] }),
  });

  const update = useMutation({
    mutationFn: (payload: Leaderboard) =>
      apiGateway.put(`/leaderboards/${payload.id}`, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] }),
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["leaderboard", id],
      queryFn: async () => {
        const { data } = await apiGateway.get(`/leaderboards/${id}`);
        return data;
      },
      enabled: !!id,
    });

  return { list, create, update, getById };
};
