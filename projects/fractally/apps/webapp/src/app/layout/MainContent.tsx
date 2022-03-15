import { useState, useEffect } from "react";
import { BiMoney } from "react-icons/bi";
import {
    debounceTime,
    distinctUntilChanged,
    interval,
    map,
    mapTo,
    switchMap,
    timer,
    withLatestFrom,
    tap,
    combineLatest,
} from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { InputFactory, useEventCallback } from "rxjs-hooks";
import { usdPrice$ } from "../../observables/eosUsdPrice";
import { transfer } from "../../rpc/rpc";
import { numToAsset } from "../../chain/utils";
import { Button } from "@fractally/components/ui";
import { useGlobalStore } from "../../store";
import { actionShowDummyModal } from "../../store/actions";

export const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);

export const MainContent = () => {
    const [toAccount, setAccount] = useState("");

    const { state, dispatch } = useGlobalStore();

    const [quantityAmount, setQuantityAmount] = useState("");
    const [memo, setMemo] = useState("");

    const [_, [name, avatar]] = useEventCallback<
        React.ChangeEvent<HTMLInputElement>,
        [string, string],
        [string]
    >(
        (event$, state$, input$) =>
            input$.pipe(
                debounceTime(400),
                distinctUntilChanged(),
                withLatestFrom(state$),
                map((a) => a[0][0]),
                switchMap((account) =>
                    fromFetch("http://api.violet.garden/users").pipe(
                        switchMap(
                            (res) =>
                                res.json() as Promise<
                                    {
                                        name: string;
                                        photo: string;
                                        username: string;
                                    }[]
                                >
                        ),
                        map((accounts): [string, string] => {
                            const res = accounts.find(
                                (a) => a.username == account
                            );
                            return res
                                ? [
                                      res.name,
                                      `https://ipfs.orelo.software/ipfs/${res.photo}`,
                                  ]
                                : [
                                      account == ""
                                          ? "No Eden profile found."
                                          : account,
                                      "https://www.pngkey.com/png/full/114-1149847_avatar-unknown-dp.png",
                                  ];
                        })
                    )
                )
            ),
        ["", ""],
        [toAccount]
    );

    const [setFiatValue, fiatValue] = useEventCallback<
        string,
        string,
        [string]
    >(
        (event$, state$, input$) =>
            combineLatest([input$, usdPrice$]).pipe(
                map(([[amount], usdPrice]) =>
                    Number.isNaN(amount)
                        ? "$0.00"
                        : formatMoney(Number(amount) * usdPrice)
                )
            ),
        "$0.00",
        [quantityAmount]
    );

    const [isLoading, setIsLoading] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Send");

    const resetForm = () => {
        setQuantityAmount("");
        setAccount("");
        setMemo("");
    };

    const send = async () => {
        setIsLoading(true);
        setButtonLabel("Processing...");
        try {
            const res = await transfer(
                "joh.n",
                toAccount,
                numToAsset(Number(quantityAmount)),
                memo
            );
            resetForm();
            console.log(res, "was the tx res");
        } catch (e) {
            console.error(e);
            alert(e.message);
        } finally {
            setButtonLabel("Send");
            setIsLoading(false);
        }
    };

    const handleDummyModalClick = async () => {
        const showDummyModal = new Promise((resolve) => {
            dispatch(actionShowDummyModal(true, resolve));
        });
        const result = await showDummyModal;
        console.info("result was successful:", result);
    };

    return (
        <div className="h-screen p-4 w-full space-y-6 bg-gray-700 text-white ">
            <div className="space-y-6 w-full max-w-2xl">
                <div className="bg-gray-600 p-4 rounded-xl flex justify-between">
                    <div className="flex flex-col justify-center font-bold">
                        <h2>Recipient</h2>
                    </div>
                    <div>
                        <input
                            value={toAccount}
                            onChange={(e) => setAccount(e.target.value)}
                            className="rounded-lg text-gray-300 bg-gray-700 px-4 py-2"
                        />
                    </div>
                </div>

                <div className="bg-gray-600 p-4 rounded-xl flex justify-between">
                    <div className="flex flex-col justify-center font-bold">
                        <h2>Amount</h2>
                    </div>
                    <div>
                        <input
                            value={quantityAmount}
                            type="number"
                            onChange={(e) => setQuantityAmount(e.target.value)}
                            className="rounded-lg text-gray-300 bg-gray-700 border-none px-4 py-2"
                        />
                    </div>
                </div>

                <div className="bg-gray-600 p-4 rounded-xl flex justify-between">
                    <div className="flex flex-col justify-center font-bold">
                        <h2>Memo</h2>
                    </div>
                    <div>
                        <input
                            value={memo}
                            type="textarea"
                            onChange={(e) => setMemo(e.target.value)}
                            className="rounded-lg text-gray-300 bg-gray-700 px-4 py-2"
                        />
                    </div>
                </div>

                <button
                    disabled={isLoading}
                    onClick={() => send()}
                    className={`p-4 w-full flex justify-center  ${
                        isLoading
                            ? "bg-green-700"
                            : "hover:bg-green-400 bg-green-500"
                    } rounded-lg text-lg text-white font-medium`}
                >
                    <BiMoney size={40} />
                    <div className="flex flex-col ml-4 justify-center">
                        {buttonLabel}
                    </div>
                </button>

                <div className="grid grid-cols-2 p-4  justify-around">
                    <div className="flex justify-center space-y-4 flex-col">
                        <img
                            className="w-24 mx-auto h-24 rounded-full"
                            src={avatar}
                            alt=""
                        />
                        <div className="text-center">{name}</div>
                    </div>
                    <div className="text-lg font-medium flex flex-col mx-auto justify-center">
                        {fiatValue}
                    </div>
                </div>

                <Button onClick={handleDummyModalClick}>
                    Show Dummy Modal
                </Button>
            </div>
        </div>
    );
};
