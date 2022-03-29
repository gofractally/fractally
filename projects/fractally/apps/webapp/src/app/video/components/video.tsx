import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as SignalWire from "@signalwire/js";
import { VideoRoomSubscribedEventParams } from "@signalwire/core";

import { coreApiBaseUrl } from "../../config";
import { Participant, RoomUpdates } from "../interfaces";

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

    const updateParticipantList = async (
        room: SignalWire.Video.RoomSession
    ) => {
        let m: {
            members: SignalWire.InternalVideoMemberEntity[];
        };

        try {
            eventLogger("Fetching members - room.getMembers()");
            m = (await room.getMembers()) as unknown as {
                // BUG: SignalWire's `getMembers` return type seems to be incorrect
                members: SignalWire.InternalVideoMemberEntity[];
            };
            console.log("Members:", m);
        } catch (e) {
            console.log(
                "Unable to get available members because of errors:",
                e
            );
            return;
        }

        if (m.members === undefined) return;

        const participants = m.members.map(convertMemberEntityToParticipant);
        participantList.current = participants;
        onParticipantListUpdate(participants);
    };

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
                    eventLogger("room.joined - the event follows:");
                    console.log(e);

                    thisParticipantId.current = e.member_id;
                    onRoomUpdate({
                        thisParticipantId: e.member_id,
                    });

                    // TODO: BUG: The join event does not have the correct mute values so we must fetch the participant list instead
                    await updateParticipantList(room);
                }
            );
            room.on("room.updated", async (e) => {
                // I haven't tested this event
                eventLogger("room.updated - the event follows:");
                console.log(e);
                // await updateParticipantList(room);
            });
            room.on("member.joined", async (e) => {
                eventLogger(
                    `member.joined - ${e.member.name} has joined the room. The event follows:`
                );
                console.log(e);
                participantList.current.push(e.member);
                onParticipantListUpdate(participantList.current);
            });
            room.on("member.updated", async (e) => {
                eventLogger("member.updated - the event follows:");
                console.log(e.member);
                const staleParticipant = participantList.current.find(
                    (p) => p.id === e.member.id
                );
                if (!staleParticipant) return;

                const updates: Participant = convertMemberEntityToParticipant(
                    e.member as unknown as SignalWire.InternalVideoMemberEntity
                ); // BUG: SignalWire types appear whack here too

                const updatedParticipant: Participant = {
                    ...staleParticipant,
                    ...updates,
                };

                const newParticipantList = participantList.current.filter(
                    (p) => p.id !== e.member.id
                );
                newParticipantList.push(updatedParticipant);
                participantList.current = newParticipantList;

                onParticipantListUpdate(newParticipantList);
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

                const participantThatLeft = participantList.current.find(
                    (p) => p.id === e.member.id
                );

                const remainingParticipants = participantList.current.filter(
                    (p) => p.id !== e.member.id
                );

                if (!participantThatLeft) {
                    onRoomUpdate({ left: true });
                    return;
                }

                if (thisParticipantId.current === participantThatLeft.id) {
                    // NOTE: I think I may have seen behavior here where if you are in the room, leave and immediately rejoin
                    // there are two of you in the room after you rejoin. When SignalWire finally realizes the old you left,
                    // the old you is removed, but you are removed along with it. Keep an eye on this to see if that's happening.
                    eventLogger("You have left the room.");
                    onRoomUpdate({ left: true });
                    return; // avoid updating the participants state since you left, which would update an unmounted component
                } else {
                    eventLogger(
                        `${participantThatLeft.name} has left the room.`
                    );
                }

                participantList.current = remainingParticipants;
                onParticipantListUpdate(remainingParticipants);
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

        if (layer && layer.reservation !== "fullscreen") {
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
