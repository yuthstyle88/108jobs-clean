"use client";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {Person} from "lemmy-js-client";
import {ProfileImage} from "@/constants/images";
import {useMyUser} from "@/hooks/api/profile/useMyUser";
import ChatNoWorkButton from "@/components/Common/Button/ChatNoWorkButton";

interface ProfileSidebarProps {
    profile: Person;
}

// Reusable EditButton component for consistency
const EditButton: React.FC<{ href: string; label: string }> = ({href, label}) => (
    <Link
        prefetch={false}
        href={href}
        className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label={label}
    >
        <FontAwesomeIcon icon={faEdit} className="text-gray-600"/>
    </Link>
);

const ProfileAvatar: React.FC<{ profile: Person; isOwnProfile: boolean }> = ({profile, isOwnProfile}) => (
    <div className="flex flex-col items-center">
        <div className="relative">
            <Image
                src={profile?.avatar || ProfileImage.avatar}
                alt={profile?.name || "User avatar"}
                className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-white shadow-md"
                width={160}
                height={160}
            />
            {isOwnProfile && <EditButton href="/account-setting/basic-information" label="Edit profile picture"/>}
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">{profile?.displayName ?? profile?.name}</h2>
    </div>
);

const BioSection: React.FC<{ profile: Person; isOwnProfile: boolean }> = ({profile, isOwnProfile}) => {
    const {t} = useTranslation();
    const [showFullBio, setShowFullBio] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const bioRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (bioRef.current) {
            setIsClamped(bioRef.current.scrollHeight > bioRef.current.clientHeight);
        }
    }, [profile?.bio]);

    return (
        <div className="mt-6 px-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-primary font-semibold">{t("profile.bio")}</h3>
                {isOwnProfile && <EditButton href="/account-setting/basic-information" label="Edit bio"/>}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p
                    ref={bioRef}
                    className={`text-gray-600 text-sm leading-relaxed ${showFullBio ? "" : "line-clamp-4"}`}
                >
                    {profile?.bio || t("profile.noBio")}
                </p>
                {isClamped && !showFullBio && (
                    <button
                        onClick={() => setShowFullBio(true)}
                        className="mt-2 text-primary text-sm font-medium hover:underline"
                    >
                        {t("profile.seeMore")}
                    </button>
                )}
            </div>
        </div>
    );
};

const SkillsSection: React.FC<{ profile: Person; isOwnProfile: boolean }> = ({profile, isOwnProfile}) => {
    const {t} = useTranslation();

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-primary font-semibold">{t("profile.coreSkills")}</h3>
                {isOwnProfile && <EditButton href="/account-setting/basic-information" label="Edit skills"/>}
            </div>
            <div className="flex flex-wrap gap-2">
                {profile?.skills ? (
                    profile.skills.split(",").map((skill, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
              {skill.trim()}
            </span>
                    ))
                ) : (
                    <p className="text-gray-600 text-sm">{t("profile.noSkills")}</p>
                )}
            </div>
        </div>
    );
};

const ContactInfoSection: React.FC<{ profile: Person; isOwnProfile: boolean }> = ({profile, isOwnProfile}) => {
    const {t} = useTranslation();

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-primary font-semibold">{t("profileInfo.sectionContactInfo")}</h3>
                {isOwnProfile && <EditButton href="/account-setting/basic-information" label="Edit contact info"/>}
            </div>
            <div className="flex flex-wrap gap-2">
                {profile?.contacts ? (
                    profile.contacts.split(",").map((contact, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
              {contact.trim()}
            </span>
                    ))
                ) : (
                    <p className="text-gray-600 text-sm">{t("profile.noContacts")}</p>
                )}
            </div>
        </div>
    );
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({profile}) => {
    const {person: currentUserProfile} = useMyUser();
    const isOwnProfile = currentUserProfile?.id === profile?.id;

    return (
        <aside className="lg:col-span-1">
            <div
                className="bg-white shadow-lg rounded-2xl p-6 -mt-24 relative transition-all duration-300 hover:shadow-xl">
                <ProfileAvatar profile={profile} isOwnProfile={isOwnProfile}/>
                <BioSection profile={profile} isOwnProfile={isOwnProfile}/>
                <SkillsSection profile={profile} isOwnProfile={isOwnProfile}/>
                <ContactInfoSection profile={profile} isOwnProfile={isOwnProfile}/>
                {!isOwnProfile && <ChatNoWorkButton profile={profile} currentUserId={currentUserProfile?.id}/>}
            </div>
        </aside>
    );
};

export default ProfileSidebar;