import { useQuery, UseQueryOptions, useMutation, UseMutationOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("http://localhost:3010/graphql", {
    method: "POST",
    ...({"headers":{"Content-Type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecipe: Recipe;
  removeRecipe: Scalars['Boolean'];
};


export type MutationAddRecipeArgs = {
  newRecipeData: NewRecipeInput;
};


export type MutationRemoveRecipeArgs = {
  id: Scalars['String'];
};

export type NewRecipeInput = {
  description?: InputMaybe<Scalars['String']>;
  ingredients: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  recipe: Recipe;
  recipes: Array<Recipe>;
};


export type QueryRecipeArgs = {
  id: Scalars['String'];
};


export type QueryRecipesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

/** recipe  */
export type Recipe = {
  __typename?: 'Recipe';
  creationDate: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  ingredients: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  recipeAdded: Recipe;
};

export type RecipesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
}>;


export type RecipesQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', id: string, title: string, description?: string | null | undefined, creationDate: any, ingredients: Array<string> }> };

export type AddRecipeMutationVariables = Exact<{
  newRecipeData: NewRecipeInput;
}>;


export type AddRecipeMutation = { __typename?: 'Mutation', addRecipe: { __typename?: 'Recipe', id: string } };

export type RecipeAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RecipeAddedSubscription = { __typename?: 'Subscription', recipeAdded: { __typename?: 'Recipe', id: string, title: string, description?: string | null | undefined, creationDate: any, ingredients: Array<string> } };


export const RecipesDocument = `
    query Recipes($skip: Int, $take: Int) {
  recipes(skip: $skip, take: $take) {
    id
    title
    description
    creationDate
    ingredients
  }
}
    `;
export const useRecipesQuery = <
      TData = RecipesQuery,
      TError = unknown
    >(
      variables?: RecipesQueryVariables,
      options?: UseQueryOptions<RecipesQuery, TError, TData>
    ) =>
    useQuery<RecipesQuery, TError, TData>(
      variables === undefined ? ['Recipes'] : ['Recipes', variables],
      fetcher<RecipesQuery, RecipesQueryVariables>(RecipesDocument, variables),
      options
    );

useRecipesQuery.getKey = (variables?: RecipesQueryVariables) => variables === undefined ? ['Recipes'] : ['Recipes', variables];
;

useRecipesQuery.fetcher = (variables?: RecipesQueryVariables) => fetcher<RecipesQuery, RecipesQueryVariables>(RecipesDocument, variables);
export const AddRecipeDocument = `
    mutation AddRecipe($newRecipeData: NewRecipeInput!) {
  addRecipe(newRecipeData: $newRecipeData) {
    id
  }
}
    `;
export const useAddRecipeMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddRecipeMutation, TError, AddRecipeMutationVariables, TContext>) =>
    useMutation<AddRecipeMutation, TError, AddRecipeMutationVariables, TContext>(
      ['AddRecipe'],
      (variables?: AddRecipeMutationVariables) => fetcher<AddRecipeMutation, AddRecipeMutationVariables>(AddRecipeDocument, variables)(),
      options
    );
useAddRecipeMutation.fetcher = (variables: AddRecipeMutationVariables) => fetcher<AddRecipeMutation, AddRecipeMutationVariables>(AddRecipeDocument, variables);
export const RecipeAddedDocument = `
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