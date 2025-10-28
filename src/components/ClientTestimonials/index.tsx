import React, {useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {cn} from "@/lib/utils";
import Image, {StaticImageData} from "next/image"; // Import Image from next/image
import {BusinessImage} from "@/constants/images";
import {t} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";

type TestimonialType = {
  id: number;
  logoSrc: StaticImageData;
  logoAlt: string;
  testimonial: string;
  author: string;
  position: string;
};

// Create testimonials array from translations
const createTestimonialsFromTranslations = () => {
  return [
    {
      id: 1,
      logoSrc: BusinessImage.logoCustomer1,
      logoAlt: t(LanguageFile.HOME, "home_testimonial_1_logo_alt"),
      testimonial: t(LanguageFile.HOME, "home_testimonial_1_text"),
      author: t(LanguageFile.HOME, "home_testimonial_1_author"),
      position: t(LanguageFile.HOME, "home_testimonial_1_position"),
    },
    {
      id: 2,
      logoSrc: BusinessImage.logoCustomer2,
      logoAlt: t(LanguageFile.HOME, "home_testimonial_2_logo_alt"),
      testimonial: t(LanguageFile.HOME, "home_testimonial_2_text"),
      author: t(LanguageFile.HOME, "home_testimonial_2_author"),
      position: t(LanguageFile.HOME, "home_testimonial_2_position"),
    },
    {
      id: 3,
      logoSrc: BusinessImage.logoCustomer3,
      logoAlt: t(LanguageFile.HOME, "home_testimonial_3_logo_alt"),
      testimonial: t(LanguageFile.HOME, "home_testimonial_3_text"),
      author: t(LanguageFile.HOME, "home_testimonial_3_author"),
      position: t(LanguageFile.HOME, "home_testimonial_3_position"),
    },
  ];
};

const ClientTestimonials = () => {
  // Get testimonials from translations
  const testimonials = createTestimonialsFromTranslations();

  const [activeIndex, setActiveIndex] = useState(1);

  const nextSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
          {t(LanguageFile.HOME, "home_testimonials_title")}
        </h2>

        <div className="relative">
          <div className="flex flex-wrap -mx-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "w-full px-4 transition-opacity duration-500 ease-in-out flex flex-col items-center",
                  activeIndex === index ? "opacity-100" : "opacity-0 hidden"
                )}
              >
                <div className="mb-8 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center p-4 shadow-sm">
                    <Image
                      src={testimonial.logoSrc}
                      alt={testimonial.logoAlt}
                      width={128}
                      height={128}
                      className="w-full h-full max-w-full"
                    />
                  </div>
                </div>

                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {testimonial.testimonial}
                  </p>

                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800">
                      {testimonial.author}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 flex items-center justify-center border border-gray-300 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20}/>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 flex items-center justify-center border border-gray-300 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20}/>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors duration-300",
                activeIndex === index ? "bg-fastwork-blue" : "bg-gray-300"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonials;
