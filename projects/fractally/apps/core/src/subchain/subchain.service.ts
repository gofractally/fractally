import { Injectable, Logger } from "@nestjs/common";

import { AppConfig } from "../app.config";
import { SubchainReceivers } from "./interfaces";
import { DfuseReceiver } from "./dfuse.receiver";
import { SubchainStorage } from "./subchain.storage";
import { ShipReceiver } from "./ship.receiver";
import { ShipConfig, DfuseConfig, SubchainConfig } from "./interfaces";

@Injectable()
export class SubchainService {
    private readonly logger = new Logger(SubchainService.name);
    storage: SubchainStorage;
    subchainConfig: SubchainConfig;
    dfuseConfig: DfuseConfig;
    shipConfig: ShipConfig;

    constructor(appConfig: AppConfig) {
        this.subchainConfig = appConfig.subchainConfig;
        if (this.subchainConfig.receiver === SubchainReceivers.UNKNOWN) {
            this.logger.warn(
                "Skipping Subchain Service initialization since WASM is not present..."
            );
            return;
        }

        this.shipConfig = appConfig.shipConfig;
        this.dfuseConfig = appConfig.dfuseConfig;
        this.init();
    }

    private async init() {
        this.logger.log("Initializing Subchain service...");
        this.storage = new SubchainStorage(this.subchainConfig);
        await this.storage.instantiate(
            this.subchainConfig.eden,
            this.subchainConfig.token,
            this.subchainConfig.atomic,
            this.subchainConfig.atomicMarket
        );

        this.storage.saveSchema();
        await this.setupReceiver();
        this.logger.log("Subchain service initialized successfully!");
    }

    private async setupReceiver() {
        switch (this.subchainConfig.receiver) {
            case SubchainReceivers.DFUSE: {
                const dfuseReceiver = new DfuseReceiver(
                    this.subchainConfig,
                    this.dfuseConfig,
                    this.storage
                );
                return dfuseReceiver.start();
            }
            case SubchainReceivers.SHIP: {
                const shipReceiver = new ShipReceiver(
                    this.shipConfig,
                    this.storage
                );
                return shipReceiver.start();
            }
        }
    }
}
