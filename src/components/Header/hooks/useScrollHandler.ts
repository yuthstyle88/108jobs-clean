"use client";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

export const useScrollHandler = (forceShowSearch: boolean = false) => {
    const pathname = usePathname();
    const [scrollY, setScrollY] = useState(0);
    const [showSearch, setShowSearch] = useState(false);

    const isHomePage = pathname === "/" || /^\/[a-z]{2}(-[a-z]{2})?\/?$/.test(pathname);

    useEffect(() => {
            if (!isHomePage || forceShowSearch) {
                setShowSearch(true);
                return;
            }

            const updateState = () => {
                const currentScrollY = window.scrollY;
                const isSmallScreen = window.innerWidth <= 1280;
                setScrollY(currentScrollY);

                if (isSmallScreen) {
                    setShowSearch(true);
                } else {
                    setShowSearch(currentScrollY > window.innerHeight / 2);
                }
            };

            window.addEventListener("scroll",
                updateState);
            window.addEventListener("resize",
                updateState);
            updateState();

            return () => {
                window.removeEventListener("scroll",
                    updateState);
                window.removeEventListener("resize",
                    updateState);
            };
        },
        [forceShowSearch]);

    return {scrollY, showSearch};
};
