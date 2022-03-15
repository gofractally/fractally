import React from "react";
import ReactModal from "react-modal";

import { Heading } from "./Heading";

// we need to explicitly define the full string for optimal twcss builds
const modal_index_twcss = "z-50";
export const MODAL_INDEX = 50; // for external usage

const baseClass =
    "flex flex-col justify-center relative transform inset-1/2 -translate-y-1/2 -translate-x-1/2 px-9 py-8 bg-white shadow-md";
const mobileClass = "w-screen h-screen";
const desktopClass = "md:h-auto md:rounded md:w-4/6 xl:w-6/12 2xl:w-2/5";

export type ModalProps = ReactModal.Props & {
    title?: string;
    children?: React.ReactNode;
};

/**
 * For docs and props, see https://reactcommunity.org/react-modal/.
 */
export const Modal = ({
    title,
    children,
    onAfterClose,
    onAfterOpen,
    ...props
}: ModalProps) => {
    return (
        <ReactModal
            onAfterOpen={() => {
                document.body.style.overflow = "hidden";
                if (onAfterOpen) onAfterOpen();
            }}
            onAfterClose={() => {
                document.body.style.overflow = "unset";
                if (onAfterClose) onAfterClose();
            }}
            closeTimeoutMS={200}
            className={`${baseClass} ${mobileClass} ${desktopClass}`}
            overlayClassName={{
                base: `base fixed inset-0 bg-gray-900 bg-opacity-0 opacity-0 transition ease-in-out duration-200 ${modal_index_twcss}`,
                beforeClose: "bg-opacity-0 opacity-0",
                afterOpen: props.isOpen ? "bg-opacity-50 opacity-100" : "",
            }}
            {...props}
        >
            {title && <Heading className="mb-2.5">{title}</Heading>}
            {children}
        </ReactModal>
    );
};
