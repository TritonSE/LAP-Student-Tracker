import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import { FirebaseError } from "@firebase/util"
import { User } from "../models/users";
import { APIContext } from "./APIContext";

type AuthState = {
  user: User | null;
  error: Error | null;
  initializing: boolean;
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    role: "Admin" | "Teacher" | "Volunteer" | "Parent" | "Student",
    password: string
  ) => void;
  clearError: () => void
};

const init: AuthState = {
  user: null,
  error: null,
  initializing: false,
  login: () => { },
  logout: () => { },
  signup: () => { },
  clearError: () => { }
};

export const AuthContext = createContext<AuthState>(init);

export const AuthProvider: React.FC = ({ children }) => {
  const api = useContext(APIContext);

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const clearError = (): void => {
    setError(null);
  };

  const setFirebaseError = (e: FirebaseError): void => {
    if (e.code === 'auth/wrong-password')
      setError(new Error("Password is incorrect"))
    else if (e.code === 'auth/user-not-found')
      setError(new Error("User does not exist"))
    else if (e.code === 'auth/invalid-email')
      setError(new Error("Invalid email provided"))
    else if (e.code === 'auth/invalid-password')
      setError(new Error("Password must be more than 6 characters in length"))
    else if (e.code === 'auth/email-already-in-use')
      setError(new Error("This user already has an account. Please log in"))
    else setError(new Error(e.message))
  }

  const auth = useMemo(() => {
    const fbConfig = process.env.REACT_APP_FB_CONFIG
      ? JSON.parse(process.env.REACT_APP_FB_CONFIG)
      : {
        apiKey: process.env.REACT_APP_FB_API_KEY || "AIzaSyAx2FF4MDHl7p7p84Y_ZwvnKNxDSVN2dLw",
        authDomain:
          process.env.REACT_APP_FB_AUTH_DOMAIN || "lap-student-tracker-staging.firebaseapp.com",
        projectId: process.env.REACT_APP_FB_PROJECT_ID || "lap-student-tracker-staging",
        appId: process.env.REACT_APP_FB_APP_ID || "1:289395861172:web:14d3154b0aed87f96f99e1",
      };
    const app = firebase.apps[0] || firebase.initializeApp(fbConfig);
    return app.auth();
  }, []);

  // get user data from local/session storage on every refresh
  useEffect(() => {
    (async () => {
      const uid = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("apiToken");
      if (uid && token) {
        // api.setToken(token);
        const user = await api.getUser(uid);
        setUser(user);
        setError(null);
      } else {
        const uid = localStorage.getItem("userId");
        const token = localStorage.getItem("apiToken");

        if (uid && token) {
          // api.setToken(token);
          const user = await api.getUser(uid);
          setUser(user);
          setError(null);
        }
      }
      setInitializing(false);
    })();
  }, []);

  const login = (email: string, password: string, rememberMe: boolean): void => {
    (async () => {
      try {
        clearError();
        const { user: fbUser } = await auth.signInWithEmailAndPassword(email, password);
        if (fbUser === null) {
          setError(new Error("Firebase user does not exist"));
          setUser(null);
          return;
        }
        const jwt = await fbUser.getIdToken();
        // api.setToken(jwt);

        const uid = fbUser.uid;

        if (rememberMe) {
          localStorage.setItem("apiToken", jwt);
          localStorage.setItem("userId", uid);
        } else {
          sessionStorage.setItem("apiToken", jwt);
          sessionStorage.setItem("userId", uid);
        }

        const user = await api.getUser(uid);
        setUser(user);
      } catch (e) {
        if (e instanceof FirebaseError) {
          setFirebaseError(e)
        } else {
          setError(e as Error);
        }
        setUser(null);
      }
    })();
  };

  const logout = (): void => {
    (async () => {
      try {
        if (user === null) {
          setError(new Error("User is not logged in"));
          setUser(null);
          return;
        }
        setUser(null);
        setError(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("apiToken");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("apiToken");
        await auth.signOut();
      } catch (e) {
        setError(e as Error);
        setUser(null);
      }
    })();
  };

  const signup = (
    firstName: string,
    lastName: string,
    email: string,
    role: "Admin" | "Teacher" | "Volunteer" | "Parent" | "Student",
    password: string
  ): void => {
    (async () => {
      try {
        clearError();
        const { user: fbUser } = await auth.createUserWithEmailAndPassword(email, password);
        if (fbUser === null) {
          setError(new Error("Unknown error creating user"));
          setUser(null);
          return;
        }
        const jwt = await fbUser.getIdToken();
        // api.setToken(jwt);

        const uid = fbUser.uid;
        const user = await api.createUser({
          id: uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: role,
        });
        setUser(user);
        sessionStorage.setItem("userId", uid);
        sessionStorage.setItem("apiToken", jwt);
      } catch (e) {
        if (e instanceof FirebaseError) {
          setFirebaseError(e)
        } else {
          setError(e as Error);
        }
        setUser(null);
      }
    })();
  };

  return (
    <AuthContext.Provider value={{ user, login, error, signup, logout, initializing, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
