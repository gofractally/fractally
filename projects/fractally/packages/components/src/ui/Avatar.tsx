import React from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: {
    [key in AvatarSize]: string;
} = {
    xs: "h-5",
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-14",
};

export type AvatarStatusBadge = "green" | "yellow" | "red" | "gray";

const STATUS_BADGES: {
    [key in AvatarStatusBadge]: string;
} = {
    green: "bg-green-600",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
    gray: "bg-gray-400",
};

export interface AvatarProps {
    name?: string;
    avatarUrl?: string;
    size: AvatarSize;
    shape: "round" | "hex";
    className?: string;
    statusBadge?: AvatarStatusBadge;
}

/**
 * ℹ️ This component uses a hexagonal SVG with rounded corners to mask the avatar image. This SVG is invisible (takes up no
 * space) and should be loaded once on the page so it can be referenced by as many instances of Avatar require it. In
 * Storybook, this is done in `.storybook/preview-body.html`.
 *
 * ℹ️ This SO answer (and particularly the comment on using `getBox()`) is helpful if we have to tweak or replace the SVG:
 * https://stackoverflow.com/a/40100463
 * */
export const Avatar = ({
    name,
    avatarUrl,
    size = "md",
    shape = "hex",
    className = "",
    statusBadge,
}: AvatarProps) => {
    const sizeClass = SIZES[size];
    const roundClass = shape === "round" ? "rounded-full" : "";
    const hexStyle = shape === "hex" ? { clipPath: "url(#hex-mask)" } : {};
    const aspectRatio = shape === "hex" ? "50 / 44" : "1";
    const statusBadgeClass = statusBadge
        ? `absolute top-1.5 right-1.5 inline-block w-3 h-3 transform translate-x-1/2 -translate-y-1/2 rounded-full border-solid border-white border-2 ${STATUS_BADGES[statusBadge]}`
        : "";

    return (
        <>
            <div className="relative inline-block">
                <div
                    className={`${sizeClass} ${className} overflow-hidden`}
                    style={{ ...hexStyle, aspectRatio }}
                >
                    <div
                        className={`${sizeClass} ${roundClass} overflow-hidden`}
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={name ? `${name}'s avatar` : null}
                                draggable={false}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className={`${sizeClass} fill-gray-200`}>
                                {shape === "hex" ? (
                                    <svg
                                        viewBox="0 0 50 44"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect width="50" height="44" />
                                        <path
                                            d="M38.7017 32.5011L35.9529 37.2154C35.309 38.3197 34.1191 39 32.8314 39H17.1691C15.8814 39 14.6915 38.3197 14.0476 37.2154L11.2925 32.4902C13.0517 28.4569 17.0159 25.6412 21.6581 25.6412H28.2769C32.9232 25.6412 36.9262 28.462 38.7017 32.5011ZM33.3885 13.9722C33.3885 18.6796 29.5876 22.4587 25.0003 22.4587C20.3474 22.4587 16.6121 18.6796 16.6121 13.9722C16.6121 9.33117 20.3474 5.48572 25.0003 5.48572C29.5876 5.48572 33.3885 9.33117 33.3885 13.9722Z"
                                            fill="white"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        viewBox="0 0 50 50"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect width="50" height="50" />
                                        <path
                                            d="M38.6992 35.5052L35.9504 40.2197C35.3065 41.324 34.1166 42.0042 32.8289 42.0042L17.1666 42.0042C15.8789 42.0042 14.689 41.324 14.0451 40.2197L11.29 35.4946C13.0492 31.4612 17.0135 28.6454 21.6557 28.6454H28.2745C32.9208 28.6454 36.9237 31.4662 38.6992 35.5052ZM33.3861 16.9765C33.3861 21.6839 29.5852 25.463 24.9979 25.463C20.345 25.463 16.6097 21.6839 16.6097 16.9765C16.6097 12.3354 20.345 8.48999 24.9979 8.48999C29.5852 8.48999 33.3861 12.3354 33.3861 16.9765Z"
                                            fill="white"
                                        />
                                    </svg>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {statusBadge && <span className={statusBadgeClass}></span>}
            </div>
        </>
    );
};

export default Avatar;
