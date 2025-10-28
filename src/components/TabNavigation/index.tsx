"use client";
import {ReactNode, useEffect, useState} from "react";

interface TabNavigationProps {
  children: ReactNode[];
  tabLabel: string[];
}

export default function TabNavigation({
  children,
  tabLabel,
}: TabNavigationProps) {
  const [currentTab, setCurrentTab] = useState(0);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 200;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({top: sectionPosition - offset, behavior: "smooth"});
    }
  };

  useEffect(() => {
      const handleScroll = () => {
        const sections = document.querySelectorAll("div.section");

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            setCurrentTab(Number(section.id));
          }
        });
      };

      window.addEventListener("scroll",
        handleScroll);
      return () => window.removeEventListener("scroll",
        handleScroll);
    },
    []);

  return (
    <div className="">
      <div className="sticky top-[48px] md:top-[70px] z-10 w-full bg-white overflow-y-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b-[2px] border-b-border-primary">
          {tabLabel.map((value, index) => (
            <div
              key={index}
              className={`relative hover:text-third duration-150 flex justify-center items-center cursor-pointer px-4 py-3 font-bold ${
                currentTab === index
                  ? "text-third  after:absolute after:bottom-[-2px] after:h-[2px] after:w-full after:bg-third"
                  : "text-text-secondary"
              }`}
              onClick={() => {
                setCurrentTab(index);
                scrollToSection(String(index));
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
      <div className="">
        {children.map((child, index) => (
          <div key={index} className="section py-6" id={String(index)}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
