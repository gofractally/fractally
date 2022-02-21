describe("MainContent", () => {
    beforeEach(() => {
        cy.visit(`/`);
    });

    it("should see the initial wallet main page", () => {
        const successMessage = cy.get("h1");
        successMessage.should("contain", "Wallet");
    });
});

export {};
