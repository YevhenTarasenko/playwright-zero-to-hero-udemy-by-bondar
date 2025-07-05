import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
});

test("Locator syntax rules", async ({ page }) => {
    // by name
    await page.locator("input").first().click();

    // by id
    await page.locator("#inputEmail1");

    // by class value
    page.locator(".input-full-width");

    // by attribute
    page.locator('[placeholder="Email"]');

    // by Class value (full value)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

    // combine different selectors
    page.locator('input[placeholder="Email"].input-full-width[type="email"]');

    // by XPath
    page.locator('//*[@id="inputEmail1"]');

    // by partial text match
    page.locator(':text("Using")');

    // by exact text match
    page.locator(':text-is("Using the Grid")');
});

test("User facing locators", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).first().click();
    await page.getByRole("button", { name: "Sign in" }).first().click();

    await page.getByLabel("Email").first().click();

    await page.getByPlaceholder("Jane Doe").click();

    await page.getByText("Using the grid").click();

    await page.getByTestId("SignIn").click();

    await page.getByTitle("IoT Dashboard").click();
});

test("Locating child elements", async ({ page }) => {
    await page.locator(".form-group").getByText("Option 1").click();
    // await page.locator('.form-group :text-is("Option 1")').click();

    await page.locator('.form-horizontal [type="password"]').fill("Qwerty12345%");

    await page.locator('nb-card-body [status="primary"]').getByText("Sign In").click();

    await page.locator("nb-card-body").nth(1).getByText("Sign In").click();
});

test("Locating parent elements", async ({ page }) => {
    await page.locator("nb-card", { hasText: "Using the Grid" }).getByRole("textbox", { name: "Email" }).click();

    await page
        .locator("nb-card", { has: page.locator("#inputEmail1") })
        .getByRole("textbox", { name: "Email" })
        .click();

    await page.locator("nb-card").filter({ hasText: "Using the Grid" }).getByRole("textbox", { name: "Email" }).click();

    await page
        .locator("nb-card")
        .filter({ has: page.locator(".status-danger") })
        .getByRole("textbox", { name: "Email" })
        .click();

    await page
        .locator("nb-card")
        .filter({ has: page.locator("nb-checkbox") })
        .filter({ hasText: "Sign In" })
        .getByRole("textbox", { name: "Email" })
        .click();

    await page.locator(':text-is("Using the Grid")').locator("..").getByRole("textbox", { name: "Email" }).click();
});

test("Reusing the locators", async ({ page }) => {
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
    const emailField = basicForm.getByRole("textbox", { name: "Email" });

    await emailField.fill("test@gmail.com");
    await basicForm.getByRole("textbox", { name: "Password" }).fill("Qwerty12345%");
    await basicForm.locator("nb-checkbox").click();
    await basicForm.getByRole("button").click();

    await expect(emailField).toHaveValue("test@gmail.com");
});

test("extracting values", async ({ page }) => {
    //single text value
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
    const buttonText = await basicForm.locator("button").textContent();

    expect(buttonText).toEqual("Submit");

    // all text values
    const allRadioButtonsLabels = await page.locator("nb-radio").allTextContents();
    expect(allRadioButtonsLabels).toContain("Option 1");

    //input value
    const emailField = basicForm.getByRole("textbox", { name: "Email" });
    await emailField.fill("test@gmail.com");
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual("test@gmail.com");

    const placeholderValue = await emailField.getAttribute("placeholder");
    expect(placeholderValue).toEqual("Email");
});

test("assertions", async ({ page }) => {
    const basicFormButton = page.locator("nb-card").filter({ hasText: "Basic form" }).locator("button");

    //general assertions
    const value = 5;
    await expect(value).toEqual(5);

    const text = await basicFormButton.textContent();
    await expect(text).toEqual("Submit");

    //locator assertions
    await expect(basicFormButton).toHaveText("Submit");

    //soft assertion
    await expect.soft(basicFormButton).toHaveText("Submit");
    await basicFormButton.click();
});
