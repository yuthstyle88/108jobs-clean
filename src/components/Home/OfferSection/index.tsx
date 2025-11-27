import {CompareImage} from "@/constants/images";
import {faArrowRight, faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion"; // Optional: npm install framer-motion

const OfferSection = () => {
    const {t} = useTranslation();

    const cardData = [
        {
            image: CompareImage.compare1,
            title: "Freelancer",
            badge: null,
            contents: [
                "home.contentQualityOfferFreelancerCard1",
                "home.contentQualityOfferFreelancerCard2",
            ],
        },
        {
            image: CompareImage.compare2,
            title: t("home.tittleQualityOfferSpecialistCard"),
            badge: t("home.tittleQualityOfferSpecialistCard"),
            badgeStyle: "bg-indigo-100 text-indigo-700 border border-indigo-300",
            contents: [
                "home.contentQualityOfferSpecialistCard1",
                "home.contentQualityOfferSpecialistCard2",
                "home.contentQualityOfferSpecialistCard3",
                "home.contentQualityOfferSpecialistCard4",
            ],
        },
        {
            image: CompareImage.compare3,
            title: t("home.tittleQualityOfferProfessionalCard"),
            badge: t("home.tittleQualityOfferProfessionalCard"),
            badgeStyle: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg",
            recommended: true, // Special flag
            contents: [
                "home.contentQualityOfferProfessionalCard1",
                "home.contentQualityOfferProfessionalCard2",
                "home.contentQualityOfferProfessionalCard3",
                "home.contentQualityOfferProfessionalCard4",
                "home.contentQualityOfferProfessionalCard5",
                "home.contentQualityOfferProfessionalCard6",
            ],
        },
    ];

    return (
        <section
            className="py-16 lg:py-24 overflow-hidden"
            style={{
                background: "linear-gradient(to top, hsl(216, 85%, 94%), #ffffff 40%)",
            }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Section Title */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6}}
                    className="text-center mb-12 lg:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        {t("home.tittleQualityOfferSection")}
                    </h2>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {cardData.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.5, delay: index * 0.15}}
                            whileHover={{y: -8}}
                            className={`relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300
                                        ${card.recommended ? "ring-2 ring-blue-500 ring-offset-2" : "shadow-xl hover:shadow-2xl"} 
                                        ${card.recommended ? "lg:scale-105" : ""}`}
                        >
                            {/* Card Content */}
                            <div className="p-6 lg:p-8 flex-1 flex flex-col">
                                <div className="flex justify-center mb-6 -mt-2">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <Image
                                            src={card.image}
                                            alt={card.title}
                                            width={180}
                                            height={180}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
                                    {card.title}
                                </h3>

                                <ul className="space-y-3 flex-1">
                                    {card.contents.map((contentKey, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div
                                                className="flex-shrink-0 w-5 h-5 mt-0.5 bg-blue-100 rounded-full flex items-center justify-center">
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                    className="w-3 h-3 text-blue-600"
                                                />
                                            </div>
                                            <span className="text-gray-700 text-sm leading-relaxed">
                                                {t(contentKey)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default OfferSection;