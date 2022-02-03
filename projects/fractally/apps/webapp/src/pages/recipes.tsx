import { Button } from "@fractally/components/ui";
import { NextPage } from "next";
import Link from "next/link";
import { dehydrate, QueryClient } from "react-query";
import { useAddRecipeMutation, useRecipesQuery } from "../generated/graphql";
import { useRecipeAddedSubscription } from "../subscriptions";

const RecipesPage: NextPage = () => {
    const { data } = useRecipesQuery(undefined, {
        // when using subscriptions we want to silent the react-query standard refetch options
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchIntervalInBackground: false,
    });
    const {
        mutate,
        isLoading,
        isError,
        data: addedRecipe,
    } = useAddRecipeMutation();
    useRecipeAddedSubscription();

    const addRandomRecipe = () => {
        mutate({
            newRecipeData: {
                title: `Random Recipe ${Math.floor(Math.random() * 10000)}`,
                description: "Random generated recipe",
                ingredients: [],
            },
        });
    };

    return (
        <div>
            <Button onClick={addRandomRecipe} isLoading={isLoading}>
                Test New Random Recipe
            </Button>
            <p className="text-red-500">
                {isError && "Fail to add new recipe"}
            </p>
            <p className="text-green-500">
                {addedRecipe && `Recipe ${addedRecipe.addRecipe.id} created.`}
            </p>

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
