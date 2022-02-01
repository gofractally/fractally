import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as SignalWire from "@signalwire/js";
import { VideoRoomSubscribedEventParams } from "@signalwire/core";
import { coreApiBaseUrl } from "../../config";

export interface MediaDevices {
    cameras?: MediaDeviceInfo[];
    microphones?: MediaDeviceInfo[];
    speakers?: MediaDeviceInfo[];
}

interface Props {
    onRoomInit: (
        room: SignalWire.Video.RoomSession,
        cameras: MediaDeviceInfo[],
        microphones: MediaDeviceInfo[],
        speakers: MediaDeviceInfo[],
        roomCloseTime?: Date
    ) => void;
    onRoomUpdate?: ({ cameras, microphones, speakers }: MediaDevices) => void;
    width?: number;
    joinDetails: {
        room: string;
        name: string;
        expiration: string;
        mod: boolean;
    };
    eventLogger?: (msg: string, title?: string, variant?: string) => void;
}

export const Video = ({
    onRoomInit = () => {},
    onRoomUpdate = () => {},
    width = 400,
    joinDetails,
    eventLogger = (msg: string) => {
        console.log("Event:", msg);
    },
}: Props) => {
    const thisMemberId = useRef(null);
    let [setupDone, setSetupDone] = useState(false);

    useEffect(() => {
        if (setupDone) return;
        setupRoom();
    }, [joinDetails, eventLogger, onRoomInit, onRoomUpdate, setupDone]);

    const setupRoom = async () => {
        setSetupDone(true);

        // bail early
        // return;

        try {
            // Get room token
            const res = await axios.post(`${coreApiBaseUrl}/get-token`, {
                userName: joinDetails.name,
                roomName: joinDetails.room,
                expirationMinutes: joinDetails.expiration,
                mod: joinDetails.mod,
            });
            const token = res.data.token;
            const expiration = res.data.roomExpiration;
            const roomCloseTime = expiration ? new Date(expiration) : undefined;

            // bail early
            // return;

            // Set up room
            const room = new SignalWire.Video.RoomSession({
                token,
                rootElement: document.getElementById("stream"), // an html element to display the video
                video: true,
            });

            // Listen for room events
            room.on(
                "room.joined",
                async (e: VideoRoomSubscribedEventParams) => {
                    thisMemberId.current = e.member_id;
                    eventLogger("You have joined the room.");
                }
            );
            room.on("room.updated", async (e) => {
                eventLogger("Room has been updated");
            });
            room.on("member.joined", async (e) => {
                eventLogger(`${e.member.name} has joined the room.`);
            });
            room.on("layout.changed", async (e) => {
                eventLogger(`The layout was changed to ${e.layout.name}`);
            });
            room.on("member.left", async (e) => {
                eventLogger("A member has left the room.");
            });

            console.info("loading navigator devices");
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.info("devices", devices);

            console.info("joining room...");
            // Join Room
            await room.join();

            console.info("joined room");

            // Register input/output devices
            const cameras =
                await SignalWire.WebRTC.getCameraDevicesWithPermissions();

            console.info("cameras", cameras);
            const microphones =
                await SignalWire.WebRTC.getMicrophoneDevicesWithPermissions();
            const speakers =
                await SignalWire.WebRTC.getSpeakerDevicesWithPermissions();

            // Callback with information about the room and media devices
            onRoomInit(room, cameras, microphones, speakers, roomCloseTime);

            // Listen for changes to input/output devices
            const camChangeWatcher =
                await SignalWire.WebRTC.createDeviceWatcher({
                    targets: ["camera"],
                });
            camChangeWatcher.on("changed", (changes) => {
                eventLogger("The list of camera devices has changed");
                onRoomUpdate({
                    cameras: changes.devices,
                });
            });

            const micChangeWatcher =
                await SignalWire.WebRTC.createDeviceWatcher({
                    targets: ["microphone"],
                });
            micChangeWatcher.on("changed", (changes) => {
                eventLogger("The list of microphone devices has changed");
                onRoomUpdate({
                    microphones: changes.devices,
                });
            });

            const speakerChangeWatcher =
                await SignalWire.WebRTC.createDeviceWatcher({
                    targets: ["speaker"],
                });
            speakerChangeWatcher.on("changed", (changes) => {
                eventLogger("The list of speakers has changed");
                onRoomUpdate({
                    speakers: changes.devices,
                });
            });
        } catch (e) {
            console.error(e);
            alert("Error encountered. Please try again.");
        }
    };

    return (
        <div
            id="stream"
            style={{
                width,
            }}
        ></div>
    );
};

export default Video;
