import {Info} from "lucide-react";

type Props = {
  message: string;
  className?: string;
};

const InfoMessage = ({message, className}: Props) => {
  return (
    <div
      className={`bg-secondary border border-third rounded-lg py-3 px-4 flex items-center ${className}`}
    >
      <Info className="w-5 h-5 text-third mr-3 mt-0.5 flex-shrink-0"/>
      <div className="text-sm">
        <span className="text-gray-700">{message}</span>
      </div>
    </div>
  );
};

export default InfoMessage;
