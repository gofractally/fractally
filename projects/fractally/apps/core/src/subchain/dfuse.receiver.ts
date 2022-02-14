import { Logger } from "@nestjs/common";
import {
    createDfuseClient,
    GraphqlStreamMessage,
    Stream,
    DfuseClient,
} from "@dfuse/client";
import * as fs from "fs";
// import * as nodeFetch from "node-fetch";
import WebSocketClient from "ws";
import { performance } from "perf_hooks";

import { SubchainStorage } from "./subchain.storage";
import { DfuseConfig, SubchainConfig } from "./interfaces";

const query = `
subscription ($query: String!, $cursor: String, $limit: Int64, $low: Int64,
              $high: Int64, $irrev: Boolean, $interval: Uint32) {
    searchTransactionsForward(
                query: $query, lowBlockNum: $low, highBlockNum: $high,
                limit: $limit, cursor: $cursor, irreversibleOnly: $irrev,
                liveMarkerInterval: $interval) {
        undo
        cursor
        irreversibleBlockNum
        block {
            num
            id
            timestamp
            previous
        }
        trace {
            id
            status
            matchingActions {
                seq
                receiver
                account
                name
                creatorAction {
                    seq
                    receiver
                }
                hexData
            }
        }
    }
}`;

interface JsonTrx {
    undo: boolean;
    cursor: string;
    irreversibleBlockNum: number;
    block: {
        num: number;
        id: string;
        timestamp: string;
        previous: string;
    };
    trace: {
        id: string;
        status: string;
        matchingActions: [
            {
                seq: number;
                receiver: string;
                account: string;
                name: string;
                creatorAction: {
                    seq: number;
                    receiver: string;
                };
                hexData: string;
            }
        ];
    };
}

const webSocketFactory = async (
    url: string,
    protocols: string[] = []
): Promise<WebSocketClient> => {
    const webSocket = new WebSocketClient(url, protocols, {
        handshakeTimeout: 30 * 1000, // 30s
        maxPayload: 10 * 1024 * 1024,
    });
    return webSocket;
};

export class DfuseReceiver {
    private readonly logger = new Logger(DfuseReceiver.name);
    storage: SubchainStorage;
    stream: Stream | null = null;
    jsonTransactions: JsonTrx[] = [];
    unpushedTransactions: JsonTrx[] = [];
    numSaved = 0;
    queryString: string;
    variables: any;
    dfuseClient: DfuseClient;
    subchainConfig: SubchainConfig;
    dfuseConfig: DfuseConfig;

    constructor(
        subchainConfig: SubchainConfig,
        dfuseConfig: DfuseConfig,
        storage: SubchainStorage
    ) {
        this.storage = storage;
        this.subchainConfig = subchainConfig;
        this.dfuseConfig = dfuseConfig;

        this.queryString = `(
            auth:${subchainConfig.eden} -action:setcode -action:setabi ||
            receiver:${subchainConfig.eden} account:${subchainConfig.eden} ||
            receiver:${subchainConfig.eden} account:${subchainConfig.token} ||
            receiver:${subchainConfig.eden} account:${subchainConfig.atomic} ||
            receiver:${subchainConfig.eden} account:${subchainConfig.atomicMarket}
        )`;

        this.variables = {
            query: this.queryString,
            cursor: "",
            low: dfuseConfig.firstBlock,
            limit: 0,
            irrev: false,
            interval: dfuseConfig.interval,
        };

        this.dfuseClient = createDfuseClient({
            apiKey: dfuseConfig.apiKey,
            network: dfuseConfig.apiNetwork,
            authUrl: dfuseConfig.authNetwork,
            httpClientOptions: {
                fetch: global.fetch,
            },
            graphqlStreamClientOptions: {
                socketOptions: {
                    webSocketFactory: (url) =>
                        webSocketFactory(url, ["graphql-ws"]),
                },
            },
            streamClientOptions: {
                socketOptions: {
                    webSocketFactory,
                },
            },
        });
    }

    pushTrx(trx: JsonTrx) {
        if (this.unpushedTransactions.length) {
            const prev =
                this.unpushedTransactions[this.unpushedTransactions.length - 1];
            if (trx.undo != prev.undo || trx.block.id != prev.block.id) {
                if (prev.undo) this.storage.undoEosioNum(prev.block.num);
                else if (prev.trace) {
                    const block = { ...prev.block, transactions: [] as any[] };
                    for (let t of this.unpushedTransactions) {
                        block.transactions.push({
                            id: t.trace.id,
                            actions: t.trace.matchingActions.map((a) => ({
                                seq: a.seq,
                                firstReceiver: a.account,
                                receiver: a.receiver,
                                name: a.name,
                                creatorAction: a.creatorAction,
                                hexData: a.hexData,
                            })),
                        });
                    }
                    this.storage.pushJsonBlock(
                        JSON.stringify(block),
                        prev.irreversibleBlockNum
                    );
                }
                this.unpushedTransactions = [];
            }
        }
        if (trx.trace !== null) this.unpushedTransactions.push(trx);
    }

