import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SignalWireConfig } from "./signalwire/interfaces";
import {
    SubchainReceivers,
    SubchainConfig,
    DfuseConfig,
    ShipConfig,
} from "./subchain/interfaces";

@Injectable()
export class AppConfig {
    private readonly config: ConfigService;
    private readonly logger = new Logger(AppConfig.name);
    subchainConfig: SubchainConfig;
    dfuseConfig: DfuseConfig;
    shipConfig: ShipConfig;
    signalWireConfig: SignalWireConfig;

    constructor(config: ConfigService) {
        this.config = config;
        this.initializeConfigs();
    }

    initializeConfigs() {
        this.signalWireConfig = {
            projectId: this.getConfig("SIGNALWIRE_PROJECT_ID"),
            apiKey: this.getConfig("SIGNALWIRE_API_KEY"),
            space: this.getConfig("SIGNALWIRE_SPACE"),
        };
        this.logConfig("signalWireConfig", {
            ...this.signalWireConfig,
            apiKey: "<secret>",
        });

        this.subchainConfig = {
            wasmFile: this.getConfig("SUBCHAIN_WASM"),
            stateFile: this.getConfig("SUBCHAIN_STATE"),
            eden: this.getConfig("SUBCHAIN_EDEN_CONTRACT"),
            token: this.getConfig("SUBCHAIN_TOKEN_CONTRACT"),
            atomic: this.getConfig("SUBCHAIN_AA_CONTRACT"),
            atomicMarket: this.getConfig("SUBCHAIN_AA_MARKET_CONTRACT"),
            receiver:
                SubchainReceivers[
                    this.getConfig(
                        "SUBCHAIN_RECEIVER"
                    ) as keyof typeof SubchainReceivers
                ],
        };
        this.logConfig("subchainConfig", this.subchainConfig);

        this.dfuseConfig = {
            apiKey: this.getConfig("DFUSE_API_KEY"),
            apiNetwork: this.getConfig("DFUSE_API_NETWORK"),
            authNetwork: this.getConfig("DFUSE_AUTH_NETWORK"),
            firstBlock: +this.getConfig("DFUSE_FIRST_BLOCK"),
            jsonTrxFile: this.getConfig("DFUSE_JSON_TRX_FILE"),
            interval: +this.getConfig("DFUSE_INTERVAL"),
            preventConnect: !!this.getConfig("DFUSE_PREVENT_CONNECT", false),
        };
        this.logConfig("dfuseConfig", {
            ...this.dfuseConfig,
            apiKey: "<secret>",
        });

        this.shipConfig = {
            address: this.getConfig("SHIP_ADDRESS"),
            port: this.getConfig("SHIP_PORT"),
            firstBlock: +this.getConfig("SHIP_FIRST_BLOCK"),
        };
        this.logConfig("shipConfig", this.shipConfig);
    }

    getConfig(key: string, isMandatory = true) {
        const value = this.config.get(key);
        if (isMandatory && !value) {
            const error = `Invalid required config key "${key}"`;
            this.logger.error(error);
            throw new Error(error);
        }
        return value;
    }

    logConfig(name: string, config: any) {
        const log = `${name}\n============================\n${JSON.stringify(
            config,
            undefined,
            2
        )}\n============================\n`;
        this.logger.log(log);
    }
}
