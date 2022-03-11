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
    name?: string;
    avatarUrl?: string;
    size: AvatarSize;
    shape: "round" | "hex";
    className?: string;
}

/**
 * ℹ️ This component uses a hexagonal SVG with rounded corners to mask the avatar image. (See Avatar.tsx for the SVG implementation).
 * This SVG is invisible (takes up no space) and should be loaded once on the page so it can be referenced by as many instances of Avatar
 * require it. In Storybook, this is done in `.storybook/preview-body.html`.
 *
 * 🚧 **TODO**: Additionally, the `FaUserCircle` icon we're using has a border. We add a div to cover the border, but it's imperfect and
 * unnecessary. We should just create and use a custom SVG for this and get rid of the extra div.
 *
 * 🚧 **TODO**: Thomas has a better version of the hexagon SVG waiting for us to implement (this one is tilted barely).
 */
export const Avatar = ({
    name,
    avatarUrl,
    size = "md",
    shape = "hex",
    className = "",
}: AvatarProps) => {
    const sizeClass = SIZES[size];
    const roundClass = shape === "round" ? "rounded-full" : "";
    const hexStyle = shape === "hex" ? { clipPath: "url(#hex-mask)" } : {};
    return (
        <>
            <div
                className={`${sizeClass} ${className} overflow-hidden`}
                style={hexStyle}
            >
                <div className={`${sizeClass} ${roundClass} overflow-hidden`}>
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={name ? `${name}'s avatar` : null}
                            draggable={false}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="relative bg-gray-300">
                            <FaUserCircle
                                aria-label={name ? `${name}'s avatar` : null}
                                className={`${sizeClass} text-gray-300 bg-white rounded-full`}
                            />
                            <div className="w-full h-full absolute top-0 rounded-full border-2 border-gray-300" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const HexMaskSVG = () => (
    <svg width="0" height="0">
        <defs>
            <clipPath
                id="hex-mask"
                clipPathUnits="objectBoundingBox"
                transform="scale(0.019999989318853, 0.022522370814944)"
            >
                <path d="M0.549499 24.2509C-0.183167 22.9819 -0.183166 21.4184 0.5495 20.1494L10.9987 2.05076C11.7314 0.781744 13.0854 0 14.5508 0H35.4492C36.9146 0 38.2686 0.781745 39.0013 2.05076L49.4505 20.1494C50.1832 21.4184 50.1832 22.9819 49.4505 24.2509L39.0013 42.3495C38.2686 43.6185 36.9146 44.4003 35.4492 44.4003H14.5508C13.0854 44.4003 11.7314 43.6185 10.9987 42.3495L0.549499 24.2509Z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default Avatar;
