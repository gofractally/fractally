import React from "react";
import { Avatar } from "../ui/Avatar";

interface FieldProps {
    children: React.ReactNode[];
    avatar?: {
        url?: string;
        name?: string;
    };
    onClick?: () => void;
}

const SendDialogField = ({ children, avatar, onClick }: FieldProps) => {
    return (
        <div
            className={`SendDialogField flex gap-1 border px-2 py-1 mb-4 ${onClick && "cursor-pointer"}`}
            onClick={onClick}
        >
            {avatar && (
                <div className="flex-none m-1">
                    <Avatar
                        avatarUrl={avatar.url}
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

export default SendDialogField;
