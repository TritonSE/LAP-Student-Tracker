import React, { createContext } from "react";
import { LeagueAPI } from "./LeagueAPI";

// Backend URL
const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const initialState: LeagueAPI = new LeagueAPI(baseURL);

export const APIContext = createContext<LeagueAPI>(initialState);

// API Provider
export const APIProvider: React.FC = ({ children }) => {
  const state = initialState;
  return <APIContext.Provider value={state}>{children}</APIContext.Provider>;
};
