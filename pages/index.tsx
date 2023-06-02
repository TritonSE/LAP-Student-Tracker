import React, { useEffect } from "react";
import type { NextApplicationPage } from "./_app";
import { useRouter } from "next/router";
import { CustomLoader } from "../components/util/CustomLoader";

//if anyone goes to the base URL -> redirect them to the home page
const Index: NextApplicationPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  });

  return <CustomLoader />;
};

Index.title = "Home";

export default Index;
