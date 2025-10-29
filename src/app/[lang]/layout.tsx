import {LanguageProvider} from "@/contexts/LanguageContext";
import {Kanit} from "next/font/google";
import {Toaster} from "sonner";
import FontAwesomeConfig from "../fontawesome";
import "../globals.css";
import React from "react";
import {isoDataInitializer} from "@/utils";
import {GlobalLoaderProvider} from "@/contexts/GlobalLoaderContext";
import {GlobalErrorProvider} from "@/contexts/GlobalErrorContext";
import {AnnouncementProvider} from "@/contexts/AnnouncementContext";
import AccessibleAnnouncements from "@/components/AccessibleAnnouncements";
import GlobalError from "@/components/GlobalError";
import GlobalLoader from "@/components/Common/Loading/Loading";
import {getCookies} from "@/utils/getCookies";
import { UserServiceProvider } from "@/contexts/UserServiceContext";

const kanit = Kanit({
    subsets: ["latin", "vietnamese", "thai"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    display: "swap",
    preload: true,
    fallback: ['system-ui', 'arial', 'sans-serif'],
    adjustFontFallback: true,
})

export default async function RootLayout({
                                             children,
                                             params,
                                         }: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}>) {
    const { lang } = await params;
    const isoData = await isoDataInitializer();
    const [langCookie, tokenCookie] = await getCookies();
    const userLang = isoData?.myUserInfo?.localUserView?.localUser?.interfaceLanguage as string | undefined;
    const initialLang = langCookie || lang || userLang;
    return (
        <html lang={initialLang} suppressHydrationWarning>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="dns-prefetch" href="https://fonts.googleapis.com"/>
            <FontAwesomeConfig/>
        </head>
        <body suppressHydrationWarning className={`${kanit.className} antialiased bg-white`}>
        <script
            dangerouslySetInnerHTML={{
                __html: `window.isoData = ${JSON.stringify(isoData)};`,
            }}
        />
        <LanguageProvider initialLang={initialLang!}>
            <UserServiceProvider
                token={tokenCookie ?? ""}
            >
                <GlobalErrorProvider>
                    <GlobalLoaderProvider>
                        <AnnouncementProvider>
                                <Toaster richColors closeButton position="bottom-right"/>
                                <AccessibleAnnouncements/>
                                <GlobalError/>
                                <GlobalLoader/>
                                {children}
                        </AnnouncementProvider>
                    </GlobalLoaderProvider>
                </GlobalErrorProvider>
            </UserServiceProvider>
        </LanguageProvider>
        </body>
        </html>
    );
}