import React, { HTMLProps } from "react";
import styled from "styled-components";
import tw from "twin.macro";

import "../styles/inputs.css";

export const Label: React.FC<{
    htmlFor: string;
}> = (props) => (
    <label className="block text-sm font-normal text-gray-600" {...props}>
        {props.children}
    </label>
);

export const Input: React.FC<
    HTMLProps<HTMLInputElement> & {
        inputRef?: React.Ref<HTMLInputElement> | null;
    }
> = ({ inputRef, ...props }) => (
    <input
        name={props.id}
        className={`w-full bg-white border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${
            props.disabled ? "bg-gray-50" : ""
        }`}
        ref={inputRef}
        {...props}
    />
);

export const FileInput: React.FC<
    HTMLProps<HTMLInputElement> & {
        label?: string;
    }
> = (props) => (
    <label
        htmlFor={props.id}
        className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-400"
    >
        <span>{props.label || "Attach File..."}</span>
        <input type="file" className="sr-only" {...props} />
    </label>
);

export const Select: React.FC<HTMLProps<HTMLSelectElement>> = (props) => (
    <select
        className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-yellow-500 sm:text-sm ${
            props.disabled ? "bg-gray-50" : ""
        }`}
        {...props}
    >
        {props.children}
    </select>
);

export const TextArea: React.FC<HTMLProps<HTMLTextAreaElement>> = (props) => (
    <textarea
        rows={3}
        name={props.id}
        className={`w-full bg-white border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out ${
            props.disabled ? "bg-gray-50" : ""
        }`}
        {...props}
    ></textarea>
);

export const Checkbox: React.FC<
    HTMLProps<HTMLInputElement> & { label: string; description?: string }
> = (props) => (
    <div className="flex items-center">
        <div className="flex items-center h-5">
            <input
                type="checkbox"
                className="focus:ring-yellow-500 h-4 w-4 text-yellow-500 border-gray-300 rounded"
                {...props}
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={props.id} className="font-medium text-gray-700">
                {props.label}
            </label>
            {props.description && (
                <p className="text-gray-500">{props.description}</p>
            )}
        </div>
    </div>
);

export const LabeledSet: React.FC<{
    htmlFor: string;
    label: string;
    description?: string;
    className?: string;
}> = ({
    htmlFor,
    label,
    children,
    description = undefined,
    className = undefined,
}) => {
    return (
        <div className={className}>
            <Label htmlFor={htmlFor}>{label}</Label>
            <div className="mt-1">{children}</div>
            {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}
        </div>
    );
};

const StyledForm = styled.main.attrs({
    className: "flex flex-col h-screen justify-center items-center bg-gray-100",
})`
    & {
        form {
            ${tw`bg-white text-center rounded py-8 px-5 shadow max-w-xs`}
        }
        input {
            ${tw`border-gray-300 mb-4 w-full border-solid border rounded py-2 px-4`}
        }
        button {
            ${tw`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 rounded`}
        }
    }
`;

export const Form = {
    Label,
    Input,
    Select,
    TextArea,
    LabeledSet,
    FileInput,
    Checkbox,
    StyledForm,
};

export default Form;
