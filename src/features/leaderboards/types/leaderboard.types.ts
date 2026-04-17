export type LeaderboardStatus = "draft" | "active" | "completed";

export type LeaderboardScoringType = "points" | "wins" | "wagered";

export type PrizeType = "coins" | "freeSpin" | "bonus";

export interface LeaderboardPrize {
  id: string;
  rank: number;
  name: string;
  type: PrizeType;
  amount: number;
  imageUrl: string;
}

export type ISODateString = string;

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  startDate: ISODateString;
  endDate: ISODateString;
  status: LeaderboardStatus;
  scoringType: LeaderboardScoringType;
  prizes: LeaderboardPrize[];
  maxParticipants: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type LeaderboardFormData = Omit<
  Leaderboard,
  "id" | "createdAt" | "updatedAt"
>;

export interface LeaderboardFilters {
  status?: LeaderboardStatus;
  scoringType?: LeaderboardScoringType;
  q?: string;
}

export interface LeaderboardListParams extends LeaderboardFilters {
  _page?: number;
  _per_page?: number;
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface LeaderboardListResponse {
  data: Leaderboard[];
  total: number;
}

export interface LeaderboardResponse {
  data: Leaderboard;
}
