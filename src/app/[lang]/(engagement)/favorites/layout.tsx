import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import {ReactNode} from "react";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({children}: ProfileLayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary"/>
      </div>
      <div className="block sm:hidden">
        <SpHeader showSearch={false}/>
      </div>
      <section className="pt-[3rem] sm:pt-[4.5rem] bg-white">
        {children}
      </section>
      <Footer/>
    </>
  );
}