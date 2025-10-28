"use client";
import {ReactNode} from "react";

interface CreateJobLayoutProps {
  children: ReactNode;
}

const CreateJobLayout = ({children}: CreateJobLayoutProps) => {
  return <>{children}</>;
};

export default CreateJobLayout; 