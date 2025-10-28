import {LoaderCircle} from "lucide-react";

const LoadingCircle = () => {
  return (
    <div className="flex items-center justify-center">
      <LoaderCircle className="h-6 w-6 animate-spin-fast text-white"/>
    </div>
  );
};

export default LoadingCircle;
