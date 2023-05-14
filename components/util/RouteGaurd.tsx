import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { CustomLoader } from "./CustomLoader";

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
    if (user.role == "Volunteer" && !user.onboarded) {
      router.push("/volunteeronboarding");
    } else if (user.approved) {
      return <>{children}</>;
    } else if (!user.approved && user.role == "Volunteer") {
      return <>{children}</>;
    } else {
      router.push("/unapproved");
    }
  }

  /* return a loading indicator while things are initializing and redirect has not happened yet */
  return <CustomLoader />;
};

export { AuthGuard };
