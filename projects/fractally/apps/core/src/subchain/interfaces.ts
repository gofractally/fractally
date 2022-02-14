export enum SubchainReceivers {
    UNKNOWN,
    DFUSE,
    SHIP,
}

export interface SubchainConfig {
    wasmFile: string;
    stateFile: string;
    eden: string;
    token: string;
    atomic: string;
    atomicMarket: string;
    receiver: SubchainReceivers;
}

export interface ShipConfig {
    address: string;
    port: string;
    firstBlock: number;
}

export interface DfuseConfig {
    apiKey: string;
    apiNetwork: string;
    authNetwork: string;
    firstBlock: number;
    jsonTrxFile: string;
    interval: number;
    preventConnect: boolean;
}
