import React from "react";

const LoadingIcon = ({
    className = "",
    size,
}: {
    className?: string;
    size?: number;
}) => {
    return (
        <svg
            className={`animate-spin ${className}`}
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 32 32"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12zm0 4c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16z"
                fill="#F3F5FA"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.975 13.827c1.091 0 1.976.884 1.976 1.976 0 6.763 5.483 12.246 12.247 12.246a1.975 1.975 0 110 3.951C7.252 32 0 24.748 0 15.803c0-1.092.884-1.976 1.975-1.976z"
                fill="#6A80F5"
            />
        </svg>
    );
};

export default LoadingIcon;
