import React from "react";
import LoadingIcon from "./icons/LoadingIcon";

export const Loader = ({
    size = 32,
    splash = false,
}: {
    size?: number;
    splash: boolean;
}) => {
    if (splash) {
        return (
            <div
                aria-modal="true"
                className="bg-slate-500/50 backdrop-blur-sm overflow-y-auto overflow-x-hidden fixed h-full right-0 left-0 z-1 justify-center items-center h-modal flex"
            >
                <div className="relative">
                    <LoadingIcon size={size} />
                </div>
            </div>
        );
    }
    return (
        <div className="loader w-full h-full flex justify-center items-center">
            <LoadingIcon size={size} />
        </div>
    );
};

export default Loader;
