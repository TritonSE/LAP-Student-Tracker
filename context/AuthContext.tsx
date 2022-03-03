import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import { Navbar } from '../components/Navbar';
import { User } from '../models/users';
import { APIContext } from "./APIContext";

type AuthState = {
  user: User | null,
  loggedIn: boolean,
  error: Error | null,
  login: (email: string, password: string, rememberMe: boolean) => void,
  // logout: () => void,
  signup: (firstName: string, lastName: string, email: string, role: "Teacher" | "Admin", password: string) => void
  // clearError: () => void
}

const init: AuthState = {
  user: null,
  loggedIn: false,
  error: null,
  login: () => { },
  // logout: () => { },
  signup: () => { },
}

export const AuthContext = createContext<AuthState>(init);

export const AuthProvider: React.FC = ({ children }) => {
  const api = useContext(APIContext);


  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const loggedIn = user !== null;
  const clearError = (): void => {
    setError(null);
  }

  const auth = useMemo(() => {
    const fbConfig = process.env.REACT_APP_FB_CONFIG ? JSON.parse(process.env.REACT_APP_FB_CONFIG) : {
      apiKey: process.env.REACT_APP_FB_API_KEY || 'AIzaSyAx2FF4MDHl7p7p84Y_ZwvnKNxDSVN2dLw',
      authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN || 'lap-student-tracker-staging.firebaseapp.com',
      projectId: process.env.REACT_APP_FB_PROJECT_ID || 'lap-student-tracker-staging',
      appId: process.env.REACT_APP_FB_APP_ID || '1:289395861172:web:14d3154b0aed87f96f99e1',
    };
    const app = firebase.apps[0] || firebase.initializeApp(fbConfig);
    return app.auth();
  }, []);

  useEffect(() => {
    (async () => {
      const uid = sessionStorage.getItem('userId');
      const token = sessionStorage.getItem('apiToken');
      if (uid && token) {
        // api.setToken(token);
        const user = await api.getUser(uid);
        setUser(user);
        setError(null);
      } else {
        const uid = localStorage.getItem('userId');
        const token = localStorage.getItem('apiToken');

        if (uid && token) {
          // api.setToken(token);
          const user = await api.getUser(uid);
          setUser(user);
          setError(null);
        }
      }
    })();
  }, []);

  //do errors
  const login = (email: string, password: string, rememberMe:boolean): void => {
    (async() => {
      try{
        const { user: fbUser } = await auth.signInWithEmailAndPassword(email, password);
        if (fbUser === null){
          setError( new Error("Firebase user does not exist"));
          setUser(null);
          return;
        }
        const jwt = await fbUser.getIdToken();
        // api.setToken(jwt);

        const uid = fbUser.uid;

        if (rememberMe){
          localStorage.setItem('apiToken', jwt);
          localStorage.setIten('userId', uid);
        }
        else{
          sessionStorage.setItem('apiToken', jwt);
          sessionStorage.setIten('userId', uid);
        }

        const user = await api.getUser(uid);
        setUser(user);

      }
      catch (e) {
        setError(e as Error);
        setUser(null);
      }
    })
  }

  const signup = (firstName: string, lastName: string, email: string, role: "Admin" | "Teacher", password: string): void => {
    (async () => {
      try {
        const { user: fbUser } = await auth.createUserWithEmailAndPassword(email, password);
        if (fbUser === null) {
          setError(new Error('Unknown error creating user'));
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
      } catch (e) {
        setError(e as Error);
        setUser(null);
      }
    })();
  };

  return (<AuthContext.Provider
    value={{ user, login, loggedIn, error, signup }}
  >
    {children}
  </AuthContext.Provider>);



}