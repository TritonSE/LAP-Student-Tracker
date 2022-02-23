import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import { Navbar } from '../components/Navbar';
import { User } from '../models/users';

type AuthState = {
  user: User | null,
  loggedIn: boolean,
  error: Error | null,
  login: (email: string, password: string, rememberMe: boolean) => void,
  logout: () => void,
  signup: (firstName: string, lastName: string, email: string, password: string) => void
  clearError: () => void
}

const init: AuthState = {
  user: null,
  loggedIn: false,
  error: null,
  login: () => { },
  logout: () => { },
  signup: () => { },
}

export const AuthContext = createContext<AuthState>(init);

export const AuthProvider: React.FC = ({ children }) => {
  const api = useContext(APIContext);

  const
}
