export interface Participant {
    id: string;
    name: string;
    audioMuted: boolean;
    videoMuted: boolean;
}

export interface RoomUpdates {
    thisParticipantId?: string;
    left?: boolean;
    cameras?: MediaDeviceInfo[];
    microphones?: MediaDeviceInfo[];
    speakers?: MediaDeviceInfo[];
}
