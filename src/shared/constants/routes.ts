export const ROUTES = {
  HOME: "/",

  LEADERBOARDS: "/leaderboards",
  LEADERBOARD_DETAILS: "/leaderboards/:id",

  RAFFLES: "/raffles",
  RAFFLE_DETAILS: "/raffles/:id",

  WHEELS: "/wheels",
  WHEEL_DETAILS: "/wheels/:id",
};

export const ROUTE_PATHS = {
  leaderboardDetails: (id: string) => `/leaderboards/${id}`,
  raffles: () => "/raffles",
  raffleDetails: (id: string) => `/raffles/${id}`,
  wheels: () => "/wheels",
  wheelDetails: (id: string) => `/wheels/${id}`,
};
