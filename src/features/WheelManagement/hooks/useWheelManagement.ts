import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGateway } from "@/shared/api/httpClient";

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

interface WheelSegment {
  id: string;
  label: string;
  color: string;
  weight: number;
  prizeType: "coins" | "freeSpin" | "bonus" | "nothing";
  prizeAmount: number;
  imageUrl: string;
}

export const useWheelsManagement = (params?: {
  _page?: number;
  _per_page?: number;
  status?: string;
}) => {
  const queryClient = useQueryClient();

  const wheels = useQuery({
    queryKey: ["wheels", params],
    queryFn: async () => {
      const { data } = await apiGateway.get("/wheels", { params });
      return {
        items: data.data,
        totalRows: data.items,
      };
    },
    keepPreviousData: true,
  });

  const deleteWheel = useMutation({
    mutationFn: (id: string) => apiGateway.delete(`/wheels/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wheels"] }),
  });

  const getWheel = (id: string) =>
    useQuery({
      queryKey: ["wheels", id],
      queryFn: async () => {
        const { data } = await apiGateway.get(`/wheels/${id}`);
        return data;
      },
      enabled: !!id,
    });

  const create = useMutation({
    mutationFn: (payload: Omit<Wheel, "id" | "createdAt" | "updatedAt">) =>
      apiGateway.post("/wheels", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wheels"] }),
  });

  return { wheels, deleteWheel, getWheel, create };
};
