"use client";
import React from "react";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {useGlobalLoader} from "@/hooks/ui/GlobalLoaderContext";

const GlobalLoader = () => {
  const {isLoading} = useGlobalLoader();

  if (!isLoading) return null;
  return <LoadingBlur text={""} />
};

export default GlobalLoader;
