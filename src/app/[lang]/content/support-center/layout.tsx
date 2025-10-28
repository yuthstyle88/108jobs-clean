import Footer from "@/components/Footer";
import HeaderSimple from "@/components/HeaderSimple";
import {generateLocalizedMetadata} from "@/lib/metadata";
import {LayoutProps} from "@/types/layout";

export async function generateMetadata() {
  return generateLocalizedMetadata("supportCenter");
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

