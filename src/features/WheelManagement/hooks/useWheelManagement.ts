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
  startDate_gte?: string;
  endDate_lte?: string;
}) => {
  const wheels = useQuery({
    queryKey: ["raffles", params],
    queryFn: async () => {
      const { data } = await apiGateway.get("/wheels", { params });
      return {
        items: data.data,
        totalRows: data.items,
      };
    },
    keepPreviousData: true,
  });

  return { wheels };
};
