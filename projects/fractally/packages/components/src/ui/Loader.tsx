import React from "react";
import { FaSpinner } from "react-icons/fa";

export const Loader = ({ size = 56 }: { size?: number }) => (
    <div className="w-full h-full flex justify-center items-center">
        <FaSpinner size={size} className="animate-spin mr-2 text-gray-700" />
    </div>
);

export default Loader;
