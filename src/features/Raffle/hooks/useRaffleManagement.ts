import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGateway } from "@/shared/api/httpClient";

export interface RafflePrize {
  id: string;
  name: string;
  type: "coins" | "freeSpin" | "bonus";
  amount: number;
  quantity: number;
  imageUrl: string;
}

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

interface RafflesListResponse {
  data: Raffle[];
  total: number;
}

interface RaffleResponse {
  data: Raffle;
}

export const useRaffleManagement = (params?: {
  _page?: number;
  _per_page?: number;
  status?: string;
  startDate_gte?: string;
  endDate_lte?: string;
}) => {
  const queryClient = useQueryClient();

  // LIST
  const rawRaffles = useQuery<RafflesListResponse>({
    queryKey: ["raffles", params],
    queryFn: async () => {
      const { data } = await apiGateway.get<RafflesListResponse>("/raffles", {
        params,
      });
      return data;
    },
    keepPreviousData: true,
  });

  const raffles = {
    ...rawRaffles,
    items: rawRaffles.data?.data ?? [],
    totalRows: rawRaffles.data?.items ?? 0,
  };

  // CREATE
  const create = useMutation({
    mutationFn: (payload: Omit<Raffle, "id" | "createdAt" | "updatedAt">) =>
      apiGateway.post<RaffleResponse>("/raffles", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["raffles"] }),
  });

  // DELETE
  const deleteRaffle = useMutation({
    mutationFn: (id: string) => apiGateway.delete(`/raffles/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["raffles"] }),
  });

  // UPDATE
  const updateRaffle = useMutation({
    mutationFn: (payload: Raffle) =>
      apiGateway.put<RaffleResponse>(`/raffles/${payload.id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["raffles"] }),
  });

  // GET BY ID
  const getRaffle = (id: string) =>
    useQuery<RaffleResponse>({
      queryKey: ["raffles", id],
      queryFn: async () => {
        const { data } = await apiGateway.get<RaffleResponse>(`/raffles/${id}`);
        return data;
      },
      enabled: !!id,
    });

  return { raffles, create, deleteRaffle, updateRaffle, getRaffle };
};
