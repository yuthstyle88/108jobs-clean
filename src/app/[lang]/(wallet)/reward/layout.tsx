import FaqReward from "@/components/FaqReward";
import RewardHeader from "@/components/RewardHeader";
import {ReactNode} from "react";

interface RewardLayoutProps {
  children: ReactNode;
}

export default function RewardLayout({children}: RewardLayoutProps) {
  return (
    <>
      <div className="hidden sm:block bg-primary-">
        <RewardHeader/>
      </div>
      <div className="block sm:hidden">
        <RewardHeader/>
      </div>
      <section className="bg-white">{children}</section>
      <FaqReward/>
    </>
  );
}