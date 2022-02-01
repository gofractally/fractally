import React, { useState } from "react";
import * as SignalWire from "@signalwire/js";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";
import { Button } from "@fractally/components/ui";

interface MuteButtonProps {
    room: SignalWire.Video.RoomSession;
}

export const MuteAudioButton = ({ room }: MuteButtonProps) => {
    const [audioMuted, setAudioMuted] = useState(false);

    const toggleAudioMute = () => {
        if (audioMuted) {
            room.audioUnmute();
            setAudioMuted(false);
        } else {
            room.audioMute();
            setAudioMuted(true);
        }
    };

    return audioMuted ? (
        <Button
            type="dangerOutline"
            className="group"
            onClick={toggleAudioMute}
        >
            <MdMic size={22} className="hidden group-hover:block" />
            <MdMicOff size={22} className="text-red-500 group-hover:hidden" />
        </Button>
    ) : (
        <Button
            type="dangerOutline"
            className="group"
            onClick={toggleAudioMute}
        >
            <MdMic size={22} className="group-hover:hidden" />
            <MdMicOff size={22} className="hidden group-hover:block" />
        </Button>
    );
};

export const MuteVideoButton = ({ room }: MuteButtonProps) => {
    const [videoMuted, setVideoMuted] = useState(false);

    const togglVideoMute = () => {
        if (videoMuted) {
            room.videoUnmute();
            setVideoMuted(false);
        } else {
            room.videoMute();
            setVideoMuted(true);
        }
    };

    return videoMuted ? (
        <Button type="dangerOutline" className="group" onClick={togglVideoMute}>
            <MdVideocam size={22} className="hidden group-hover:block" />
            <MdVideocamOff
                size={22}
                className="text-red-500 group-hover:hidden"
            />
        </Button>
    ) : (
        <Button type="dangerOutline" className="group" onClick={togglVideoMute}>
            <MdVideocam size={22} className="group-hover:hidden" />
            <MdVideocamOff size={22} className="hidden group-hover:block" />
        </Button>
    );
};
