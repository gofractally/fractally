import { link } from "./link";

const tokenContract = "eosio.token";

export const getWalletBalance = async (
    account_name: string
): Promise<string> => {
    if (!account_name) throw new Error(`No account name passed`);
    const res = await link.client.v1.chain.get_currency_balance(
        tokenContract,
        account_name,
        "EOS"
    );

    return res.length == 0 ? "0.0000 EOS" : res[0].toString();
};
