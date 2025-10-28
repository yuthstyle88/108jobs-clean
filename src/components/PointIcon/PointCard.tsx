import {ArrowRight} from "lucide-react";
import PointIcon from "./PointIcon";

interface PointCardProps {
  title?: string;
  points?: number;
  subtitle?: string;
  buttonLabel?: string;
  onCheckPoints: () => void;
  viewLabel?: string;
}

const PointCard = ({
  title,
  points,
  subtitle,
  onCheckPoints,
  buttonLabel,
  viewLabel,
}: PointCardProps) => {
  const formattedPoints = points?.toFixed(2).replace(/\.00$/,
    "");
  const displayPoints = points && points > 0 ? `+${formattedPoints}` : formattedPoints;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex h-40">
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={onCheckPoints}
          className="bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-[#063a68] transition-colors w-full sm:w-auto text-center"
        >
          {buttonLabel}
        </button>
      </div>
      <div className="w-32 bg-gray-50 flex flex-col items-center justify-center p-3">
        <PointIcon/>
        <p className="text-primary font-bold text-2xl mt-2">{displayPoints}</p>
        <div className="flex items-center text-sm text-gray-500 mt-2 hover:text-primary cursor-pointer transition-colors">
          <span>{viewLabel}</span>
          <ArrowRight className="w-4 h-4 ml-1"/>
        </div>
      </div>
    </div>
  );
};

export default PointCard;
