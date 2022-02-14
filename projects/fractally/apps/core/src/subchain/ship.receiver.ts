import WebSocket from "ws";
import { Logger } from "@nestjs/common";

import { SubchainStorage } from "./subchain.storage";
import { ShipConfig } from "./interfaces";

export class ShipReceiver {
    private readonly logger = new Logger(ShipReceiver.name);
    storage: SubchainStorage;
    wsClient: WebSocket | undefined;
    requestedBlocks = false;
    shipConfig: ShipConfig;

    constructor(shipConfig: ShipConfig, storage: SubchainStorage) {
        this.shipConfig = shipConfig;
        this.storage = storage;
    }

    async start() {
        await this.connect();
    }

    async connect() {
        if (this.wsClient) {
            this.logger.log(`already connected`);
            return;
        }

        try {
            this.logger.log(
                `Connecting to SHiP on ${this.shipConfig.address}:${this.shipConfig.port}...`
            );
            this.wsClient = new WebSocket(
                `ws://${this.shipConfig.address}:${this.shipConfig.port}`
            );
            this.wsClient.on("open", () => {
                this.logger.log("SHiP is now connected");
            });
            this.wsClient.on("message", (data) => this.onMessage(data));
            this.wsClient.on("close", (reason) => this.disconnect(reason));
            this.wsClient.on("error", (error) => this.disconnect(error));
        } catch (e: any) {
            this.logger.error(e);
            this.logger.log("scheduling retry in 10 min");
            setTimeout(() => {
                this.connect();
            }, 10 * 60 * 1000);
        }
    }

    disconnect(reason: any) {
        this.logger.log("closed connection: %s", reason);
        if (this.wsClient) {
            this.requestedBlocks = false;
            this.wsClient = undefined;
        }
        setTimeout(() => {
            this.connect();
        }, 1000);
    }

    onMessage(data: WebSocket.Data) {
        if (!this.requestedBlocks) {
            this.logger.log("Requesting Blocks from SHiP...");
            const request = this.storage.getShipBlocksRequest(
                this.shipConfig.firstBlock
            );
            this.requestedBlocks = true;
            this.wsClient!.send(request);
            this.logger.log("Requested Blocks from SHiP!");
        } else {
            const bytes = new Uint8Array(data as ArrayBuffer);
            this.storage.pushShipMessage(bytes);
            this.storage.saveState();
        }
    }
}
