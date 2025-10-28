import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import {LayoutProps} from "@/types/layout";

export default function CategoryLayout({children}: LayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary" forceShowSearch={true}/>
      </div>
      <div className="block sm:hidden">
        <SpHeader/>
      </div>

      <section className="pt-[4.5rem] bg-white">
        {children}
      </section>
      <Footer/>
    </>
  );
}
