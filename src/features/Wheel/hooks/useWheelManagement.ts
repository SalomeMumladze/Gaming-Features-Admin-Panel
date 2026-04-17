import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGateway } from "@/shared/api/httpClient";

// Wheel & WheelSegment types
export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  weight: number;
  prizeType: "coins" | "freeSpin" | "bonus" | "nothing";
  prizeAmount: number;
  imageUrl: string;
}

export interface Wheel {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "inactive";
  segments: WheelSegment[];
  maxSpinsPerUser: number;
  spinCost: number;
  backgroundColor: string;
  borderColor: string;
  createdAt: string;
  updatedAt: string;
}

interface WheelsListResponse {
  data: Wheel[];
  total: number;
}

interface WheelResponse {
  data: Wheel;
}

export const useWheelsManagement = (params?: {
  _page?: number;
  _per_page?: number;
  status?: string;
}) => {
  const queryClient = useQueryClient();

  // LIST
  const rawWheels = useQuery<WheelsListResponse>({
    queryKey: ["wheels", params],
    queryFn: async () => {
      const { data } = await apiGateway.get<WheelsListResponse>("/wheels", {
        params,
      });
      return data;
    },
    keepPreviousData: true,
  });

  const wheels = {
    ...rawWheels,
    items: rawWheels.data?.data ?? [],
    totalRows: rawWheels.data?.items ?? 0,
  };

  // DELETE
  const deleteWheel = useMutation({
    mutationFn: (id: string) => apiGateway.delete(`/wheels/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wheels"] }),
  });

  // GET BY ID
  const getWheel = (id: string) =>
    useQuery<WheelResponse>({
      queryKey: ["wheels", id],
      queryFn: async () => {
        const { data } = await apiGateway.get<WheelResponse>(`/wheels/${id}`);
        return data;
      },
      enabled: !!id,
    });

  // CREATE
  const create = useMutation({
    mutationFn: (payload: Omit<Wheel, "id" | "createdAt" | "updatedAt">) =>
      apiGateway.post<WheelResponse>("/wheels", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wheels"] }),
  });

  // UPDATE
  const updateWheel = useMutation({
    mutationFn: (payload: Wheel) =>
      apiGateway.put<WheelResponse>(`/wheels/${payload.id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wheels"] }),
  });

  return { wheels, deleteWheel, getWheel, create, updateWheel };
};
