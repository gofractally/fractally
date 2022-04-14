// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const auth = {
    username: process.env.SIGNALWIRE_PROJECT_ID,
    password: process.env.SIGNALWIRE_API_KEY,
};
const baseURL = process.env.SIGNALWIRE_SPACE;

const api = axios.create({ auth, baseURL });

const moderatorPermissions = [
    "room.list_available_layouts",
    "room.set_layout",
    "room.member.audio_mute",
    "room.member.audio_unmute",
    "room.member.deaf",
    "room.member.undeaf",
    "room.member.remove",
    "room.member.set_input_sensitivity",
    "room.member.set_input_volume",
    "room.member.set_output_volume",
    "room.member.video_mute",
    "room.member.video_unmute",
];
const normalPermissions = [
    "room.self.audio_mute",
    "room.self.audio_unmute",
    "room.self.video_mute",
    "room.self.video_unmute",
    "room.self.deaf",
    "room.self.undeaf",
    "room.self.set_input_volume",
    "room.self.set_output_volume",
    "room.self.set_input_sensitivity",
    "room.hide_video_muted",
    "room.show_video_muted",
    "room.set_layout",
];

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "POST":
            return setupRoomToken(req, res);
        default:
            return res.status(400).json({ error: "request not supported " });
    }
};

const setupRoomToken = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userName, roomName, expirationMinutes, mod } = req.body;
    console.log("Name:", userName);
    console.log("Room:", roomName);
    console.log("Expires after x minutes: ", expirationMinutes);
    console.log("Moderator:", mod);

    try {
        const roomData = await setupRoom(roomName, Number(expirationMinutes));
        const token = await getVideoToken(userName, roomName);
        console.log("TOKEN:", token);
        return res
            .status(200)
            .json({ token, roomExpiration: roomData?.remove_at });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
};

interface RoomConfig {
    name: string;
    quality?: "1080p" | "720p";
    layout?:
        | "8x8"
        | "2x1"
        | "1x1"
        | "5up"
        | "5x5"
        | "4x4"
        | "10x10"
        | "2x2"
        | "6x6"
        | "3x3"
        | "grid-responsive"
        | "highlight-1-responsive";
    record_on_start?: boolean;
    remove_at?: Date;
}

const setupRoom = async (roomName: string, expiresMinutes: number) => {
    try {
        // If room does not exist, we receive a 404 response and must create the room.
        // If the room exists with an active session, we return the room.
        // If the room exists without an active session, delete the stale room and re-create it.
        const roomRes = await api.get(`rooms/${roomName}`);
        const room = roomRes.data;

        // race condition: add 10 second buffer to give the room creator time to join the room and create a session
        const now = new Date();
        const roomCreatedAtBuffer = new Date(room.created_at);
        roomCreatedAtBuffer.setSeconds(roomCreatedAtBuffer.getSeconds() + 10);

        if (now < roomCreatedAtBuffer) {
            await delay(10 * 1000);
        }

        const sessionRes = await api.get("room_sessions");
        const sessions = sessionRes.data?.data;
        const isRoomActive = sessions.some(
            (s) => s.name === roomName && s.status !== "completed"
        );

        if (!isRoomActive) {
            // alternatively, we could probably update the room instead
            await deleteRoom(room?.id);
            await delay(1 * 1000); // seems there's an error creating the same room immediately after deleting it?
            return createRoom(roomName, expiresMinutes);
        }

        return room;
    } catch (e) {
        if (e.response?.status !== 404) throw e;
        // Room does not exist
        return createRoom(roomName, expiresMinutes);
    }
};

const createRoom = async (roomName: string, expiresMinutes: number) => {
    const roomConfig: RoomConfig = {
        name: roomName,
        quality: "1080p",
        layout: "highlight-1-responsive",
        record_on_start: false,
    };

    if (expiresMinutes > 0) {
        const expirationDateTime = new Date();
        expirationDateTime.setMinutes(
            expirationDateTime.getMinutes() + expiresMinutes
        );
        console.log("Current DateTime: ", new Date());
        console.log("Expiration DateTime: ", expirationDateTime);
        roomConfig.remove_at = expirationDateTime;
    }

    const room = await api.post("rooms", roomConfig);
    console.log("CREATING ROOM: ", room.data);
    return room.data;
};

const deleteRoom = async (roomId: string) => {
    api.delete(`rooms/${roomId}`);
};

const getVideoToken = async (
    userName: string,
    roomName: string,
    mod = false
) => {
    const token = await api.post("room_tokens", {
        user_name: userName,
        room_name: roomName,
        permissions: mod
            ? [...normalPermissions, ...moderatorPermissions]
            : normalPermissions,
    });

    return token.data?.token;
};

export const delay = (ms: number) =>
    // eslint-disable-next-line
    new Promise((resolve) => setTimeout(resolve, ms));
