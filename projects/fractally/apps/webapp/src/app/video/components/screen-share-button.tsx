import React, { useState } from "react";
import * as SignalWire from "@signalwire/js";
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from "react-icons/md";

import { Button } from "@fractally/components/ui";

interface Props {
    room: SignalWire.Video.RoomSession;
}

export const ScreenShareButton = ({ room }: Props) => {
    const [screenShareObj, setScreenShareObj] =
        useState<SignalWire.Video.RoomSessionScreenShare | null>(null);

    const share = async () => {
        if (!room) {
            setScreenShareObj(null);
            return;
        }

        if (!screenShareObj) {
            let sc: SignalWire.Video.RoomSessionScreenShare;
            try {
                sc = await room.startScreenShare({});
            } catch (e) {
                setScreenShareObj(null);
                console.log(e);
            }
            setScreenShareObj(sc);
            return;
        }

        try {
            screenShareObj.leave();
        } catch (e) {
            console.log(e);
        }

        setScreenShareObj(null);
    };

    return (
        <Button onClick={share} type="secondary">
            {!screenShareObj ? (
                <>
                    <MdOutlineScreenShare size={22} className="mr-2" />
                    Share
                </>
            ) : (
                <>
                    <MdOutlineStopScreenShare size={22} className="mr-2" />
                    Stop Sharing
                </>
            )}
        </Button>
    );
};

export default ScreenShareButton;
