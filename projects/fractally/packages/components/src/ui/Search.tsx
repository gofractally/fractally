import React, { HTMLProps, useRef } from "react";
import { BsSearch, BsXCircleFill } from "react-icons/bs";
import Loader from "./Loader";

export interface SearchProps {
    dataTestId?: string;
    label?: string;
    placeholder?: string;
    inverted?: boolean;
    noBorder?: boolean;
    autoFocus?: boolean;
    isLoading?: boolean;
    value?: string;
    type?: "search" | "text";
    onChange: (string) => void;
}

export const Search = ({
    label = "",
    placeholder = "Search...",
    type = "search",
    dataTestId,
    inverted,
    noBorder,
    isLoading,
    value,
    onChange,
}: SearchProps) => {
    const inputRef = useRef(null);

    const invertedClass = inverted ? "bg-gray-100" : "";
    const borderClass = noBorder ? "" : "border border-gray-200";
    const wrapperClass = `Search flex items-center h-8 rounded-full ${invertedClass} ${borderClass}`;
    const inputClass =
        "flex-1 mr-2.5 bg-transparent border-0 outline-none focus:border-0 focus:outline-none text-sm focus:ring-0 font-semibold text-gray-900";

    const handleClearClick = () => {
        onChange("");
        inputRef.current.focus();
    };

    const handleChange = (e) => {
        console.info(e.target.value);
        onChange(e.target.value);
    };

    console.info("value", value);

    const statusIcons = [];

    if (value) {
        statusIcons.push(
            <button
                key="search-clear-button"
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
        statusIcons.push(<Loader key="search-loading" size={16} />);
    }

    return (
        <label className={wrapperClass} data-testid={dataTestId}>
            <span className="hidden">{label}</span>
            <BsSearch className="mx-2 h-4 w-4 text-gray-500" />
            <input
                ref={inputRef}
                className={inputClass}
                placeholder={placeholder}
                onChange={handleChange}
                value={value}
                type={type}
            />
            <div className="Status flex items-center justify-center p-0.5 mr-1.5">
                {statusIcons}
            </div>
        </label>
    );
};

export default Search;
