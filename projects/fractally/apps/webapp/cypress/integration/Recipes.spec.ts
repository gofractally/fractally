describe("Recipes", () => {
    beforeEach(() => {
        cy.visit(`/recipes`);
    });

    it("should see a list of recipes", () => {
        const successMessage = cy.get("h1");
        successMessage.should("contain", "Loaded Recipes");
    });

    it("should be able to add a new recipe", async () => {
        const newRecipeButton = cy.get(`[data-testid="addRandomRecipe"]`);
        newRecipeButton.click();

        cy.get(`[data-testid="addedRecipeMessage"]`)
            .should("exist")
            .should("contain", "created");
    });
});

export {};
