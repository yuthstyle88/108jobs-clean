import HeaderSimple from "@/components/HeaderSimple";
import {generateLocalizedMetadata} from "@/lib/metadata";
import {LayoutProps} from "@/types/layout";

export async function generateMetadata() {
  return generateLocalizedMetadata("how");
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
    </>
  );
}

