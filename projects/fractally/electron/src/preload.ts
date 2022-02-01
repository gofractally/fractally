/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ipcRenderer, IpcRenderer } from "electron";

declare global {
    namespace NodeJS {
        interface Global {
            ipcRenderer: IpcRenderer;
        }
    }
}

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once("loaded", () => {
    (global as any).ipcRenderer = ipcRenderer;
});

// Electron does not include a screen picker for screensharing. This addresses that. Also,
// SignalWire calls getDisplayMedia() for screensharing, but getUserMedia() is what should be called.
window.navigator.mediaDevices.getDisplayMedia = async () => {
    // TODO: Check permissions with systemPreferences.getMediaAccessStatus("screen" | "microphone" | "camera").
    // TODO: Request "screen" permissions from systemPreferences.
    // TODO: Implement better UI than simple Electron.Menu.
    const selectedSourceId = await new Promise<string>((resolve, reject) => {
        ipcRenderer.once(
            "show-screen-share-selector",
            (_event, isSuccess, sourceId) => {
                if (!isSuccess) reject();
                resolve(sourceId);
            }
        );
        ipcRenderer.send("show-screen-share-selector");
    });

    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: selectedSourceId,
            },
        },
    };

    return window.navigator.mediaDevices.getUserMedia(
        constraints as MediaStreamConstraints
    );
};
