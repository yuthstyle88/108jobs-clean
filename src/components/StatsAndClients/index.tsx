import {BusinessImage} from "@/constants/images";
import {cn} from "@/lib/utils";
import {ChevronLeft, ChevronRight, Star} from "lucide-react";
import Image, {StaticImageData} from "next/image";
import React, {useState} from "react";

const StatsSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div
            className="animate-on-scroll"
            style={{animationDelay: "100ms"}}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-fastwork-blue mb-4">
              90+
            </h3>
            <p className="text-gray-600">ลูกค้ากลุ่มองค์กรที่ใช้บริการ</p>
          </div>

          <div
            className="animate-on-scroll"
            style={{animationDelay: "300ms"}}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-fastwork-blue mb-4">
              25,000+
            </h3>
            <p className="text-gray-600">ฟรีแลนซ์ที่ให้บริการ</p>
          </div>

          <div
            className="animate-on-scroll"
            style={{animationDelay: "500ms"}}
          >
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="w-6 h-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-600">ความพึงพอใจลูกค้า</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ClientLogoProps {
  src: StaticImageData;
  alt: string;
}

const ClientLogo: React.FC<ClientLogoProps> = ({src, alt}) => {
  return (
    <div className="flex items-center justify-center px-6 py-4">
      <Image
        src={src}
        alt={alt}
        width={500}
        height={500}
        className="w-full h-full"
      />
    </div>
  );
};
const ClientsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const clientsData = [
    [
      {
        src: BusinessImage.logoCustomer1,
        alt: "Netflix",
      },
      {
        src: BusinessImage.logoCustomer3,
        alt: "Netflix",
      },
      {
        src: BusinessImage.logoCustomer2,
        alt: "Amazon",
      },
      {
        src: BusinessImage.logoCustomer1,
        alt: "Slack",
      },
      {
        src: BusinessImage.logoCustomer3,
        alt: "Apple",
      },
      {
        src: BusinessImage.logoCustomer2,
        alt: "Apple",
      },
    ],
    [
      {
        src: BusinessImage.logoCustomer3,
        alt: "Google",
      },
      {
        src: BusinessImage.logoCustomer1,
        alt: "Netflix",
      },
      {
        src: BusinessImage.logoCustomer2,
        alt: "Amazon",
      },
      {
        src: BusinessImage.logoCustomer2,
        alt: "Slack",
      },
      {
        src: BusinessImage.logoCustomer1,
        alt: "Apple",
      },
      {
        src: BusinessImage.logoCustomer2,
        alt: "Apple",
      },
    ],
    [
      {
        src: BusinessImage.logoCustomer3,
        alt: "Google",
      },
      {
        src: BusinessImage.logoCustomer1,
        alt: "Netflix",
      },
      {
        src: BusinessImage.logoCustomer2,
        alt: "Amazon",
      },
      {
        src: BusinessImage.logoCustomer1,
        alt: "Slack",
      },
      {
        src: BusinessImage.logoCustomer3,
        alt: "Apple",
      },
      {
        src: BusinessImage.logoCustomer1,
        alt: "Apple",
      },
    ],
  ];
  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-on-scroll">
          our happy clients
        </h2>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600"/>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-600"/>
          </button>

          {/* Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{transform: `translateX(-${currentSlide * 100}%)`}}
            >
              {clientsData.map((slideClients, slideIndex) => (
                <div key={slideIndex} className="min-w-full">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
                    {slideClients.map((client, clientIndex) => (
                      <ClientLogo
                        key={clientIndex}
                        src={client.src}
                        alt={client.alt}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentSlide === index
                    ? "bg-fastwork-blue w-4"
                    : "bg-gray-300"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const StatsAndClients: React.FC = () => {
  return (
    <>
      <StatsSection/>
      <ClientsCarousel/>
    </>
  );
};
export default StatsAndClients;
