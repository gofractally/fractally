import React, { useState } from "react";
import * as SignalWire from "@signalwire/js";
import { Button } from "@fractally/components/ui";

interface ToggleLayoutButtonProps {
    room: SignalWire.Video.RoomSession;
}

export const ToggleLayoutButton = ({ room }: ToggleLayoutButtonProps) => {
    // obviously, this is just a rough POC
    const layouts = {
        grid: "grid-responsive",
        highlight: "highlight-1-responsive",
    };

    const [layout, setLayout] = useState(layouts.grid);

    const toggleLayout = async () => {
        try {
            if (layout === layouts.grid) {
                await room.setLayout({ name: layouts.highlight });
                setLayout(layouts.highlight);
            } else {
                await room.setLayout({ name: layouts.grid });
                setLayout(layouts.grid);
            }
        } catch (e) {
            console.error(e);
            alert("fail to toggle layout: " + e);
        }
    };

    return <Button onClick={toggleLayout}>Layout</Button>;
};
