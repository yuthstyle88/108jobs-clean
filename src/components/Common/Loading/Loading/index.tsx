"use client";
import React from "react";
import {useGlobalLoader} from "@/contexts/GlobalLoaderContext";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";

const GlobalLoader = () => {
  const {isLoading} = useGlobalLoader();

  if (!isLoading) return null;
  return <LoadingBlur text={""} />
};

export default GlobalLoader;
