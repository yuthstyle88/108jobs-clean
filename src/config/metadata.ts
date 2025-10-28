import {Metadata} from "next";
import {getAppName} from "@/utils/appConfig";

export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://108jobs.com"),
  title: getAppName()+" แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
  description:
    "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
  applicationName: getAppName(),
  openGraph: {
    title:
      getAppName()+" แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
    description:
      "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
    url: "https://108jobs.com",
    siteName: getAppName(),
    images: [
      {
        url: "https://108jobs.com/static-v4/images/home/og-image-home-th.jpg",
        width: 1200,
        height: 630,
        alt: getAppName()+" แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
      },
    ],
    type: "website",
    locale: "thTh",
  },
  alternates: {
    canonical: "https://test-fastwork.vercel.app",
    languages: {
      th: "https://test-fastwork.vercel.app/th",
      en: "https://test-fastwork.vercel.app/en",
      vi: "https://test-fastwork.vercel.app/vi",
    },
  },

  referrer: "strict-origin-when-cross-origin",
};