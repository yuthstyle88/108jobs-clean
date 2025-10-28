import {BusinessImage} from "@/constants/images";
import {ArrowRight} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef} from "react";

const portfolioItems = [
  {
    id: 1,
    image: BusinessImage.business1,
    title: "Digital Marketing Campaign",
    category: "Google Ads",
  },
  {
    id: 2,
    image: BusinessImage.business3,
    title: "Web Design Project",
    category: "UX/UI Design",
  },
  {
    id: 3,
    image: BusinessImage.business2,
    title: "Mobile App Development",
    category: "App Development",
  },
  {
    id: 4,
    image: BusinessImage.business4,
    title: "Product Packaging Design",
    category: "Graphic Design",
  },
  {
    id: 5,
    image: BusinessImage.business5,
    title: "Brand Identity Development",
    category: "Branding",
  },
  {
    id: 6,
    image: BusinessImage.business6,
    title: "Corporate Website Redesign",
    category: "Web Development",
  },
  {
    id: 7,
    image: BusinessImage.business4,
    title: "E-commerce Platform",
    category: "Web Development",
  },
  {
    id: 8,
    image: BusinessImage.business2,
    title: "Social Media Campaign",
    category: "Digital Marketing",
  },
];

const OurWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const items = entry.target.querySelectorAll(".portfolio-item");
              items.forEach((item) => {
                item.classList.add("animate-fade-in");
              });

              const animatedElements =
                entry.target.querySelectorAll(".animate-on-scroll");
              animatedElements.forEach((el) => {
                el.classList.add("animate-fade-in");
                el.classList.remove("opacity-0");
              });
            }
          });
        },
        {threshold: 0.1}
      );

      const currentSection = sectionRef.current; // Store the reference here

      if (currentSection) {
        observer.observe(currentSection);

        const titleElements =
          currentSection.querySelectorAll(".animate-on-scroll");
        titleElements.forEach((el) => {
          el.classList.add("animate-fade-in");
          el.classList.remove("opacity-0");
        });
      }

      return () => {
        if (currentSection) {
          observer.unobserve(currentSection);
        }
      };
    },
    []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-on-scroll animate-fade-in">
              Our Latest Works
            </h2>
            <p className="text-gray-600 max-w-2xl animate-on-scroll animate-fade-in">
              Explore our portfolio of successful projects and creative
              solutions that have helped our clients achieve their business
              goals.
            </p>
          </div>

          <Link prefetch={false}
                href="/works"
                className="flex items-center gap-2 text-fastwork-blue font-medium group transition-all duration-300 animate-on-scroll animate-fade-in self-start md:self-auto"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="portfolio-item relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl bg-white animate-fade-in"
            >
              <Link prefetch={false} href="/works" className="block h-full">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600} // Set width according to the image aspect ratio
                    height={400} // Set height accordingly
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-fastwork-blue inline-block mb-2 bg-blue-50 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">View Project</span>
                    <ArrowRight
                      className="h-4 w-4 text-fastwork-blue opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"/>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link prefetch={false}
                href="/works"
                className="bg-white border-2 border-fastwork-blue text-fastwork-blue hover:bg-fastwork-blue hover:text-white py-3 px-8 rounded-md font-medium transition-all duration-300 animate-fade-in"
          >
            ดูผลงานทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurWorks;
