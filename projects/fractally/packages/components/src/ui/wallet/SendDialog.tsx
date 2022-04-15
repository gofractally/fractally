import React, { useState } from "react";
import { Card } from "../Card";
import Button from "../Button";
import { Modal } from "../Modal";
import SendDialogField from "./SendDialogField";
import ConfirmSendDialog from "./ConfirmSendDialog";

import "../../styles/send-dialog.css";

const SendDialog = () => {
    const [isFromModalOpen, setFromModalOpen] = useState(false);
    const [isToModalOpen, setToModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const avatarFrom = {};
    const avatarTo = {
        url: "https://randomuser.me/api/portraits/women/44.jpg",
    };
    return (
        <div className="bg-slate-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="my-0 mx-2">
                    <h3 className="mb-6 mx-auto font-bold text-center">Send</h3>
                    <SendDialogField
                        avatar={avatarFrom}
                        onClick={() => setFromModalOpen(true)}
                    >
                        <label className="text-slate-800">From</label>
                        <div className="font-bold">PRIME</div>
                        <div>Total: 2,800 / {"\u20BF"}0.1034011</div>
                    </SendDialogField>
                    <SendDialogField>
                        <label
                            htmlFor="input_amount"
                            className="text-slate-800"
                        >
                            Amount
                        </label>
                        <input
                            className="block border-none p-0"
                            type="number"
                            id="input_amount"
                            placeholder="0"
                        />
                    </SendDialogField>
                    <SendDialogField>
                        <label htmlFor="input_to" className="text-slate-800">
                            To
                        </label>
                        <input
                            className="block border-none p-0 w-full"
                            type="text"
                            id="input_to"
                            placeholder="Account name or number"
                        />
                    </SendDialogField>
                    <SendDialogField>
                        <input
                            className="block border-none p-0 w-full"
                            type="text"
                            id="input_memo"
                            placeholder="Memo"
                        />
                    </SendDialogField>
                    <div className="flex gap-2 mt-8">
                        <Button type="neutral" fullWidth size="lg">
                            Cancel
                        </Button>
                        <Button
                            type="secondary"
                            fullWidth
                            size="lg"
                            onClick={() => setConfirmModalOpen(true)}
                        >
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
            <Modal
                shouldCloseOnEsc
                shouldCloseOnOverlayClick
                ariaHideApp={false}
                isOpen={isConfirmModalOpen}
                onRequestClose={() => setConfirmModalOpen(false)}
                title=""
            >
                <ConfirmSendDialog
                    onBackClick={() => setConfirmModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default SendDialog;
