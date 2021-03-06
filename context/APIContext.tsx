import React, { createContext } from "react";
import { LeagueAPI } from "./LeagueAPI";

// Backend URL
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const initialState: LeagueAPI = new LeagueAPI(baseURL);

export const APIContext = createContext<LeagueAPI>(initialState);

// API Provider
export const APIProvider: React.FC = ({ children }) => {
  return <APIContext.Provider value={initialState}>{children}</APIContext.Provider>;
};
