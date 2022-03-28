import React from "react";
import { Card } from "../Card";
import Button from "../Button";
import Glyph from "../Glyph";
import { FaCheck, FaArrowUp } from "react-icons/fa";

export interface SendSuccessProps {
    onCloseClick: () => void;
}

const SendSuccess = ({ onCloseClick }: SendSuccessProps) => {
    return (
        <div className="bg-slate-100 w-full h-full p-4 space-y-4">
            <Card>
                <div className="my-0 mx-2 text-center">
                    <div className="my-4">
                        <Glyph
                            color="text-white"
                            bgColor="bg-green-500"
                            hex
                            size="xl"
                            Icon={FaCheck}
                            isStatic
                        />
                    </div>
                    <p className="font-bold mb-0">Send success</p>
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
                    <div className="bg-slate-50 mb-6">
                        <label className="text-sm  text-slate-400">Sent</label>
                        <p>
                            230.50 PRIME /{" "}
                            <span className="">{"\u20BF"}230.50</span>
                        </p>
                        <label className="text-sm text-slate-400">To</label>
                        <p>245798572349857</p>
                        <label className="text-sm text-slate-400">Memo</label>
                        <p>For your perfectly roasted coffee.</p>
                        <label className="text-sm text-slate-400">
                            Trx fee
                        </label>
                        <p>.001 PRIME / {"\u20BF"}0.000011</p>
                    </div>
                    <Button
                        type="primary"
                        fullWidth
                        size="lg"
                        onClick={() => onCloseClick()}
                    >
                        Close
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SendSuccess;
