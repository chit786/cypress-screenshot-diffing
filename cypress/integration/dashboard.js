describe("Dashboard Page", () => {
    before(() => {
        cy.visit("dashboard");
        cy.get('.page-label').should('contain','Dashboard');
    });

    it("should match the dashboard screen", () => {
        const options = {};
        options.capture = 'viewport'; // 1280x800 configured in cypress.json
        cy.takeScreenShot("DashboardPage-default", options);
    });

    it("should match the dashboard screen for 550x750", () => {
        cy.viewport(550, 750);
        cy.takeScreenShot("DashboardPage-550-750");
    });

    it("should match the dashboard screen for 'iphone-6'", () => {
        cy.viewport('iphone-6');
        cy.takeScreenShot("DashboardPage-iphone6");
    });

    it("should match the dashboard screen for 'macbook-11'", () => {
        cy.viewport('macbook-11');
        cy.takeScreenShot("DashboardPage-macbook-11");
    });

    it("should match the dashboard screen for 'ipad-2'", () => {
        cy.viewport('ipad-2');
        cy.takeScreenShot("DashboardPage-ipad-2");
    });


});