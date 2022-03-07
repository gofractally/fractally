import React from "react";

interface TabOption {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

export interface TabsProps {
    options: TabOption[];
    selectedIndex?: number;
}

const notFullWidthBorderClass =
    "relative before:absolute before:w-6 before:left-[calc(50%-0.75rem)] before:h-1 before:bottom-0 before:border-b-2 before:content-['']";
const optionBaseClass =
    "inline-block py-4 px-4 text-sm font-medium text-center rounded-t-lg";
const notSelectedClass =
    "cursor-pointer text-gray-500 before:border-transparent hover:text-gray-600 hover:before:border-gray-300";
const selectedClass = "text-gray-900 before:border-indigo-600 active";
const disabledClass = "text-gray-400 before:border-transparent cursor-default";

export const Tabs = ({ options, selectedIndex }: TabsProps) => {
    return (
        <ul className="flex flex-wrap -mb-px">
            {options.map((option, index) => (
                <li key={index} className="mr-2">
                    <a
                        onClick={
                            option.disabled || index === selectedIndex
                                ? undefined
                                : option.onClick
                        }
                        className={`${optionBaseClass} ${notFullWidthBorderClass} ${
                            option.disabled
                                ? disabledClass
                                : index === selectedIndex
                                ? selectedClass
                                : notSelectedClass
                        }`}
                    >
                        {option.label}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default Tabs;
