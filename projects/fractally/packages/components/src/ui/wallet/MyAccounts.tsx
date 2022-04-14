import React from "react";
import { Card, Glyph } from "../index";
import { FaCopy, FaTrash } from "react-icons/fa";
import { BiExit } from "react-icons/bi";
import Button from "../Button";
import Avatar from "../Avatar";
// @ts-ignore
import EmptyProfilePic from "../assets/empty-profile-pic.svg";

import "../../styles/wallet.css";

export const MyAccounts = () => {
    return (
        <div className="Account bg-slate-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="Container">
                    <div className="my-0 mx-2 text-center">
                        <div className="text-slate-400 font-semibold mb-6">
                            My accounts
                        </div>
                        <div className="mb-4">
                            <EmptyProfilePic />
                            <FaCopy className="Icon FaCopy" />
                        </div>
                        <div className="font-semibold mb-4">gold</div>
                        <div className="mb-4">
                            <Button type="outline" size="sm">
                                Manage account
                            </Button>
                        </div>
                        <div className="mb-4">
                            <div className="flex flex-row border-slate-100 border-b pt-3 pb-2 pl-4 pr-4 text-sm hover:bg-slate-50">
                                <div className="basis-16 text-left mt-2">
                                    <Avatar size="sm" shape="hex" />
                                </div>
                                <div className="basis-2/3 text-left font-bold my-auto">
                                    gold
                                </div>
                                <div className="basis-16 text-right my-auto">
                                    <BiExit />
                                </div>
                                <div className="basis-16 text-right my-auto">
                                    <FaTrash />
                                </div>
                            </div>
                            <div className="flex flex-row border-slate-100 border-b pt-3 pb-2 pl-4 pr-4 text-sm hover:bg-slate-50">
                                <div className="basis-16 text-left mt-2">
                                    <Avatar size="sm" shape="hex" />
                                </div>
                                <div className="basis-2/3 text-left my-auto text-xs break-all">
                                    FRA7HR8ZCTnEUjUNstUYXyUNR8ZCTnEUjUNstUYHR8ZCTnEUjUNstUYEUjUNstUPz1
                                </div>
                                <div className="basis-16 text-right my-auto">
                                    <BiExit />
                                </div>
                                <div className="basis-16 text-right my-auto">
                                    <FaTrash />
                                </div>
                            </div>
                            <div className="flex flex-row border-slate-100 border-b pt-3 pb-2 pl-4 pr-4 text-sm hover:bg-slate-50">
                                <div className="basis-16 text-left mt-2">
                                    <Avatar size="sm" shape="hex" />
                                </div>
                                <div className="basis-2/3 text-left my-auto">
                                    hexabite7
                                </div>
                                <div className="basis-16 text-right my-auto">
                                    <BiExit />
                                </div>
                                <div className="basis-16 text-right my-auto">
                                    <FaTrash />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-8">
                            <Button type="outline" fullWidth size="sm">
                                Create account
                            </Button>
                            <Button type="secondary" fullWidth size="sm">
                                Add account
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MyAccounts;
