import React from "react";
import Modal from "react-modal";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Store } from "../store";
import { DummyModal } from "../app/sample/DummyModal";

import "../styles/globals.css";

Modal.setAppElement("#__next");

const WebApp = ({ Component, pageProps }: AppProps) => {
    const [queryClient] = React.useState(() => new QueryClient());
    return (
        <Store.StateProvider>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <Component {...pageProps} />
                    <DummyModal />
                </Hydrate>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </Store.StateProvider>
    );
};

export default WebApp;
