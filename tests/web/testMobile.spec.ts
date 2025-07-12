import { test, expect } from "@playwright/test";

test("inputs", async ({ page }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name == "Mobile") {
        await page.locator(".sidebar-toggle").click();
    }
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
    if (testInfo.project.name == "Mobile") {
        await page.locator(".sidebar-toggle").click();
    }

    const usingTheGridEmailInput = page.locator("nb-card #inputEmail1");

    await usingTheGridEmailInput.fill("yevhe@gmail.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("yevhe@gmail.com");
});
