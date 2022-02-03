import { RecipesQuery, useRecipesQuery } from "../generated/graphql";
import { useSubscription } from "./useSubscription";

const query = `
subscription RecipeAdded {
    recipeAdded {
        id
        title
        description
        creationDate
        ingredients
    }
}
`;

export const useRecipeAddedSubscription = () => {
    return useSubscription(query, (data, queryClient) => {
        const { recipeAdded } = data;
        const queryData = queryClient.getQueryData<RecipesQuery>(
            useRecipesQuery.getKey()
        );
        queryData.recipes = [recipeAdded, ...queryData.recipes];
        queryClient.setQueriesData(useRecipesQuery.getKey(), queryData);
    });
};
