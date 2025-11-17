import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {LANGUAGE_COOKIE} from "@/constants/language";

export default async function NotFoundPage() {
    const cookiesList = await cookies();
    const langCookie = cookiesList.get(LANGUAGE_COOKIE)?.value ?? "en";

    redirect(`/${langCookie}/not-found`);
}
