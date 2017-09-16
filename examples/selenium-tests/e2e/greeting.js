const { equal } = require("assert");

describe("I visit /", () => {
    before(async () => {
        await browser.url("/");
    });
    it('I see the greeting "Hello world!"', async () => {
        await browser.waitForVisible(".greeting", 2000);
        const greeting = await browser.getText(".greeting");
        equal(greeting, "Hello world!");
    });
});
