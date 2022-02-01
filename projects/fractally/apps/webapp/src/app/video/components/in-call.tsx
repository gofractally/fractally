import React, { useCallback, useState } from "react";
import * as SignalWire from "@signalwire/js";
import { MdOutlineExitToApp, MdOutlineFullscreen } from "react-icons/md";
import { Button, Countdown, Loader } from "@fractally/components/ui";

import {
    DeviceSelect,
    MuteAudioButton,
    MuteVideoButton,
    ScreenShareButton,
    Video,
} from ".";

export const InCall = ({ joinDetails, onLeave }) => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
    const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);

    const [roomCloseTime, setRoomCloseTime] = useState<Date>();
    const [isLoading, setIsLoading] = useState(true);

    const [room, setRoom] = useState<null | SignalWire.Video.RoomSession>(null);

    const logEvent = useCallback(
        (msg: string, title: string, variant: string) => {
            console.log(msg, title, variant);
        },
        []
    );

    const onRoomInit = useCallback(
        (
            room: SignalWire.Video.RoomSession,
            cameras: MediaDeviceInfo[],
            microphones: MediaDeviceInfo[],
            speakers: MediaDeviceInfo[],
            roomCloseTime?: Date
        ) => {
            console.log("ROOM:");
            console.log(room);
            setCameras(cameras);
            setMicrophones(microphones);
            setSpeakers(speakers);
            setRoom(room);
            if (roomCloseTime) setRoomCloseTime(roomCloseTime);
            setIsLoading(false);
        },
        []
    );

    const onRoomUpdate = useCallback((updatedValues) => {
        if (updatedValues.cameras) setCameras(updatedValues.cameras);
        if (updatedValues.speakers) setSpeakers(updatedValues.speakers);
        if (updatedValues.microphones)
            setMicrophones(updatedValues.microphones);
    }, []);

    const toggleFullScreen = () => {
        interface VideoElement extends HTMLVideoElement {
            msRequestFullscreen?: (
                options?: FullscreenOptions
            ) => Promise<void>;
            mozRequestFullScreen?: (
                options?: FullscreenOptions
            ) => Promise<void>;
            webkitRequestFullscreen?: (
                options?: FullscreenOptions
            ) => Promise<void>;
        }

        const el: VideoElement = document
            .getElementById("stream")
            .querySelector("video");
        if (!el) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }

        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <section className={isLoading ? "hidden" : ""}>
                {roomCloseTime && <Countdown endTime={roomCloseTime} />}
                <div className="flex">
                    <div className="bg-black justify-center">
                        {/* {joinDetails.mod ? "Moderator" : "Normal user"} */}
                        <Video
                            onRoomInit={onRoomInit}
                            onRoomUpdate={onRoomUpdate}
                            joinDetails={joinDetails}
                            width={800}
                            // eventLogger={logEvent}
                        />
                    </div>
                </div>

                <nav className="flex-col space-y-2 mt-3">
                    <section>
                        <DeviceSelect
                            onChange={(id) => {
                                room.updateCamera({ deviceId: id });
                            }}
                            deviceName="Camera"
                            devices={cameras}
                        />
                        <DeviceSelect
                            onChange={(id) => {
                                room.updateMicrophone({ deviceId: id });
                            }}
                            deviceName="Microphone"
                            devices={microphones}
                        />
                        <DeviceSelect
                            onChange={(id) => {
                                room.updateSpeaker({ deviceId: id });
                            }}
                            deviceName="Speaker"
                            devices={speakers}
                        />
                    </section>

                    <section className="flex justify-center space-x-4">
                        <MuteAudioButton room={room} />
                        <MuteVideoButton room={room} />
                        <ScreenShareButton room={room} />
                        <Button onClick={toggleFullScreen} type="secondary">
                            <MdOutlineFullscreen size={22} className="mr-1" />
                            Full screen
                        </Button>
                        <Button
                            onClick={async () => {
                                await room.leave();
                                onLeave();
                            }}
                            type="dangerOutline"
                        >
                            <MdOutlineExitToApp size={22} className="mr-1" />
                            Leave
                        </Button>
                    </section>
                </nav>
            </section>
        </>
    );
};

export default InCall;
