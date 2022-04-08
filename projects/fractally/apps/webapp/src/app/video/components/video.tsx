import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as SignalWire from "@signalwire/js";
import { VideoRoomSubscribedEventParams } from "@signalwire/core";

import { coreApiBaseUrl } from "../../config";
import { Participant, RoomUpdates } from "../interfaces";
import { VideoMemberHandlerParams } from "@signalwire/js/dist/js/src/video";

const RESERVED_LAYERS = ["full-screen", "playback"];

const convertMemberEntityToParticipant = (
    m: SignalWire.InternalVideoMemberEntity
) => ({
    id: m.id,
    name: m.name,
    audioMuted: m.audio_muted,
    videoMuted: m.video_muted,
});

interface Props {
    onRoomInit: (
        room: SignalWire.Video.RoomSession,
        cameras: MediaDeviceInfo[],
        microphones: MediaDeviceInfo[],
        speakers: MediaDeviceInfo[],
        roomCloseTime?: Date
    ) => void;
    onRoomUpdate?: (updates: RoomUpdates) => void;
    onParticipantListUpdate?: (participants: Participant[]) => void;
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
    onParticipantListUpdate = () => {},
    width = 400,
    joinDetails,
    eventLogger = (msg: string) => {
        console.log("Event:", msg);
    },
}: Props) => {
    const thisParticipantId = useRef<string>(null);
    const participantList = useRef<Participant[]>([]);

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
            const res = await axios.post(`/api/get-token`, {
                // TODO: when properly deploying `${coreApiBaseUrl}/get-token`, {
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
            room.on("room.joined", async (e) => {
                eventLogger("room.joined - the event follows:");
                console.log(e);

                const event = e as VideoRoomSubscribedEventParams;

                thisParticipantId.current = event.member_id;
                onRoomUpdate({
                    thisParticipantId: event.member_id,
                });

                const participants = event.room_session.members.map(
                    convertMemberEntityToParticipant
                );
                participantList.current = participants;
                onParticipantListUpdate(participants);
            });
            room.on("room.updated", async (e) => {
                eventLogger("room.updated - the event follows:");
                console.log(e);
            });
            room.on("memberList.updated", (e) => {
                console.log("memberList.updated", e);
                const participants = e.members.map(
                    convertMemberEntityToParticipant
                );
                participantList.current = participants;
                onParticipantListUpdate(participants);
            });
            room.on("member.joined", async (e: VideoMemberHandlerParams) => {
                eventLogger(
                    `member.joined - ${e.member.name} has joined the room. The event follows:`
                );
                console.log(e);
            });
            room.on("layout.changed", async (e) => {
                eventLogger(
                    `layout.changed - The layout was changed to ${e.layout.name}. The event follows:`
                );
                console.log(e);
                currLayout.current = e.layout; // add this line
                // onRoomUpdate({ layout: e.layout.name });
            });
            room.on("member.left", async (e) => {
                eventLogger("member.left - the event follows:");
                console.log(e);

                if (thisParticipantId.current === e.member.id) {
                    // NOTE: I think I may have seen behavior here where if you are in the room, leave and immediately rejoin
                    // there are two of you in the room after you rejoin. When SignalWire finally realizes the old you left,
                    // the old you is removed, but you are removed along with it. Keep an eye on this to see if that's happening.
                    eventLogger("You have left the room.");
                    onRoomUpdate({ left: true });
                } else {
                    eventLogger(`${e.member.name} has left the room.`);
                }
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
            alert("Error encountered. Please try again." + e);
        }
    };

    interface OverlayLocation {
        x: number;
        y: number;
        width: number;
        height: number;
        participantName: string;
    }

    const currLayout = useRef(null);
    const [overlay, setOverlay] = useState<OverlayLocation | null>(null);

    const updateOverlay = (e) => {
        // Possibly better accomplished with a refs and a hook...something like:
        // https://www.erikverweij.dev/blog/working-with-rapid-changing-styles/
        if (!currLayout) return;

        // Mouse coordinates relative to the video element, in percentage (0 to 100)
        const rect = document.getElementById("stream").getBoundingClientRect();
        const x = (100 * (e.clientX - rect.left)) / rect.width;
        const y = (100 * (e.clientY - rect.top)) / rect.height;

        const layer = currLayout.current?.layers?.find(
            (lyr) =>
                lyr.x < x &&
                x < lyr.x + lyr.width &&
                lyr.y < y &&
                y < lyr.y + lyr.height
        );

        if (layer && !RESERVED_LAYERS.includes(layer.reservation)) {
            const participant = participantList.current.find(
                (p) => p.id === layer.member_id
            );

            setOverlay({
                x: layer.x,
                y: layer.y,
                width: layer.width,
                height: layer.height,
                participantName: participant?.name,
            });
        } else {
            setOverlay(null);
        }
    };

    return (
        <div
            id="stream"
            style={{
                width,
                position: "relative",
            }}
            onMouseOver={updateOverlay}
            onMouseMove={updateOverlay}
            onMouseLeave={updateOverlay}
        >
            <div
                className="absolute overflow-hidden z-10 bg-blue-500 opacity-30 pointer-events-none backdrop-blur-md"
                style={
                    overlay
                        ? {
                              display: "block",
                              top: `${overlay.y}%`,
                              left: `${overlay.x}%`,
                              width: `${overlay.width}%`,
                              height: `${overlay.height}%`,
                          }
                        : {
                              display: "none",
                          }
                }
            >
                <h1 className="text-white">{overlay?.participantName}</h1>
            </div>
        </div>
    );
};

export default Video;
