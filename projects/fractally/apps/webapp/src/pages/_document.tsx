import Document, { Html, Head, Main, NextScript } from "next/document";

const MyDocument = () => {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Raleway&display=block"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default MyDocument;
