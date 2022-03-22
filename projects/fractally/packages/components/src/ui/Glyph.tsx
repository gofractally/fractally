import React from "react";
import { IconType } from "react-icons";
import LoadingIcon from "./icons/LoadingIcon";

export type GlyphSize = "sm" | "md" | "lg" | "xl";
const SIZES: {
    [key in GlyphSize]: { icon: string; bg: string; chars: string };
} = {
    sm: { icon: "w-2 h-2", bg: "w-6 h-6", chars: "text-md" },
    md: { icon: "w-3 h-3", bg: "w-8 h-8", chars: "text-xl" },
    lg: { icon: "w-5 h-5", bg: "w-10 h-10", chars: "text-2xl" },
    xl: { icon: "w-8 h-8", bg: "w-12 h-12", chars: "text-3xl" },
};

export interface GlyphProps {
    Icon?: IconType;
    chars?: string;
    size?: GlyphSize;
    isStatic?: boolean;
    isOutline?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    dataTestId?: string;
    hex?: boolean;
}

export const Glyph = ({
    chars,
    Icon,
    size = "md",
    isStatic,
    isOutline,
    disabled,
    isLoading,
    hex,
}: GlyphProps) => {
    const sizeClass = SIZES[size];
    const colorClass = disabled
        ? ""
        : isOutline
        ? "text-white"
        : "text-indigo-600";
    const bgClass = isOutline ? "bg-indigo-600" : "bg-gray-100";
    const hoverClass =
        isStatic || disabled || isLoading
            ? "cursor-default"
            : "hover:bg-indigo-600 hover:text-white";
    const roundClass = hex ? "" : "rounded-full";
    const hexStyle = hex ? { clipPath: "url(#hex-mask)" } : {};
    const aspectRatio = hex ? "50 / 44" : "1";

    return (
        <span
            className={`inline-flex items-center justify-center mb-1 overflow-hidden ${bgClass} ${colorClass} ${hoverClass} ${sizeClass.bg} ${roundClass}`}
            style={{ ...hexStyle, aspectRatio }}
        >
            {isLoading ? (
                <LoadingIcon className="mr-2 ml-2" />
            ) : chars ? (
                <span className={sizeClass.chars}>{chars}</span>
            ) : (
                <Icon className={`inline-block ${sizeClass.icon}`} />
            )}
        </span>
    );
};

export default Glyph;
