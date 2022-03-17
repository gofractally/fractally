import React from "react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";

import "../styles/send-dialog.css";

export interface SendDialogProps {
    className?: string;
}

const SendDialog = ({ className }: SendDialogProps) => {
    return (
        <div className="bg-gray-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="my-0 mx-2">
                    <h3 className="mb-6 mx-auto font-bold text-center">Send</h3>
                    <div className="flex gap-2 border px-2 py-1">
                        <div className="flex-none m-1">
                            <Avatar
                                avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
                                name="Rey"
                                size="lg"
                                shape="hex"
                            />
                        </div>
                        <div className="flex-auto content-center my-auto">
                            <div className="SendDialogContent">
                                <label className="text-slate-400">From</label>
                                <div className="font-bold">PRIME</div>
                                <div>Total: 2,800 / B0.1034011</div>
                            </div>
                        </div>
                        <div className="flex-none content-center my-auto">
                            &gt;
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SendDialog;
