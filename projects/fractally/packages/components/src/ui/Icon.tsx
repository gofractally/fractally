import React, { FC, SVGProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { BsChevronUp } from "react-icons/bs";
import { FaDragon } from "react-icons/fa";

import LoadingIcon from "./icons/LoadingIcon";

export type IconProps = {
    type: IconType;
    size?: IconSize;
    color?: IconColor;
    className?: string;
};

export type IconSize = "sm" | "md" | "lg";
const SIZES: { [key in IconSize]: string } = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-16 h-16",
};

export type IconColor = "primary" | "disabled" | "caution" | "danger";
const COLORS: { [key in IconColor]: string } = {
    primary: "text-blue-500",
    disabled: "text-gray-300",
    caution: "text-yellow-500",
    danger: "text-red-500",
};

const Fa6Wrapper = (icon: IconDefinition) => (props) =>
    <FontAwesomeIcon icon={icon} {...props} />;

export type IconType = "coffee" | "chevronUp" | "dragon" | "loading";
const ICONS: { [key in IconType]: FC<SVGProps<SVGSVGElement>> } = {
    coffee: Fa6Wrapper(faCoffee),
    chevronUp: BsChevronUp,
    dragon: FaDragon,
    loading: LoadingIcon,
};

export const Icon = ({ type, className = "", size, color }: IconProps) => {
    const IconComponent = ICONS[type];
    const colorClass = COLORS[color] || "";
    const sizeClass = SIZES[size] || "";
    const iconClass = `flex-no-shrink fill-current ${sizeClass} ${colorClass} ${className}`;
    return <IconComponent className={iconClass} />;
};
