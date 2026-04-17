import { apiGateway } from "@/shared/api/httpClient";
import type {
  RaffleListParams,
  RaffleListResponse,
  RaffleResponse,
  RaffleFormData,
} from "../types/raffle.types";

export const raffleApi = {
  getList: (params?: RaffleListParams) =>
    apiGateway.get<RaffleListResponse>(`/raffles`, { params }),

  getById: (id: string) => apiGateway.get<RaffleResponse>(`/raffles/${id}`),

  create: (payload: RaffleFormData) =>
    apiGateway.post<RaffleFormData>("/raffles", payload),

  update: (id: string, payload: RaffleFormData) =>
    apiGateway.put<RaffleFormData>(`/raffles/${id}`, payload),

  delete: (id: string) => apiGateway.delete(`/raffles/${id}`),
};
