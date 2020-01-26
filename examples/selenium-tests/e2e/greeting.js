const { equal } = require("assert");

describe("I visit /", () => {
    before(async () => {
        await browser.url("/");
    });
    it('I see the greeting "Hello world!"', async () => {
        const element = await browser.$(".greeting");
        await element.waitForDisplayed(2000);
        const greeting = await element.getText();
        equal(greeting, "Hello world!");
    });
});
