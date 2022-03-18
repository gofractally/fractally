import React, { FC, SVGProps } from "react";
import { BsChevronUp } from "react-icons/bs";
import { FaDragon } from "react-icons/fa";

import LoadingIcon from "./icons/LoadingIcon";

export type IconSize = "xs" | "sm" | "md" | "lg";
const SIZES: { [key in IconSize]: string } = {
    xs: "w-2 h-2",
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-16 h-16",
};

export type IconType = "loading" | "dragon" | "chevron-up";

export type IconProps = {
    type: IconType;
    size?: IconSize;
    className?: string;
};

const ICONS: { [key in IconType]: FC<SVGProps<SVGSVGElement>> } = {
    loading: LoadingIcon,
    dragon: FaDragon,
    ["chevron-up"]: BsChevronUp,
};

export const Icon = ({ type, size = "sm", className }: IconProps) => {
    const IconComponent = ICONS[type];
    const iconClass = `flex-no-shrink fill-current ${SIZES[size]} ${
        className || ""
    }`;
    return <IconComponent className={iconClass} />;
};
