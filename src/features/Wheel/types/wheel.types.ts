export type WheelStatus = "draft" | "active" | "inactive";

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

export interface WheelFilters {
  status?: WheelStatus;
  q?: string;
}

export interface WheelListParams extends WheelFilters {
  _page?: number;
  _per_page?: number;
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface WheelsListResponse {
  data: Wheel[];
  total: number;
}

export interface WheelResponse {
  data: Wheel;
}

export type WheelFormData = Omit<Wheel, "id" | "createdAt" | "updatedAt">;
