import {LandingImage} from "@/constants/images";
import Image from "next/image";

export default function Error() {

  return (
    <div className="relative min-h-screen w-full h-full flex items-center justify-center bg-secondary">

      <Image
        src={LandingImage.bgError}
        alt="error"
        fill
        className="object-cover md:block hidden"
      />
      <Image
        src={LandingImage.errorMobile}
        alt="error"
        fill
        className="object-cover"
      />
      <div className="flex flex-col items-center gap-16 mx-2">
        <Image
          src={LandingImage.error}
          alt="error"
          className="w-[80%] h-[280px] sm:w-full"
        />
        <p className="text-center text-[20px] md:text-[32px] text-text-primary font-sans">ขออภัย มีข้อผิดพลาดบางอย่างเกิดขึ้น</p>
      </div>
    </div>
  );
}
