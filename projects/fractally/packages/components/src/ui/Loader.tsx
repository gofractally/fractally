import React from "react";
import { FaSpinner } from "react-icons/fa";

interface LoaderProps {
    size?: number;
    className?: string;
}

export const Loader = ({ size = 56, className }: LoaderProps) => {
    const additionalClasses = className || "";
    const wrapperClass = `w-full h-full flex justify-center items-center ${additionalClasses}`;

    return (
        <div className={wrapperClass}>
            <FaSpinner size={size} className="animate-spin" />
        </div>
    );
};

export default Loader;
