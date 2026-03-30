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

interface LeaderboardsListResponse {
  data: Leaderboard[];
  total: number;
}

interface LeaderboardResponse {
  data: Leaderboard;
}

export const useLeaderboard = (params?: {
  _page?: number;
  _per_page?: number;
  status?: string;
}) => {
  const queryClient = useQueryClient();

  // LIST
  const rawList = useQuery<LeaderboardsListResponse>({
    queryKey: ["leaderboards", params],
    queryFn: async () => {
      const { data } = await apiGateway.get<LeaderboardsListResponse>(
        "/leaderboards",
        { params },
      );
      return data;
    },
    keepPreviousData: true,
  });

  const list = {
    ...rawList,
    items: rawList.data?.data ?? [],
    totalRows: rawList.data?.items ?? 0,
  };

  // CREATE
  const create = useMutation({
    mutationFn: (
      payload: Omit<Leaderboard, "id" | "createdAt" | "updatedAt">,
    ) => apiGateway.post<LeaderboardResponse>("/leaderboards", payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] }),
  });

  // UPDATE
  const update = useMutation({
    mutationFn: (payload: Leaderboard) =>
      apiGateway.put<LeaderboardResponse>(
        `/leaderboards/${payload.id}`,
        payload,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] }),
  });

  // GET BY ID
  const getById = (id: string) =>
    useQuery<LeaderboardResponse>({
      queryKey: ["leaderboard", id],
      queryFn: async () => {
        const { data } = await apiGateway.get<LeaderboardResponse>(
          `/leaderboards/${id}`,
        );
        return data;
      },
      enabled: !!id,
    });

  // DELETE
  const deleteLeaderboard = useMutation({
    mutationFn: (id: string) => apiGateway.delete(`/leaderboards/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] }),
  });

  // UPDATE STATUS
  const bulkUpdateStatuses = useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: string[];
      status: "draft" | "active";
    }) => apiGateway.patch("/leaderboards/status", { ids, status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] }),
  });

  return {
    list,
    create,
    update,
    getById,
    deleteLeaderboard,
    bulkUpdateStatuses,
  };
};
