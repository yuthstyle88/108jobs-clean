import PopularSubCat from "@/components/PopularSubcat";
import {generateLocalizedMetadata} from "@/lib/metadata";
import {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateLocalizedMetadata("catalog");
}

export default async function Categories({
  params,
}: {
  params: Promise<{name: string}>;
}) {
  const resolvedParams = await params;
  return (
    <main className="grid-container-desktop-banner w-full min-h-screen">
      <PopularSubCat name={resolvedParams.name}/>
    </main>
  );
}

