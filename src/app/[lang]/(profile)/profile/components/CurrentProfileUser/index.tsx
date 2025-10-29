"use client";
import React, { useState } from "react";
import { Person } from "lemmy-js-client";
import { useMyUser } from "@/hooks/api/profile/useMyUser";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import PortfolioSlider from "@/components/Profile/PortfolioSlider";
import WorkSamplesSlider from "@/components/Profile/WorkSamplesSlider";
import ImageModal from "@/components/Common/Modal/ImageModal";
import Reviews from "@/components/Profile/Reviews";
import NotFound from "@/components/Common/NotFound";

interface ProfileProps {
    profile: Person | null;
}

const CurrentProfileUser: React.FC<ProfileProps> = ({ profile }) => {
    const { person: currentUserProfile } = useMyUser();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const portfolioItems = profile?.portfolioPics ?? [];
    const workSamples = profile?.workSamples ?? [];
    const isOwnProfile = currentUserProfile?.id === profile?.id;

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    if (!profile) {
        return <NotFound />;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <ProfileHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ProfileSidebar profile={profile} />
                    <section className="lg:col-span-2">
                        <PortfolioSlider
                            portfolioItems={portfolioItems}
                            isOwnProfile={isOwnProfile}
                            onImageClick={openImageModal}
                        />
                        <WorkSamplesSlider workSamples={workSamples} isOwnProfile={isOwnProfile} />
                        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />}
                        <Reviews profileId={profile.id} />
                    </section>
                </div>
            </div>
        </main>
    );
};

export default CurrentProfileUser;