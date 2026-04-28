import { apiGateway } from "@/shared/api/httpClient";
import type {
  LeaderboardListParams,
  LeaderboardListResponse,
  LeaderboardResponse,
  LeaderboardFormData,
  Leaderboard,
} from "../types/leaderboard.types";

export const leaderboardApi = {
  getList: (params?: LeaderboardListParams) =>
    apiGateway.get<LeaderboardListResponse>("/leaderboards", { params }),

  getById: (id: string) => apiGateway.get<Leaderboard>(`/leaderboards/${id}`),

  create: (payload: LeaderboardFormData) =>
    apiGateway.post<LeaderboardResponse>("/leaderboards", payload),

  update: (id: string, payload: LeaderboardFormData) =>
    apiGateway.put<LeaderboardResponse>(`/leaderboards/${id}`, payload),

  delete: (id: string) => apiGateway.delete(`/leaderboards/${id}`),

  bulkUpdateStatus: (id: string, status: "draft" | "active") =>
    apiGateway.patch(`/leaderboards/${id}`, { status }),
};
