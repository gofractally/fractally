import React from "react";
import LoadingIcon from "./icons/LoadingIcon";
import "../styles//loader.css";

export const Loader = ({
    size = 32,
    splash = false,
}: {
    size?: number;
    splash?: boolean;
}) => {
    if (splash) {
        return (
            <div aria-modal="true" className="SplashLoader">
                <LoadingIcon size={size} />
            </div>
        );
    }
    return (
        <div className="Loader">
            <LoadingIcon size={size} />
        </div>
    );
};

export default Loader;
