import React from "react";
import { Card } from "../index";
import { Input } from "../Form";
import { FaInfoCircle } from "react-icons/fa";
// @ts-ignore
import Banner from "../assets/profile-banner-1.svg";
import Button from "../Button";

export const AddUserName = () => {
    return (
        <div className="AddUserName bg-slate-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="Container">
                    <div className="my-0 text-center">
                        <div className="mb-5">
                            <Banner />
                        </div>
                        <p className="mb-5 text-2xl font-bold">Username</p>
                        <p className="mb-5">
                            Add a username to your account. This name can be
                            changed at any time.
                        </p>
                        <div className="mb-5 text-left">
                            <Input id="username" label="Username" />
                            <label className="text-sm text-rose-500">
                                Username not available
                            </label>
                        </div>
                        <p className="mb-5">
                            Name fee:{" "}
                            <span className="text-slate-300">
                                0.001 PRIME &nbsp;{" "}
                                <FaInfoCircle className="inline align-text-top text-slate-400" />
                            </span>
                        </p>
                        <div className="flex gap-2 mt-8 mb-4">
                            <Button type="neutral" fullWidth size="lg">
                                Cancel
                            </Button>
                            <Button type="secondary" fullWidth size="lg">
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AddUserName;
