import React from "react";
import { IconType } from "react-icons";
import Glyph from "./Glyph";

export interface ActionButtonProps {
    label?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    Icon: IconType;
    disabled?: boolean;
    isLoading?: boolean;
    dataTestId?: string;
}

export const ActionButton = ({
    label,
    onClick,
    Icon,
    disabled,
    isLoading,
    dataTestId,
}: ActionButtonProps) => {
    if (isLoading || disabled) {
        return (
            <button className="text-sm text-gray-500" disabled>
                <span className="flex flex-col items-center justify-center">
                    <Glyph
                        Icon={Icon}
                        isLoading={isLoading}
                        disabled={disabled}
                        hex
                    />
                    <span>{label}</span>
                </span>
            </button>
        );
    }

    return (
        <button
            className={"text-sm text-black"}
            onClick={onClick}
            type="button"
            disabled={disabled}
            title={label}
            data-testid={dataTestId}
        >
            <span className="flex flex-col items-center justify-center">
                <Glyph Icon={Icon} isLoading={isLoading} disabled={disabled} hex />
                <span>{label}</span>
            </span>
        </button>
    );
};

export default ActionButton;
