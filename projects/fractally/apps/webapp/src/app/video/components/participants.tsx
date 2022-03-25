import React from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

import { Participant } from "../interfaces";

interface Props {
    participantList: Participant[];
    thisParticipantId: string;
}

export const Participants = ({ participantList, thisParticipantId }: Props) => {
    return (
        <>
            {participantList.map((p) => (
                <div
                    key={`participant-${p.id}`}
                    className="flex justify-between items-center"
                >
                    <div>
                        <p>
                            {p.name} {thisParticipantId === p.id && "(me)"}
                        </p>
                    </div>
                    <div className="flex space-x-1">
                        {p.audioMuted ? (
                            <MdMicOff size={22} className="text-red-400" />
                        ) : (
                            <MdMic size={22} className="text-gray-500" />
                        )}
                        {p.videoMuted ? (
                            <MdVideocamOff size={22} className="text-red-400" />
                        ) : (
                            <MdVideocam size={22} className="text-gray-500" />
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default Participants;
