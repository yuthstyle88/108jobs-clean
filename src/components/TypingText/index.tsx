"use client";

import {useTranslation} from "react-i18next";
import {TypeAnimation} from "react-type-animation";

const TypingText = () => {
  const {t, i18n} = useTranslation();
  return (
    <TypeAnimation
      key={i18n.language}
      sequence={[
        t("global.labelNavBarItem2"),
        1200,
        t("global.labelNavBarItem3"),
        1200,
        t("global.labelNavBarItem4"),
        1200,
        t("global.labelNavBarItem5"),
        1200,
        t("global.labelNavBarItem6"),
        1200,
        t("global.labelNavBarItem7"),
        1200,
        t("global.labelNavBarItem8"),
        1200,
      ]}
      omitDeletionAnimation
      repeat={Infinity}
      className="text-[48px] font-medium text-center"
    />
  );
};

export default TypingText;
