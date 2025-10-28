import {generateLocalizedMetadata} from "@/lib/metadata";
import {LayoutProps} from "@/types/layout";
import {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateLocalizedMetadata("login");
}

export default function SingIn({children}: LayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
