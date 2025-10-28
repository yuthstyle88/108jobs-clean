"use client";
import React from "react";
import Link from "next/link";
import {Search} from "lucide-react";
import Image, {StaticImageData} from "next/image";
import {BusinessImage} from "@/constants/images";
import {usePathname} from "next/navigation";
import {scrollToElementById} from "@/utils";

interface ServiceItemProps {
  title: string;
  image: StaticImageData;
  delay?: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  image,
  delay = 0,
}) => {
  return (
    <div
      className="service-item bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg animate-on-scroll"
      style={{animationDelay: `${delay}ms`}}
    >
      <div className="relative h-60 overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="flex justify-between items-center p-4">
        <h3 className="text-fastwork-blue font-medium">{title}</h3>
        <Link prefetch={false} href="/services" className="text-fastwork-blue">
          <Search size={20} className="transition-transform hover:scale-110"/>
        </Link>
      </div>
    </div>
  );
};
const ServiceGrid: React.FC = () => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/business") {
      e.preventDefault();
      scrollToElementById("contact");
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">
            บริการของเรา
          </h2>
          <p className="text-gray-600">
            ครอบคลุมทุกความต้องการด้านธุรกิจ มากกว่า 90 บริการ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ServiceItem
            title="Design & Graphic"
            image={BusinessImage.business2}
            delay={100}
          />
          <ServiceItem
            title="Online Marketing"
            image={BusinessImage.business3}
            delay={200}
          />
          <ServiceItem
            title="Photoshoot & Video Production"
            image={BusinessImage.business4}
            delay={300}
          />
          <ServiceItem
            title="Operation & Consultant"
            image={BusinessImage.business5}
            delay={400}
          />
          <ServiceItem
            title="Writing & Translation"
            image={BusinessImage.business6}
            delay={500}
          />
          <ServiceItem
            title="Web & Programming"
            image={BusinessImage.business1}
            delay={600}
          />
        </div>

        <div className="flex justify-center">
          <Link prefetch={false}
                href="/business#contact"
                onClick={handleClick}
                className="border border-gray-300 text-gray-700 py-3 px-12 rounded-md font-medium transition-all duration-300 hover:bg-gray-100"
          >
            บริการเรา
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ServiceGrid;
