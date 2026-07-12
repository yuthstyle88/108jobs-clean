"use client";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

export const useScrollHandler = (forceShowSearch: boolean = false) => {
    const pathname = usePathname();
    const [scrollY, setScrollY] = useState(0);
    const [scrollShowSearch, setScrollShowSearch] = useState(false);

    const isHomePage = pathname === "/" || /^\/[a-z]{2}(-[a-z]{2})?\/?$/.test(pathname);
    const forceVisible = !isHomePage || forceShowSearch;

    useEffect(() => {
            if (forceVisible) {
                return;
            }

            const updateState = () => {
                const currentScrollY = window.scrollY;
                const isSmallScreen = window.innerWidth <= 1280;
                setScrollY(currentScrollY);

                if (isSmallScreen) {
                    setScrollShowSearch(true);
                } else {
                    setScrollShowSearch(currentScrollY > window.innerHeight / 2);
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
        [forceVisible]);

    return {scrollY, showSearch: forceVisible || scrollShowSearch};
};
