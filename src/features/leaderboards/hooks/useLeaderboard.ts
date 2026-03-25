import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGateway } from "@/shared/api/httpClient";

export interface LeaderboardPrize {
  id: string;
  rank: number;
  name: string;
  type: "coins" | "freeSpin" | "bonus";
  amount: number;
  imageUrl: string;
}

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "completed";
  scoringType: "points" | "wins" | "wagered";
  prizes: LeaderboardPrize[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

const queryKey = ["leaderboards"];

export const useLeaderboard = () => {
  const list = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await apiGateway.get<Leaderboard[]>("/leaderboards");
      return data;
    },
  });

  return { list };
};
