import { NextPage } from "next";
import Link from "next/link";
import { dehydrate, QueryClient } from "react-query";
import { useRecipesQuery } from "../generated/graphql";

const RecipesPage: NextPage = () => {
    const { data } = useRecipesQuery();

    return (
        <div>
            <p>Loaded Recipes:</p>
            <pre>{JSON.stringify(data?.recipes, undefined, 2)}</pre>
            <p>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </p>
        </div>
    );
};

RecipesPage.getInitialProps = async (ctx) => {
    const props: any = {};
    if (ctx.req && !process.env.ELECTRON_EXPORT) {
        const queryClient = new QueryClient();
        await queryClient.prefetchQuery(
            useRecipesQuery.getKey(),
            useRecipesQuery.fetcher()
        );
        props.dehydratedState = dehydrate(queryClient);
    }
    return props;
};

export default RecipesPage;
