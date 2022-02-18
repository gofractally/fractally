import {
    Action,
    Asset,
    Checksum256,
    Name,
    PackedTransaction,
    PermissionLevel,
    PrivateKey,
    Serializer,
    SignedTransaction,
    Struct,
    Transaction,
    StructConstructor,
    AnyAction,
} from "anchor-link";
import { ContractAction } from "../chain/contracts";
import { eosToken } from "../chain/contracts/token";
import { chainId, link } from "./link";

export const getWalletBalance = async (
    account_name: string
): Promise<string> => {
    if (!account_name) throw new Error(`No account name passed`);
    const res = await link.client.v1.chain.get_currency_balance(
        eosToken.contractAccount,
        account_name,
        "EOS"
    );

    return res.length == 0 ? eosToken.zero : res[0].toString();
};

// TODO: remove any and fix Exported variable 'transfer' has or is using name
// 'PushTransactionResponse' from external module "@greymass/eosio/lib/eosio-core" but cannot be named.
export const transfer: any = async (
    from: string,
    to: string,
    quantity: string,
    memo?: string
) => {
    const expireSeconds = 3600;
    const info = await link.client.v1.chain.get_info();
    const header = info.getTransactionHeader(expireSeconds);

    const untypedAction: AnyAction = {
        authorization: [
            {
                actor: "joh.n",
                permission: "active",
            },
        ],
        account: "eosio.token",
        name: "transfer",
        data: {
            from,
            to,
            quantity,
            memo: memo || "",
        },
    };

    const { abi } = await link.client.v1.chain.get_abi(untypedAction.account);

    if (!abi) {
        throw new Error(`No ABI for ${untypedAction.account}`);
    }

    const action = Action.from(untypedAction, abi);

    const transaction = Transaction.from({
        ...header,
        actions: [action],
    });

    const privateKey = PrivateKey.fromString("");

    const signature = privateKey.signDigest(
        transaction.signingDigest(info.chain_id)
    );

    const signedTransaction = SignedTransaction.from({
        ...transaction,
        signatures: [signature],
    });
    return link.client.v1.chain.push_transaction(signedTransaction);
};
