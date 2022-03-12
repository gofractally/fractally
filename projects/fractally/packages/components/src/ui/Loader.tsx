import React from "react";
import LoadingIcon from "./icons/LoadingIcon";

export const Loader = ({ size = 32 }: { size?: number }) => (
    <div className="loader w-full h-full flex justify-center items-center">
        <LoadingIcon size={size} />
    </div>
);

export default Loader;
