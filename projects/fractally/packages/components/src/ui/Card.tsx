import React from "react";

interface Props {
    className?: string;
    noPadding?: boolean;
    roundType?: "top" | "bottom" | "none";
    children: React.ReactNode;
}

export const Card = ({ children, roundType, noPadding }: Props) => {
    const paddingClass = noPadding ? "" : "p-4";

    const roundClass =
        roundType === "top"
            ? "rounded-t-lg"
            : roundType === "bottom"
            ? "rounded-b-lg"
            : roundType === "none"
            ? ""
            : "rounded-lg";

    return (
        <div className={`bg-white ${paddingClass} ${roundClass}`}>
            {children}
        </div>
    );
};
