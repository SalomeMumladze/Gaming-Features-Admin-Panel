import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGateway } from "@/shared/api/httpClient";

export interface Raffle {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: "draft" | "active" | "drawn" | "cancelled";
  ticketPrice: number;
  maxTicketsPerUser: number;
  prizes: RafflePrize[];
  totalTicketLimit: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RafflePrize {
  id: string;
  name: string;
  type: "coins" | "freeSpin" | "bonus";
  amount: number;
  quantity: number;
  imageUrl: string;
}

export const useRaffleManagement = (params?: {
  _page?: number;
  _per_page?: number;
  status?: string;
  startDate_gte?: string;
  endDate_lte?: string;
}) => {
  const raffles = useQuery({
    queryKey: ["raffles", params],
    queryFn: async () => {
      const { data } = await apiGateway.get("/raffles", { params });
      return {
        items: data.data,
        totalRows: data.items,
      };
    },
    keepPreviousData: true,
  });

  return { raffles };
};
