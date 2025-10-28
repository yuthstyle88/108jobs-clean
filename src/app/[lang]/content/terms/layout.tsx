import Footer from "@/components/Footer";
import HeaderSimple from "@/components/HeaderSimple";
import {generateLocalizedMetadata} from "@/lib/metadata";
import {LayoutProps} from "@/types/layout";
import {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateLocalizedMetadata("term");
}

export default function ProfileLayout({children}: LayoutProps) {
  return (
    <>
      <div>
        <HeaderSimple/>
      </div>
      <section className="bg-white min-h-screen">
        {children}
      </section>
      <Footer/>
    </>
  );
}

