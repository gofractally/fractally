import React from "react";
import { FaUserCircle } from "react-icons/fa";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: {
    [key in AvatarSize]: string;
} = {
    xs: "w-5 h-5",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
};

export interface AvatarProps {
    size: AvatarSize;
    name?: string;
    avatarUrl?: string;
    className?: string;
}

export const Avatar = ({
    size = "md",
    name,
    avatarUrl,
    className,
}: AvatarProps) => {
    const sizeClass = SIZES[size];
    return (
        <div className={`${sizeClass} ${className}`}>
            <div
                className={`${sizeClass} inline-block shrink-0 rounded-full overflow-hidden`}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={name ? `${name}'s avatar` : null}
                        draggable={false}
                        className="w-full h-full max-w-full max-h-full object-center object bg-white"
                    />
                ) : (
                    <FaUserCircle
                        aria-label={
                            name ? `${name}'s avatar placeholder` : null
                        }
                        className={`${sizeClass} w-full h-full max-w-full max-h-full text-gray-300`}
                    />
                )}
            </div>
        </div>
    );
};

export default Avatar;
