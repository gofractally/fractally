import React from "react";
import { Card, Glyph } from "../index";
import { FaUser, FaEdit, FaCopy } from "react-icons/fa";
// @ts-ignore
import EmptyProfilePic from "../assets/empty-profile-pic.svg";

import "../../styles/wallet.css";

export interface AccountProps {
    username: string;
    publicKey: string;
}

export const Account = ({ username, publicKey }: AccountProps) => {
    return (
        <div className="Account bg-slate-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="my-0 mx-2 text-center">
                    <p className="text-slate-400 font-semibold mb-6">
                        My accounts
                    </p>
                    <div className="mb-6">
                        <EmptyProfilePic />
                        <FaEdit className="Icon EditIconAvatar" />
                    </div>
                    <p className="mb-6">
                        <b>Username:</b> {username} <FaEdit className="Icon" />
                    </p>
                    <p className="mb-6">
                        <b>Profile:</b>{" "}
                        <span className="text-slate-400">(empty)</span>
                        <FaEdit className="Icon" />
                    </p>
                    <div className="mb-6">
                        <p className="mb-1">
                            <b>Account:</b>
                        </p>
                        <p className="mb-1 text-sm break-all">{publicKey}</p>
                        <p>
                            <FaCopy className="Icon" />
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Account;