    onMessage(message: GraphqlStreamMessage<any>, stream: Stream): void {
        try {
            if (message.type === "data") {
                const trx: JsonTrx = message.data.searchTransactionsForward;
                const prev =
                    this.jsonTransactions.length > 0
                        ? this.jsonTransactions[
                              this.jsonTransactions.length - 1
                          ]
                        : null;
                this.logger.log(
                    `${trx.undo ? "undo block" : "recv block"} ${
                        trx.block.num
                    } ${
                        trx.trace
                            ? "trx " + trx.trace.id
                            : "no matching transactions"
                    }`
                );
                if (
                    trx.trace ||
                    (prev && prev.trace && prev.block.num < trx.block.num)
                ) {
                    this.jsonTransactions.push(trx);
                    this.pushTrx(trx);
                    if (
                        this.jsonTransactions.length - this.numSaved > 10 ||
                        !trx.trace
                    ) {
                        this.logger.log(
                            `save ${this.dfuseConfig.jsonTrxFile}: ${this.jsonTransactions.length} transactions and undo entries`
                        );
                        fs.writeFileSync(
                            this.dfuseConfig.jsonTrxFile + ".tmp",
                            JSON.stringify(this.jsonTransactions)
                        );
                        fs.renameSync(
                            this.dfuseConfig.jsonTrxFile + ".tmp",
                            this.dfuseConfig.jsonTrxFile
                        );
                        this.storage.saveState();
                        this.numSaved = this.jsonTransactions.length;
                    }
                }
                stream.mark({
                    cursor: trx.cursor,
                });
            } else if (message.type === "complete") {
                this.logger.error(`DfuseReceiver.onMessage: ${message.type}`);
                this.logger.error("DfuseReceiver.onMessage: closing stream");
                this.disconnect();
                this.logger.error(
                    "DfuseReceiver.onMessage: scheduling retry in 1 sec"
                );
                setTimeout(() => {
                    this.connect();
                }, 1000);
            } else if (message.type === "error") {
                this.logger.error(JSON.stringify(message, null, 4));
            } else {
                this.logger.log(
                    `DfuseReceiver.onMessage: ${(message as any).type}`
                );
            }
        } catch (e: any) {
            this.logger.error(e);
            this.logger.error("DfuseReceiver.onMessage: closing stream");
            this.disconnect();
        }
    }

    async start() {
        try {
            try {
                this.jsonTransactions = JSON.parse(
                    fs.readFileSync(this.dfuseConfig.jsonTrxFile, "utf8")
                );
                this.numSaved = this.jsonTransactions.length;
            } catch (e) {}

            const begin = performance.now();
            this.logger.log("pushing existing blocks...");
            for (let trx of this.jsonTransactions) this.pushTrx(trx);
            this.logger.log(`${performance.now() - begin} ms`);
            this.storage.saveState();

            if (!this.dfuseConfig.preventConnect) await this.connect();
        } catch (e: any) {
            this.logger.error(e);
            process.exit(1);
        }
    } // start()

    async connect() {
        if (this.stream) {
            this.logger.log(`already connected`);
            return;
        }
        try {
            this.logger.log(`connecting to ${this.dfuseConfig.apiNetwork}`);
            if (
                !this.jsonTransactions.length &&
                this.dfuseConfig.firstBlock === 1
            )
                this.logger.warn(
                    "Don't have an existing dfuse cursor and DFUSE_FIRST_BLOCK isn't greater than 1; " +
                        "this may take a while before the first result comes..."
                );
            if (this.jsonTransactions.length)
                this.variables.cursor =
                    this.jsonTransactions[
                        this.jsonTransactions.length - 1
                    ].cursor;
            this.stream = await this.dfuseClient.graphql(
                query,
                this.onMessage.bind(this),
                {
                    operationType: "subscription",
                    variables: this.variables,
                }
            );
            this.logger.log("dfuse is now connected");
        } catch (e: any) {
            this.logger.error(e);
            this.logger.log("scheduling retry in 10 min");
            setTimeout(() => {
                this.connect();
            }, 10 * 60 * 1000);
        }
    }

    disconnect() {
        if (this.stream) {
            try {
                this.stream.close();
            } catch (e: any) {
                this.logger.error(e);
                this.logger.error("DfuseReceiver.disconnect: close failed");
            }
            this.stream = null;
        }
    }
}
