import React, { useCallback, useState } from "react";
import * as SignalWire from "@signalwire/js";
import { MdOutlineExitToApp, MdOutlineFullscreen } from "react-icons/md";
import { Button, Countdown, Loader } from "@fractally/components/ui";

import {
    CallContainer,
    DeviceSelect,
    MuteAudioButton,
    MuteVideoButton,
    Participants,
    ScreenShareButton,
    Video,
} from ".";
import { Participant, RoomUpdates } from "../interfaces";

export const InCall = ({ joinDetails, onLeave }) => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
    const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
    const [thisParticipantId, setThisParticipantId] = useState<string>();
    const [participantList, setParticipantList] = useState<Participant[]>([]);

    const thisParticipant = participantList.find(
        (p) => p.id === thisParticipantId
    );

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

    const onRoomUpdate = useCallback((updatedValues: RoomUpdates) => {
        const {
            cameras,
            speakers,
            microphones,
            left,
            thisParticipantId: thisMemberId,
        } = updatedValues;
        if (cameras) setCameras(cameras);
        if (speakers) setSpeakers(speakers);
        if (microphones) setMicrophones(microphones);
        if (left) onLeave();
        if (thisMemberId) setThisParticipantId(thisMemberId);
    }, []);

    const onParticipantListUpdate = (participants) => {
        console.log("Participants:", participants);
        setParticipantList(participants);
    };

    const toggleFullScreen = () => {
        interface FullScreenableDiv extends HTMLElement {
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

        const el: FullScreenableDiv = document.getElementById("stream");
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

    const handleLeaveClick = async () => {
        // fire and forget to signal the server and other participants we are leaving
        room?.leave();

        // leave right away without waiting for components to be updated/remounted
        onLeave();
    };

    return (
        <>
            {isLoading && <Loader />}
            <section className={isLoading ? "hidden" : ""}>
                {roomCloseTime && <Countdown endTime={roomCloseTime} />}
                <div className="flex space-x-2">
                    <CallContainer className="justify-center bg-black">
                        {/* {joinDetails.mod ? "Moderator" : "Normal user"} */}
                        <Video
                            onRoomInit={onRoomInit}
                            onRoomUpdate={onRoomUpdate}
                            joinDetails={joinDetails}
                            width={800}
                            onParticipantListUpdate={onParticipantListUpdate}
                            // eventLogger={logEvent}
                        />
                    </CallContainer>
                    <CallContainer className="flex-1 border border-gray-300 space-y-2">
                        <Participants
                            participantList={participantList}
                            thisParticipantId={thisParticipantId}
                        />
                    </CallContainer>
                </div>

                <nav className="flex-col space-y-2 mt-3">
                    <section>
                        <DeviceSelect
                            onChange={async (id) => {
                                await room.updateCamera({ deviceId: id });
                            }}
                            deviceName="Camera"
                            devices={cameras}
                        />
                        <DeviceSelect
                            onChange={async (id) => {
                                await room.updateMicrophone({ deviceId: id });
                            }}
                            deviceName="Microphone"
                            devices={microphones}
                        />
                        <DeviceSelect
                            onChange={async (id) => {
                                await room.updateSpeaker({ deviceId: id });
                            }}
                            deviceName="Speaker"
                            devices={speakers}
                        />
                    </section>

                    <section className="flex justify-center space-x-4">
                        <MuteAudioButton
                            room={room}
                            isMuted={thisParticipant?.audioMuted ?? false}
                        />
                        <MuteVideoButton
                            room={room}
                            isMuted={thisParticipant?.videoMuted ?? false}
                        />
                        <ScreenShareButton room={room} />
                        <Button onClick={toggleFullScreen} type="secondary">
                            <MdOutlineFullscreen size={22} className="mr-1" />
                            Full screen
                        </Button>
                        <Button onClick={handleLeaveClick} type="dangerOutline">
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
