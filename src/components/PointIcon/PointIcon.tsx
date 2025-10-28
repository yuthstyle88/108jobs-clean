import {cn} from "@/lib/utils";

interface PointIconProps {
  className?: string;
}

const PointIcon = ({className}: PointIconProps) => {
  return (
    <div
      className={cn(
        "w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center",
        className
      )}
    >
      <p className="text-blue-500 text-3xl font-bold">P</p>
    </div>
  );
};
export default PointIcon;
