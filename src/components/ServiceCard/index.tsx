import React from "react";
import {cn} from "@/lib/utils";
import Image, {StaticImageData} from "next/image";

interface ServiceCardProps {
  title: string;
  image: StaticImageData;
  className?: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  image,
  className,
  delay = 0,
}) => {
  return (
    <div
      className={cn(
        "service-card bg-white rounded-xl overflow-hidden shadow-lg animate-scale-up relative",
        className
      )}
      style={{animationDelay: `${delay}ms`}}
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 py-2 px-4 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white font-medium text-sm">{title}</p>
      </div>
    </div>
  );
};
export default ServiceCard;
