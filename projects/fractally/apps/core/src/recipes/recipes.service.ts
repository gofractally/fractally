import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

import { NewRecipeInput } from "./dto/new-recipe.input";
import { RecipesArgs } from "./dto/recipes.args";
import { Recipe } from "./models/recipe.model";

@Injectable()
export class RecipesService {
    mockDb: { [key: string]: Recipe } = {
        [recipeA.id]: recipeA,
        [recipeB.id]: recipeB,
        [recipeC.id]: recipeC,
    };

    async create(data: NewRecipeInput): Promise<Recipe> {
        const newRecipe = new Recipe();
        newRecipe.id = uuidv4();
        newRecipe.creationDate = new Date();
        newRecipe.description = data.description;
        newRecipe.title = data.title;
        newRecipe.ingredients = data.ingredients;
        this.mockDb[newRecipe.id] = newRecipe;
        return newRecipe;
    }

    async findOneById(id: string): Promise<Recipe> {
        return this.mockDb[id];
    }

    async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
        return Object.values(this.mockDb);
    }

    async remove(id: string): Promise<boolean> {
        delete this.mockDb[id];
        return true;
    }
}

const recipeA = new Recipe();
recipeA.id = uuidv4();
recipeA.creationDate = new Date();
recipeA.description = "Description A";
recipeA.title = "Title A";
recipeA.ingredients = ["Ingredient A 1", "Ingredient A 2", "Ingredient A 3"];

const recipeB = new Recipe();
recipeB.id = uuidv4();
recipeB.creationDate = new Date();
recipeB.description = "Description B";
recipeB.title = "Title B";
recipeB.ingredients = ["Ingredient B 1", "Ingredient B 2", "Ingredient B 3"];

const recipeC = new Recipe();
recipeC.id = uuidv4();
recipeC.creationDate = new Date();
recipeC.description = "Description C";
recipeC.title = "Title C";
recipeC.ingredients = ["Ingredient C 1", "Ingredient C 2", "Ingredient C 3"];
