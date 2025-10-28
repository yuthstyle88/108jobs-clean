import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface ArrowProps {
    onClick?: () => void;
    className?: string;
}

export const NextArrow = ({ onClick, className = "" }: ArrowProps) => (
    <button
        onClick={onClick}
        className={`absolute right-0 top-1/2 -translate-y-1/2 hover:bg-blue-600 p-2 rounded-full z-10 shadow ${className}`}
    >
        <FontAwesomeIcon icon={faChevronRight} className="text-white" />
    </button>
);

export const PrevArrow = ({ onClick, className = "" }: ArrowProps) => (
    <button
        onClick={onClick}
        className={`absolute left-0 top-1/2 -translate-y-1/2 hover:bg-blue-600 p-2 rounded-full z-10 shadow ${className}`}
    >
        <FontAwesomeIcon icon={faChevronLeft} className="text-white" />
    </button>
);

