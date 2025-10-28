import {BusinessImage} from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const VideoPromo = () => {
  return (
    <section className="pt-16 pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {/* Left side - Images */}
          <div className="relative w-full md:w-auto max-w-lg">
            {/* Background image (grayscale) */}
            <div className="absolute -left-10 top-0 w-full h-full -z-10">
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
                alt="Background"
                width={500}
                height={500}
                className="w-full h-full object-cover grayscale opacity-40"
              />
            </div>

            {/* Main video */}
            <video
              className="w-[300px] h-[500px] relative z-10"
              src="https://www.fastworkbusiness.com/wp-content/uploads/2023/06/aniamatedFinal.mp4"
              autoPlay
              controls
              playsInline
              controlsList="nodownload"
            ></video>

            <div className="absolute top-[160px] left-[-250px] -z-0">
              <Image
                src={BusinessImage.business6}
                alt="Background"
                width={320}
                height={450}
                className="w-[320px] h-[450px]"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-center md:text-left max-w-xs">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">ทำไมต้อง</h2>

            <div className="mb-8">
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  {/* 108jobs logo */}
                  <div className="flex items-center">
                    <Image
                      src={BusinessImage.logoBusiness}
                      alt="Background"
                      width={320}
                      height={450}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Link prefetch={false}
                  href="/contact"
                  className="inline-block bg-white border-2 border-fastwork-blue text-fastwork-blue py-2 px-8 rounded-md font-medium transition-all duration-300 hover:bg-fastwork-blue hover:text-white"
            >
              ปรึกษาเรา
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default VideoPromo;
