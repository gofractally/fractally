import React from "react";
import * as SignalWire from "@signalwire/js";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";
import { Button } from "@fractally/components/ui";

interface MuteButtonProps {
    room: SignalWire.Video.RoomSession;
    isMuted: boolean;
}

export const MuteAudioButton = ({ room, isMuted }: MuteButtonProps) => {
    const toggleMute = async () => {
        try {
            if (isMuted) {
                await room.audioUnmute();
            } else {
                await room.audioMute();
            }
        } catch (e) {
            console.error(e);
            alert("fail to toggle audio muting functionality: " + e);
        }
    };

    return isMuted ? (
        <Button type="dangerOutline" className="group" onClick={toggleMute}>
            <MdMic size={22} className="hidden group-hover:block" />
            <MdMicOff size={22} className="text-red-500 group-hover:hidden" />
        </Button>
    ) : (
        <Button type="dangerOutline" className="group" onClick={toggleMute}>
            <MdMic size={22} className="group-hover:hidden" />
            <MdMicOff size={22} className="hidden group-hover:block" />
        </Button>
    );
};

export const MuteVideoButton = ({ room, isMuted }: MuteButtonProps) => {
    const toggleMute = async () => {
        try {
            if (isMuted) {
                await room.videoUnmute();
            } else {
                await room.videoMute();
            }
        } catch (e) {
            console.error(e);
            alert("fail to toggle video muting functionality: " + e);
        }
    };

    return isMuted ? (
        <Button type="dangerOutline" className="group" onClick={toggleMute}>
            <MdVideocam size={22} className="hidden group-hover:block" />
            <MdVideocamOff
                size={22}
                className="text-red-500 group-hover:hidden"
            />
        </Button>
    ) : (
        <Button type="dangerOutline" className="group" onClick={toggleMute}>
            <MdVideocam size={22} className="group-hover:hidden" />
            <MdVideocamOff size={22} className="hidden group-hover:block" />
        </Button>
    );
};
