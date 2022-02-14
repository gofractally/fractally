import { Logger } from "@nestjs/common";
import * as fs from "fs";

import { SubchainConfig } from "./interfaces";
import { FractallySubchain } from "./fractally.subchain";

export class SubchainStorage {
    private readonly logger = new Logger(SubchainStorage.name);
    blocksWasm: FractallySubchain | null = null;
    stateWasm: FractallySubchain | null = null;
    head = 0;
    callbacks: (() => void)[] = [];
    subchainConfig: SubchainConfig;

    constructor(subchainConfig: SubchainConfig) {
        this.subchainConfig = subchainConfig;
    }

    // TODO: review and replace with fractally contracts
    async instantiate(
        edenAccount: string,
        tokenAccount: string,
        atomicAccount: string,
        atomicmarketAccount: string
    ) {
        try {
            this.blocksWasm = new FractallySubchain();
            await this.blocksWasm.instantiate(
                new Uint8Array(fs.readFileSync(this.subchainConfig.wasmFile))
            );
            this.blocksWasm.initializeMemory(
                edenAccount,
                tokenAccount,
                atomicAccount,
                atomicmarketAccount
            );

            this.stateWasm = new FractallySubchain();
            await this.stateWasm.instantiate(
                new Uint8Array(fs.readFileSync(this.subchainConfig.wasmFile))
            );
            this.stateWasm.initializeMemory(
                edenAccount,
                tokenAccount,
                atomicAccount,
                atomicmarketAccount
            );
        } catch (e) {
            this.blocksWasm = null;
            this.stateWasm = null;
            throw e;
        }
    }

    protect<T>(f: () => T) {
        if (!this.blocksWasm || !this.stateWasm)
            throw new Error("wasm state is corrupt");
        try {
            return f();
        } catch (e) {
            this.blocksWasm = null;
            this.stateWasm = null;
            throw e;
        }
    }

    saveState() {
        return this.protect(() => {
            fs.writeFileSync(
                this.subchainConfig.stateFile + ".tmp",
                this.stateWasm!.uint8Array()
            );
            fs.renameSync(
                this.subchainConfig.stateFile + ".tmp",
                this.subchainConfig.stateFile
            );
            this.logger.log(`saved ${this.subchainConfig.stateFile}`);
        });
    }

    saveSchema() {
        const schema = this.protect(() => {
            return this.blocksWasm!.getSchema();
        });
        fs.writeFileSync("subchain.schema.gql", schema);
    }

    query(q: string): any {
        return this.protect(() => {
            return this.blocksWasm!.query(q);
        });
    }

    getBlock(num: number): Uint8Array {
        return this.protect(() => this.blocksWasm!.getBlock(num))!;
    }

    idForNum(num: number): string {
        return this.query(`{blockLog{blockByNum(num:${num}){id}}}`).data
            .blockLog.blockByNum.id;
    }

    changed() {
        const r = this.query("{blockLog{head{num}}}");
        this.head = r.data.blockLog.head?.num || 0;
        const cb = this.callbacks;
        this.callbacks = [];
        for (let f of cb) {
            try {
                f();
            } catch (e) {
                this.logger.error(e);
            }
        }
    }

    undoEosioNum(eosioNum: number) {
        this.protect(() => {
            this.blocksWasm!.undoEosioNum(eosioNum);
            this.stateWasm!.undoEosioNum(eosioNum);
        });
        this.changed();
    }

    pushJsonBlock(jsonBlock: string, irreversible: number) {
        const result = this.protect(() => {
            const result = this.blocksWasm!.pushJsonBlock(
                jsonBlock,
                irreversible
            );
            this.stateWasm!.pushJsonBlock(jsonBlock, irreversible);
            this.stateWasm!.trimBlocks();
            return result;
        });
        this.changed();
        return result;
    }

    getShipBlocksRequest(blockNum: number): Uint8Array {
        return this.protect(() =>
            this.blocksWasm!.getShipBlocksRequest(blockNum)
        )!;
    }

    pushShipMessage(shipMessage: Uint8Array) {
        const result = this.protect(() => {
            const result = this.blocksWasm!.pushShipMessage(shipMessage);
            this.stateWasm!.pushShipMessage(shipMessage);
            this.stateWasm!.trimBlocks();
            return result;
        });
        this.changed();
        return result;
    }
}
