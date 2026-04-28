import { apiGateway } from "@/shared/api/httpClient";
import type {
  WheelListParams,
  WheelsListResponse,
  WheelFormData,
  Wheel,
} from "../types/wheel.types";

export const wheelApi = {
  getList: (params?: WheelListParams) =>
    apiGateway.get<WheelsListResponse>(`/wheels`, { params }),

  getById: (id: string) => apiGateway.get<Wheel>(`/wheels/${id}`),

  create: (payload: WheelFormData) =>
    apiGateway.post<WheelFormData>("/wheels", payload),

  update: (id: string, payload: WheelFormData) =>
    apiGateway.put<WheelFormData>(`/wheels/${id}`, payload),

  delete: (id: string) => apiGateway.delete(`/wheels/${id}`),
};
