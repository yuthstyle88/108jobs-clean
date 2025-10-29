"use client";
import {ProfileImage} from "@/constants/images";
import {useLanguage} from "@/contexts/LanguageContext";
import {useMyUser} from "@/hooks/api/profile/useMyUser";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";

const SpUserAvatar = () => {
  const pathname = usePathname();
  const {lang} = useLanguage();
  const {person} = useMyUser();

  return (
    <Link prefetch={false}
          href="/profile"
          className={`flex-1 flex items-center justify-center p-2 text-white text-[24px] cursor-pointer ${
            pathname === `/${lang}/profile` ? "bg-primary" : ""
          }`}
    >
      <Image
        src={person?.avatar || ProfileImage.avatar}
        alt="avatar"
        className="rounded-full w-8 h-8 object-cover"
        width={500}
        height={500}
      />
    </Link>
  );
};

export default SpUserAvatar;
