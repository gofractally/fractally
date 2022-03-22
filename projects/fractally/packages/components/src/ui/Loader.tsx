import React from "react";
import { Icon } from "../ui/Icon";
import "../styles/loader.css";

export const Loader = ({ splash = false }: { splash?: boolean }) => {
    let ariaModal = false;
    let className = "Loader";
    if (splash) {
        ariaModal = true;
        className = "SplashLoader";
    }
    return (
        <div aria-modal={ariaModal} className={className}>
            <Icon type="loading" size="md" />
        </div>
    );
};

export default Loader;
