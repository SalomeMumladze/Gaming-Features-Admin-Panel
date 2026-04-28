export type RaffleStatus = "draft" | "active" | "drawn" | "cancelled";

export interface RafflePrize {
  id: string;
  name: string;
  type: "coins" | "freeSpin" | "bonus";
  amount: number;
  quantity: number;
  imageUrl: string;
}

export type ISODateString = string;

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
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface RaffleFilters {
  status?: RaffleStatus;
  q?: string;
}

export interface RaffleListParams extends RaffleFilters {
  _page?: number;
  _per_page?: number;
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface RaffleListResponse {
  data: Raffle[];
  total: number;
  items?: number;
}

export interface RaffleResponse {
  data: Raffle;
}

export type RaffleFormData = Omit<Raffle, "id" | "createdAt" | "updatedAt">;
