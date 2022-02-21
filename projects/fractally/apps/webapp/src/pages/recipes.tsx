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
        <div className="m-4 space-y-2">
            <p>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </p>

            <Button
                onClick={addRandomRecipe}
                isLoading={isLoading}
                dataTestId="addRandomRecipe"
            >
                Test New Random Recipe
            </Button>
            <p className="text-red-500">
                {isError && "Fail to add new recipe"}
            </p>
            <p className="text-green-500" data-testid="addedRecipeMessage">
                {addedRecipe && `Recipe ${addedRecipe.addRecipe.id} created.`}
            </p>

            <h1 className="text-2xl font-bold">Loaded Recipes</h1>
            {data?.recipes.map((recipe, index) => (
                <div key={index} className="m-4">
                    <h2 className="text-lg">Recipe {recipe.title}</h2>
                    <p>{recipe.description}</p>
                    <pre>{JSON.stringify(recipe.ingredients)}</pre>
                </div>
            ))}
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
