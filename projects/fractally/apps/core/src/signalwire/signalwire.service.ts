import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { delay } from "@fractally/common";

import { AppConfig } from "../app.config";
import { SignalWireConfig } from "./interfaces";

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
];

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

export interface RoomRequestInput {
    userName: string;
    roomName: string;
    expirationMinutes: number;
    mod: string;
}

@Injectable()
export class SignalWireService {
    private api: AxiosInstance;
    private config: SignalWireConfig;

    constructor(appConfig: AppConfig) {
        this.config = appConfig.signalWireConfig;
        const auth = {
            username: this.config.projectId,
            password: this.config.apiKey,
        };
        const baseURL = this.config.space;
        this.api = axios.create({ auth, baseURL });
    }

    async setupRoomToken(roomRequest: RoomRequestInput) {
        const { userName, roomName, expirationMinutes, mod } = roomRequest;
        console.log("Name:", userName);
        console.log("Room:", roomName);
        console.log("Expires after x minutes: ", expirationMinutes);
        console.log("Moderator:", mod);

        const roomData = await this.setupRoom(
            roomName,
            Number(expirationMinutes)
        );
        const token = await this.getVideoToken(userName, roomName);
        console.log("TOKEN:", token);
        return { token, roomExpiration: roomData?.remove_at };
    }

    async setupRoom(roomName: string, expiresMinutes: number) {
        try {
            // If room does not exist, we receive a 404 response and must create the room.
            // If the room exists with an active session, we return the room.
            // If the room exists without an active session, delete the stale room and re-create it.
            const roomRes = await this.api.get(`rooms/${roomName}`);
            const room = roomRes.data;

            // race condition: add 10 second buffer to give the room creator time to join the room and create a session
            const now = new Date();
            const roomCreatedAtBuffer = new Date(room.created_at);
            roomCreatedAtBuffer.setSeconds(
                roomCreatedAtBuffer.getSeconds() + 10
            );

            if (now < roomCreatedAtBuffer) {
                await delay(10 * 1000);
            }

            const sessionRes = await this.api.get("room_sessions");
            const sessions = sessionRes.data?.data;
            const isRoomActive = sessions.some(
                (s) => s.name === roomName && s.status !== "completed"
            );

            if (!isRoomActive) {
                // alternatively, we could probably update the room instead
                await this.deleteRoom(room?.id);
                await delay(1 * 1000); // seems there's an error creating the same room immediately after deleting it?
                return this.createRoom(roomName, expiresMinutes);
            }

            return room;
        } catch (e) {
            if (e.response?.status !== 404) throw e;
            // Room does not exist
            return this.createRoom(roomName, expiresMinutes);
        }
    }

    async createRoom(roomName: string, expiresMinutes: number) {
        const roomConfig: RoomConfig = {
            name: roomName,
            quality: "1080p",
            layout: "grid-responsive",
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

        const room = await this.api.post("rooms", roomConfig);
        console.log("CREATING ROOM: ", room.data);
        return room.data;
    }

    async deleteRoom(roomId: string) {
        return this.api.delete(`rooms/${roomId}`);
    }

    async getVideoToken(userName: string, roomName: string, mod = false) {
        const token = await this.api.post("room_tokens", {
            user_name: userName,
            room_name: roomName,
            permissions: mod
                ? [...normalPermissions, ...moderatorPermissions]
                : normalPermissions,
        });
        return token.data?.token;
    }
}
