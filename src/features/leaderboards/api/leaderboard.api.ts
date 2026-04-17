import { apiGateway } from "@/shared/api/httpClient";
import type {
  LeaderboardListParams,
  LeaderboardListResponse,
  LeaderboardResponse,
  LeaderboardFormData,
} from "../types/leaderboard.types";

export const leaderboardApi = {
  getList: (params?: LeaderboardListParams) =>
    apiGateway.get<LeaderboardListResponse>("/leaderboards", { params }),

  getById: (id: string) =>
    apiGateway.get<LeaderboardResponse>(`/leaderboards/${id}`),

  create: (payload: LeaderboardFormData) =>
    apiGateway.post<LeaderboardResponse>("/leaderboards", payload),

  update: (id: string, payload: LeaderboardFormData) =>
    apiGateway.put<LeaderboardResponse>(`/leaderboards/${id}`, payload),

  delete: (id: string) => apiGateway.delete(`/leaderboards/${id}`),

  bulkUpdateStatus: (ids: string[], status: "draft" | "active") =>
    apiGateway.patch("/leaderboards/status", { ids, status }),
};
