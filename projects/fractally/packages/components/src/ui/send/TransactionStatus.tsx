import React from "react";
import { Card } from "../Card";
import Button from "../Button";
import Glyph from "../Glyph";
import { FaCheck, FaTimes, FaArrowUp } from "react-icons/fa";

type TransactionStatusType = "success" | "failed";

export interface TransactionStatusProps {
    type: TransactionStatusType;
    children: React.ReactNode;
    onCloseClick: () => void;
}

const TransactionStatus = ({
    type,
    children,
    onCloseClick,
}: TransactionStatusProps) => {
    const success = type === "success";
    return (
        <div className="bg-slate-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="my-0 mx-2 text-center">
                    <div className="my-4">
                        {success ? (
                            <Glyph
                                color="text-white"
                                bgColor="bg-green-500"
                                hex
                                size="xl"
                                Icon={FaCheck}
                                isStatic
                            />
                        ) : (
                            <Glyph
                                color="text-white"
                                bgColor="bg-rose-500"
                                hex
                                size="xl"
                                Icon={FaTimes}
                                isStatic
                            />
                        )}
                    </div>
                    <p className="font-bold mb-0">
                        {success ? "Success" : "Failed"}
                    </p>
                    <p className="text-sm text-slate-400">
                        08 March 2022 / 11:11:04 UTC
                    </p>
                    <div className="mt-2 mb-4">
                        <Glyph
                            color="text-black"
                            bgColor="bg-slate-200"
                            hex
                            size="lg"
                            Icon={FaArrowUp}
                            isStatic
                        />
                    </div>
                    {children}
                    <div className="my-6">
                        <Button
                            type="primary"
                            fullWidth
                            size="lg"
                            onClick={() => onCloseClick()}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TransactionStatus;
