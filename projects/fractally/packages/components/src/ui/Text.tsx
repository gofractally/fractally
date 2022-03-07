import React from "react";

export type TextType =
    | "regular"
    | "note"
    | "danger"
    | "info"
    | "success"
    | "strong";
const TYPES: { [key in TextType]: string } = {
    regular: "text-gray-400",
    strong: "text-gray-900",
    note: "text-gray-300",
    danger: "text-red-500",
    info: "text-blue-500",
    success: "text-green-500",
};

export type TextSize =
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "inherit";
const SIZES: { [key in TextSize]: string } = {
    xs: "text-xs leading-5",
    sm: "text-sm leading-5",
    base: "text-base leading-5 tracking-tight",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    inherit: "",
};

interface Props {
    children: React.ReactNode;
    type?: TextType;
    size?: TextSize;
    span?: boolean;
    bold?: boolean;
    className?: string;
}

export const Text = ({
    children,
    className,
    type = "regular",
    size = "base",
    span,
    bold,
}: Props) => {
    const textClass = `${TYPES[type]} ${SIZES[size]} ${
        bold ? "font-bold" : ""
    } ${className || ""}`;
    return span ? (
        <span className={textClass}>{children}</span>
    ) : (
        <p className={textClass}>{children}</p>
    );
};
