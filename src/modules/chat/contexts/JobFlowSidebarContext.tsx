"use client";

import React, {createContext, useCallback, useContext, useMemo, useState} from "react";

export type JobFlowSidebarContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  content: React.ReactNode | null;
  setContent: (node: React.ReactNode | null) => void;
};

const JobFlowSidebarContext = createContext<JobFlowSidebarContextValue | undefined>(undefined);

export function JobFlowSidebarProvider({children}: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const setOpen = useCallback((open: boolean) => setIsOpen(open), []);

  const value = useMemo(() => ({
    isOpen,
    setOpen,
    content,
    setContent,
  }), [isOpen, setOpen, content]);

  return (
    <JobFlowSidebarContext.Provider value={value}>
      {children}
    </JobFlowSidebarContext.Provider>
  );
}

export function useJobFlowSidebar() {
  const ctx = useContext(JobFlowSidebarContext);
  if (!ctx) throw new Error("useJobFlowSidebar must be used within JobFlowSidebarProvider");
  return ctx;
}
