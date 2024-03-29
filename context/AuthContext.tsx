import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import { FirebaseError } from "@firebase/util";
import { Roles, UpdateUser, User } from "../models";
import { APIContext } from "./APIContext";

export type AuthState = {
  user: User | null;
  error: Error | null;
  initializing: boolean;
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    role: Roles,
    password: string
  ) => void;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (code: string, newPassword: string) => Promise<boolean>;
  updateUser: (
    id: string,
    currEmail: string,
    currPassword: string,
    newEmail: string,
    newNumber?: string | null,
    newPassword?: string,
    newAddress?: string | null
  ) => Promise<boolean>;
  refreshLocalUser: () => Promise<void>;
};

const init: AuthState = {
  user: null,
  error: null,
  initializing: false,
  login: () => {},
  logout: () => {},
  signup: () => {},
  clearError: () => {},
  forgotPassword: () => {
    return new Promise<boolean>(() => false);
  },
  resetPassword: () => {
    return new Promise<boolean>(() => false);
  },
  updateUser: () => {
    return new Promise<boolean>(() => false);
  },
  refreshLocalUser: () => {
    return new Promise<void>(() => false);
  },
};

export const AuthContext = createContext<AuthState>(init);
// provides the current authenticated user and auth status to the entire app
export const AuthProvider: React.FC = ({ children }) => {
  const api = useContext(APIContext);
  const [locality, setLocality] = useState<string>("Session");

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const clearError = (): void => {
    setError(null);
  };

  // function to handle firebase errors elegantly and display relevant information to the user
  const setFirebaseError = (e: FirebaseError): void => {
    if (e.code === "auth/wrong-password") setError(new Error("Password is incorrect"));
    else if (e.code === "auth/user-not-found") setError(new Error("User does not exist"));
    else if (e.code === "auth/invalid-email") setError(new Error("Invalid email provided"));
    else if (e.code === "auth/invalid-password")
      setError(new Error("Password must be more than 6 characters in length"));
    else if (e.code === "auth/email-already-in-use")
      setError(new Error("This user already has an account. Please log in"));
    else setError(new Error(e.message));
  };

  // gets the auth state ready on every refresh
  const auth = useMemo(() => {
    const fbConfig = {
      apiKey: process.env.NEXT_PUBLIC_FB_API_KEY || "AIzaSyAx2FF4MDHl7p7p84Y_ZwvnKNxDSVN2dLw",
      authDomain:
        process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN || "lap-user-tracker-staging.firebaseapp.com",
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID || "lap-user-tracker-staging",
      appId: process.env.NEXT_PUBLIC_FB_APP_ID || "1:289395861172:web:14d3154b0aed87f96f99e1",
    };
    const app = firebase.apps[0] || firebase.initializeApp(fbConfig);
    return app.auth();
  }, []);

  // get a new token and place it in the appropriate place
  const getNewRefreshToken = async (): Promise<string | null> => {
    if (auth == null) return null;
    if (auth.currentUser == null) return null;
    const newToken = await auth.currentUser.getIdToken(false);

    if (locality == "Local") {
      localStorage.setItem("apiToken", newToken);
    } else {
      sessionStorage.setItem("apiToken", newToken);
    }
    api.setToken(newToken);
    return newToken;
  };

  // get user data from local/session storage on every refresh
  useEffect(() => {
    (async () => {
      setInitializing(true);
      api.setRefreshTokenFunction(getNewRefreshToken);
      const uid = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("apiToken");
      if (uid && token) {
        await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        setLocality("Session");
        api.setToken(token);
        const userObj = sessionStorage.getItem("user");
        let user: User;
        if (userObj) {
          user = JSON.parse(userObj);
        } else {
          user = await api.getUser(uid);
        }
        setUser(user);
        setError(null);
      } else {
        const uid = localStorage.getItem("userId");
        const token = localStorage.getItem("apiToken");
        if (uid && token) {
          setLocality("Local");
          await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
          api.setToken(token);
          const userObj = localStorage.getItem("user");
          let user: User;
          if (userObj) {
            user = JSON.parse(userObj);
          } else {
            user = await api.getUser(uid);
          }
          setUser(user);
          setError(null);
        }
      }
      setInitializing(false);
    })();
  }, []);

  const refreshLocalUser = async (): Promise<void> => {
    setInitializing(true);
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    const uid = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("apiToken");
    if (uid && token) {
      await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      setLocality("Session");
      api.setToken(token);
      const user = await api.getUser(uid);
      setUser(user);
      setError(null);
    } else {
      const uid = localStorage.getItem("userId");
      const token = localStorage.getItem("apiToken");
      if (uid && token) {
        setLocality("Local");
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        api.setToken(token);
        const user = await api.getUser(uid);
        setUser(user);
        setError(null);
      }
    }
    setInitializing(false);
  };

  const login = (email: string, password: string, rememberMe: boolean): void => {
    (async () => {
      try {
        const { user: fbUser } = await auth.signInWithEmailAndPassword(email, password);
        if (fbUser === null) {
          setError(new Error("Firebase user does not exist"));
          setUser(null);
          return;
        }
        const jwt = await fbUser.getIdToken();
        api.setToken(jwt);

        const uid = fbUser.uid;
        const user = await api.getUser(uid);
        // store user in local storage to minimze api calls
        if (rememberMe) {
          localStorage.setItem("apiToken", jwt);
          localStorage.setItem("userId", uid);
          setLocality("Local");
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("apiToken", jwt);
          sessionStorage.setItem("userId", uid);
          sessionStorage.setItem("user", JSON.stringify(user));
        }
        setUser(user);
      } catch (e) {
        if (e instanceof FirebaseError) {
          setFirebaseError(e);
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
        localStorage.removeItem("user");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("apiToken");
        sessionStorage.removeItem("user");
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
    role: Roles,
    password: string
  ): void => {
    (async () => {
      try {
        const { user: fbUser } = await auth.createUserWithEmailAndPassword(email, password);
        if (fbUser === null) {
          setError(new Error("Unknown error creating user"));
          setUser(null);
          return;
        }
        const jwt = await fbUser.getIdToken();
        api.setToken(jwt);

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
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("apiToken", jwt);
      } catch (e) {
        if (e instanceof FirebaseError) {
          setFirebaseError(e);
        } else {
          setError(e as Error);
        }
        setUser(null);
      }
    })();
  };

  //sends cutom email for resetting password to user
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await auth.sendPasswordResetEmail(email);
      return true;
    } catch (e) {
      if (e instanceof FirebaseError) {
        setFirebaseError(e);
      } else {
        setError(e as Error);
      }
      return false;
    }
  };

  //resets password for user
  const resetPassword = async (code: string, newPassword: string): Promise<boolean> => {
    try {
      await auth.verifyPasswordResetCode(code);
      await auth.confirmPasswordReset(code, newPassword);
      return true;
    } catch (e) {
      if (e instanceof FirebaseError) {
        setFirebaseError(e);
      } else {
        setError(e as Error);
      }
      return false;
    }
  };
  const updateUser = async (
    id: string,
    currEmail: string,
    currPassword: string,
    newEmail: string,
    newNumber?: string | null,
    newPassword?: string,
    newAddress?: string | null
  ): Promise<boolean> => {
    try {
      if (currPassword === "") {
        setError(new Error("Password must be specified to change any values"));
        return false;
      }

      const { user: fbUser } = await auth.signInWithEmailAndPassword(currEmail, currPassword);
      if (fbUser === null) {
        setError(new Error("Firebase user does not exist"));
        return false;
      }

      if (newEmail != currEmail) {
        await fbUser.updateEmail(newEmail);
      }

      if (newPassword && newPassword != currPassword) {
        await fbUser.updatePassword(newPassword);
      }

      const updateUser: UpdateUser = {
        phoneNumber: newNumber,
        email: newEmail,
        address: newAddress,
      };
      const newUser = await api.updateUser(updateUser, id);
      setUser(newUser);
      if (locality == "Local") {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        sessionStorage.setItem("user", JSON.stringify(newUser));
      }
      return true;
    } catch (e) {
      if (e instanceof FirebaseError) {
        setFirebaseError(e);
      } else {
        setError(e as Error);
      }
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        error,
        signup,
        logout,
        initializing,
        clearError,
        updateUser,
        forgotPassword,
        resetPassword,
        refreshLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
