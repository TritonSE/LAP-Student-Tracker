import React, {useContext, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useRouter} from "next/router";
import {Loader} from "./Loader";

// functions to redirect users if they have not been logged in
const AuthGuard: React.FC = ({ children }) => {
  const { user, initializing } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!initializing) {
      //auth is initialized and there is no user
      if (user === null) {
        router.push("/login");
      }
    }
  }, [initializing, router, user]);

  // if auth initialized with a valid user show protected page
  if (!initializing && user !== null) {
    return <>{children}</>;
  }

  /* return a loading indicator while things are initializing and redirect has not happened yet */
  return <Loader />;
};

export { AuthGuard };
