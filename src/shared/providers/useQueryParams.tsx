import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type UrlParams = Record<string, string>;

interface UrlContextType {
  searchParams: UrlParams;
  setUrlParams: (newParams: UrlParams, withHistory?: boolean) => void;
  removeParams: (params: string[], withHistory?: boolean) => void;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

interface UrlContextProviderProps {
  children: ReactNode;
}

export const UrlContextProvider: React.FC<UrlContextProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = location.search;

  const [searchParams, setSearchParams] = useState<UrlParams>({});

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(search).entries());
    setSearchParams(params);
  }, [search]);

  const setUrlParams = (newParams: UrlParams, replace = false) => {
    const params = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value);
    });
    navigate(`${location.pathname}?${params.toString()}`, { replace });
  };

  const removeParams = (paramsToRemove: string[], replace = false) => {
    const params = new URLSearchParams(location.search);
    paramsToRemove.forEach((param) => params.delete(param));
    navigate(`${location.pathname}?${params.toString()}`, { replace });
  };

  return (
    <UrlContext.Provider
      value={{
        searchParams,
        setUrlParams,

        removeParams,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};
/**
 * Hook to get and set URL query parameters
 */
const useQueryParams = (): UrlContextType => {
  const context = useContext(UrlContext);
  if (!context)
    throw new Error("useQueryParams must be used within a UrlContextProvider");
  return context;
};

export default useQueryParams;
