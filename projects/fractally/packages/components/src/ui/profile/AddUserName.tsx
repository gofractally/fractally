import React from "react";
import { Card } from "..";
import {Input} from "../Form";
// @ts-ignore
import Banner from "../assets/profile-banner-1.svg";
import Button from "../Button";

export const AddUserName = () => {
    return (
        <div className="AddUserName bg-slate-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="Container">
                    <div className="my-0 mx-2 text-center">
                        <div className="mb-6">
                            <Banner />
                        </div>
                        <p className="mb-6 font-bold">
                            Username
                        </p>
                        <p className="mb-6">
                            Add a username to your account. This name can be changed at any time.
                        </p>
                        <p className="mb-6">
                            <Input placeholder="Username" />
                        </p>
                        <p className="mb-6">
                            Name fee:{" "}
                            <span className="text-slate-400">0.001 PRIME</span>
                        </p>
                        <div className="flex gap-2 mt-8 mb-4">
                            <Button
                                type="neutral"
                                fullWidth
                                size="lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="secondary"
                                fullWidth
                                size="lg"
                            >
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
