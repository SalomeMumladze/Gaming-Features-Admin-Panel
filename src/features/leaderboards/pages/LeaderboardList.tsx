import React from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";

export const LeaderboardList: React.FC = () => {
  const { list } = useLeaderboard();

  if (list.isLoading) return <div>Loading...</div>;
  if (list.isError) return <div>Error loading leaderboards</div>;

  return (
    <ul>
      {list.data?.map((lb) => (
        <li key={lb.id}>
          {lb.title} - {lb.status}
        </li>
      ))}
    </ul>
  );
};
