import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import Button from "../ui/Button";
import { Modal } from "../ui/Modal";

import "../styles/send-dialog.css";


interface SDFieldProps {
    children: React.ReactNode[];
    avatarUrl?: string;
    onClick?: () => void;
}

const SDField = ({ children, avatarUrl, onClick }: SDFieldProps) => {
    return (
        <div
            className={`SDField flex gap-1 border px-2 py-1 mb-4 ${ onClick && "cursor-pointer" }`}
            onClick={onClick}
        >
            {avatarUrl && (
                <div className="flex-none m-1">
                    <Avatar
                        avatarUrl={avatarUrl}
                        name="Rey"
                        size="lg"
                        shape="hex"
                    />
                </div>
            )}
            <div className="flex-auto content-center mx-1 my-auto">
                <div className={`contentLen-${children.length} text-sm`}>
                    {children}
                </div>
            </div>
            {onClick && (
                <div className="flex-none content-center mx-2 my-auto text-slate-400">
                    &gt;
                </div>
            )}
        </div>
    );
};

export interface SendDialogProps {
    className?: string;
}

const SendDialog = ({ className }: SendDialogProps) => {
    const [isFromModalOpen, setFromModalOpen] = useState(false);
    const [isToModalOpen, setToModalOpen] = useState(false);
    return (
        <div className="bg-gray-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="my-0 mx-2">
                    <h3 className="mb-6 mx-auto font-bold text-center">Send</h3>
                    <SDField
                        avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
                        onClick={() => setFromModalOpen(true)}
                    >
                        <label className="text-slate-400">From</label>
                        <div className="font-bold">PRIME</div>
                        <div>Total: 2,800 / {"\u20BF"}0.1034011</div>
                    </SDField>
                    <SDField>
                        <label className="text-slate-400">Amount</label>
                        <div>0.0</div>
                    </SDField>
                    <SDField
                        avatarUrl="https://randomuser.me/api/portraits/men/44.jpg"
                        onClick={() => setToModalOpen(true)}
                    >
                        <label className="text-slate-400">To</label>
                        <div>Hal McGovern</div>
                    </SDField>
                    <div className="flex gap-2 mt-8">
                        <Button type="neutral" fullWidth size="lg">
                            Cancel
                        </Button>
                        <Button type="primary" fullWidth size="lg">
                            Submit
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Modal Dialogs Examples */}
            <Modal
                shouldCloseOnEsc
                shouldCloseOnOverlayClick
                ariaHideApp={false}
                isOpen={isFromModalOpen}
                onRequestClose={() => setFromModalOpen(false)}
                title="Select your fractal and currency"
            >
                <div className="space-y-3">
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                        consectetur debitis omnis blanditiis cum at laborum doloremque,
                        nam rem nesciunt error nemo voluptatibus quos quisquam non
                        recusandae asperiores, sed quas.
                    </div>
                    <div>Press [ESC] or click in the Overlay to close it</div>
                </div>
            </Modal>
            <Modal
                shouldCloseOnEsc
                shouldCloseOnOverlayClick
                ariaHideApp={false}
                isOpen={isToModalOpen}
                onRequestClose={() => setToModalOpen(false)}
                title="Select recipient"
            >
                <div className="space-y-3">
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                        consectetur debitis omnis blanditiis cum at laborum doloremque,
                        nam rem nesciunt error nemo voluptatibus quos quisquam non
                        recusandae asperiores, sed quas.
                    </div>
                    <div>Press [ESC] or click in the Overlay to close it</div>
                </div>
            </Modal>
        </div>
    );
};

export default SendDialog;
