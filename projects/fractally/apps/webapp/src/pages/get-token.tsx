import { NextPage } from "next";
import Link from "next/link";
import { dehydrate, QueryClient, useQuery } from "react-query";

const TOKEN_QUERY_KEY = "token";
const getToken = async () => {
    const res = await fetch("http://localhost:3010/get-token");
    const data = await res.json();
    console.info("querying token data", data);
    return data;
};

const GetTokenPage: NextPage = () => {
    const { data, refetch } = useQuery(TOKEN_QUERY_KEY, getToken);

    const getTokenHandler = async () => {
        refetch();
    };

    return (
        <div>
            <p>Token is {data?.token}</p>
            <button type="button" onClick={getTokenHandler}>
                Refresh Token
            </button>
            <p>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </p>
        </div>
    );
};

GetTokenPage.getInitialProps = async (ctx) => {
    const props: any = {};
    if (ctx.req && !process.env.ELECTRON_EXPORT) {
        const queryClient = new QueryClient();
        await queryClient.prefetchQuery(TOKEN_QUERY_KEY, getToken);
        props.dehydratedState = dehydrate(queryClient);
    }
    return props;
};

export default GetTokenPage;
