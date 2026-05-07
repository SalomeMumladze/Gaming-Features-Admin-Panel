import React, { createContext } from "react";

export const ServerTableContext = createContext<any>(null);

export function useServerTable() {
  const ctx = React.useContext(ServerTableContext);
  if (!ctx)
    throw new Error("useServerTable must be inside ServerTableProvider");
  return ctx;
}
