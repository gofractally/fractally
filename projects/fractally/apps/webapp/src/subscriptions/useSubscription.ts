import { useEffect, useState } from "react";
import { QueryClient, useQueryClient } from "react-query";
import { createClient } from "graphql-ws";

import { coreSubscriptionsBaseUrl } from "../app/config";

const url = coreSubscriptionsBaseUrl;

export const useSubscription = (
    query: string,
    onData: (data: any, queryClient: QueryClient) => void
) => {
    const queryClient = useQueryClient();
    const [gqlWsClient] =
        typeof window !== "undefined"
            ? useState(
                  createClient({
                      url,
                  })
              )
            : [];

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const onNext = (msg) => {
            console.info(msg);
            if (msg.data) {
                onData(msg.data, queryClient);
            }
        };
        const onError = (error) => {
            console.info("error on subscription: ", error);
            setIsError(true);
        };
        const complete = () => {};
        gqlWsClient.on("connected", () => {
            setIsSubscribed(true);
        });
        const unsubscribe = gqlWsClient.subscribe(
            { query },
            { next: onNext, error: onError, complete }
        );
        return () => {
            console.info(`unsubscribing from ${query}`);
            unsubscribe();
        };
    }, []);
    return { isSubscribed, isError };
};
