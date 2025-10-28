"use client";
import React from "react";
import {useGlobalError} from "@/contexts/GlobalErrorContext";

const GlobalError = () => {
  const {error, clearError} = useGlobalError();

  if (!error) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white font-medium text-center py-3 z-50">
      <div>
        {error}
        <button
          onClick={clearError}
          className="ml-4 bg-white text-red-500 px-3 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GlobalError;