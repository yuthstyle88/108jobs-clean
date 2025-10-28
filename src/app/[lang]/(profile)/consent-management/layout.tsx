import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import {ReactNode} from "react";

interface ConsentManagementLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({
  children,
}: ConsentManagementLayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary"/>
      </div>
      <div className="block sm:hidden">
        <SpHeader showSearch={false}/>
      </div>
      <section className="pt-[4rem] md:pt-[4.5rem] bg-white min-h-screen">
        {children}
      </section>
    </>
  );
}