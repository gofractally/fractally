import React from "react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import Button from "../ui/Button";

import "../styles/send-dialog.css";

interface SDFieldProps {
    children: React.ReactNode[];
    avatarUrl?: string;
    onOpen?: () => void;
}

const SDField = ({ children, avatarUrl, onOpen }: SDFieldProps) => {
    return (
        <div className="SDField flex gap-1 border px-2 py-1 mb-4">
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
            {onOpen && (
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
    return (
        <div className="bg-gray-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="my-0 mx-2">
                    <h3 className="mb-6 mx-auto font-bold text-center">Send</h3>
                    <SDField
                        avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
                        onOpen={() => console.log("onOpen 'From'")}
                    >
                        <label className="text-slate-400">From</label>
                        <div className="font-bold">PRIME</div>
                        <div>Total: 2,800 / B0.1034011</div>
                    </SDField>
                    <SDField>
                        <label className="text-slate-400">Amount</label>
                        <div>0.0</div>
                    </SDField>
                    <SDField
                        avatarUrl="https://randomuser.me/api/portraits/men/44.jpg"
                        onOpen={() => console.log("onOpen 'To'")}
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
        </div>
    );
};

export default SendDialog;
