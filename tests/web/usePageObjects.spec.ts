import { test } from "@playwright/test";
import { PageManager } from "../../src/pages/PageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("navigate to form page", async ({ page }) => {
    const pm = new PageManager(page);

    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datepickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().tooltipPage();
});

test("parametrized methods", async ({ page }) => {
    const pm = new PageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`;

    await pm.navigateTo().formLayoutsPage();
    await pm
        .onFormLayoutPage()
        .submitUsingTheGridFormWithCredentialsAndSelectOption(
            process.env.USER_NAME!,
            process.env.PASSWORD!,
            "Option 1",
        );

    // screenshot for all FormLayout page
    await page.screenshot({ path: "screenshots/formsLayoutsPage.png" });
    // const buffer = await page.screenshot();
    // console.log(buffer.toString("base64"));

    await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);

    // screenshot only for inline form
    await page.locator("nb-card", { hasText: "Inline form" }).screenshot({ path: "screenshots/inlineForm.png" });

    await pm.navigateTo().datepickerPage();
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15);
});
