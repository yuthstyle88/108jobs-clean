import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import {generateLocalizedMetadata} from "@/lib/metadata";
import {ReactNode} from "react";
import {Metadata} from "next";

interface PromotionLayoutProps {
  children: ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  return generateLocalizedMetadata("promotion");
}

export default function PromotionLayout({children}: PromotionLayoutProps) {
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