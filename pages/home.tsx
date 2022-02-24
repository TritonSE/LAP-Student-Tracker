import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextPage = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(true)



  useEffect(() => {
    setIsLoading(true)
    if (!auth.loggedIn) {
      router.push("/login")
    }
    else {
      setIsLoading(false)
    }
  })
  if (isLoading) return <div>Loading</div>
  return <h1>HOME</h1>;
};
export default Home;
