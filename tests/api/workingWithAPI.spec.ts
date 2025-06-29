import test, { expect } from "@playwright/test";
import tags from "../../src/test-data/tags.json";

test.beforeEach(async ({ page }) => {
    await page.route("*/**/api/tags", async (route) => {
        await route.fulfill({
            body: JSON.stringify(tags),
        });
    });

    await page.goto("https://conduit.bondaracademy.com/");
    await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");
});

test("check", async ({ page }) => {
    await expect(page.locator(".navbar-brand")).toHaveText("conduit");
});
