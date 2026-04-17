export const P = {
  HOME: "/",

  LEADERBOARDS: {
    INDEX: "/leaderboards",
    DETAILS: "/leaderboards/:id",
  },
  RAFFLES: {
    INDEX: "/raffles",
    DETAILS: "/raffles/:id",
  },
  WHEELS: {
    INDEX: "/wheels",
    DETAILS: "/wheels/:id",
  },
};

export const ROUTE_PATHS = {
  leaderboardDetails: (id: string) => `/leaderboards/${id}`,
  raffles: () => "/raffles",
  raffleDetails: (id: string) => `/raffles/${id}`,
  wheels: () => "/wheels",
  wheelDetails: (id: string) => `/wheels/${id}`,
};
