import {motion} from "framer-motion";
import {Clock} from "lucide-react";
import {useState} from "react";

interface CouponCardProps {
  id: number;
  value: number;
  points: number;
  isHotDeal?: boolean;
  delay?: number;
  data: Record<string, string>;
}

const CouponCard = ({
  value,
  points,
  isHotDeal = false,
  delay = 0,
  data,
}: CouponCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, delay}}
      whileHover={{
        y: -8,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ticket Top Part */}
      <motion.div
        className="absolute -right-1 -top-1 z-10 transform rotate-12 origin-bottom-left"
        animate={{rotate: isHovered ? 15 : 12}}
        transition={{duration: 0.2}}
      >
        <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm shadow">
          {data?.labelDiscount}
        </div>
      </motion.div>
      {/* Coupon Card */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative">
        {/* Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <svg
            width="150"
            height="150"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16.2426 7.75736C16.2426 7.75736 14.5 10.5 12 10.5C9.5 10.5 7.75736 7.75736 7.75736 7.75736M7.75736 16.2426C7.75736 16.2426 9.5 13.5 12 13.5C14.5 13.5 16.2426 16.2426 16.2426 16.2426M12 2C12 2 9 5.5 7 12C5 18.5 12 22 12 22C12 22 19 18.5 17 12C15 5.5 12 2 12 2Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        {/* Coupon Content */}
        <div className="p-6">
          {/* Hot Deal Badge */}
          {isHotDeal && (
            <motion.div
              className="flex items-center mb-3 text-orange-500 font-medium"
              initial={{opacity: 0.9}}
              animate={{opacity: isHovered ? 1 : 0.9}}
              transition={{duration: 0.3}}
            >
              <motion.span
                className="mr-1"
                animate={{rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0}}
                transition={{duration: 0.5, ease: "easeInOut"}}
              >
                🔥
              </motion.span>
              Hot Deal
            </motion.div>
          )}
          {/* Coupon Value */}
          <motion.h2
            className="text-xl font-bold text-gray-900 mb-3"
            animate={{scale: isHovered ? 1.03 : 1}}
            transition={{duration: 0.2}}
          >
            คูปองส่วนลด {value} บาท
          </motion.h2>
          {/* Usage Info */}
          <div className="flex items-center text-xs text-gray-500 mb-6">
            <Clock size={14} className="mr-1"/>
            <span>เคยขึ้นแคชแล้ว 0 / 1000000 ครั้ง</span>
          </div>
          {/* Points Button */}
          <motion.button
            className="w-full py-3 rounded-md text-white font-medium text-center coupon-button"
            whileTap={{scale: 0.98}}
            animate={{
              backgroundColor: isHovered ? "#2563eb" : "#60a5fa",
              y: isHovered ? 0 : 2,
            }}
            transition={{duration: 0.2}}
          >
            {points} {data?.labelPoints}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
export default CouponCard;
