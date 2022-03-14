import React, { HTMLProps, useRef } from "react";
import { BsSearch, BsXCircleFill } from "react-icons/bs";
import Loader from "./Loader";

export interface SearchProps {
    dataTestId?: string;
    label?: string;
    inverted?: boolean;
    noBorder?: boolean;
    autoFocus?: boolean;
    isLoading?: boolean;
    onChange: (string) => void;
}

export const Search: React.FC<HTMLProps<HTMLInputElement> & SearchProps> = ({
    label = "",
    placeholder = "Search...",
    type = "search",
    dataTestId,
    inverted,
    noBorder,
    isLoading,
    onChange,
    ...props
}) => {
    const inputRef = useRef(null);

    const invertedClass = inverted ? "bg-gray-100" : "";
    const borderClass = noBorder ? "" : "border border-gray-200";
    const wrapperClass = `Search flex items-center h-8 rounded-full ${invertedClass} ${borderClass}`;

    const handleClearClick = () => {
        onChange("");
        inputRef.current.focus();
    };

    const statusIcons = [];

    if (props.value) {
        statusIcons.push(
            <button
                type="button"
                className="flex items-center justify-center"
                title="Clear"
                onClick={handleClearClick}
            >
                <BsXCircleFill className="h-5 w-5 text-gray-400" />
            </button>
        );
    }
    if (isLoading) {
        statusIcons.push(<Loader size={16} className="text-indigo-500" />);
    }

    return (
        <label className={wrapperClass}>
            <span className="hidden">{label}</span>
            <BsSearch className="mx-2 h-4 w-4 text-gray-500" />
            <input
                ref={inputRef}
                className="flex-1 bg-transparent mr-2.5 outline-none text-sm font-semibold text-gray-900"
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                {...props}
            />
            <div className="Status flex items-center justify-center p-0.5 mr-1.5">
                {statusIcons}
            </div>
        </label>
    );
};

export default Search;
