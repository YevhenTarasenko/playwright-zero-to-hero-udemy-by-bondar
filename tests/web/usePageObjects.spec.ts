import { test } from "@playwright/test";
import { PageManager } from "../../src/pages/PageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/");
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
        .submitUsingTheGridFormWithCredentialsAndSelectOption("test@gmail.com", "Qwerty12345%", "Option 1");
    await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);
    await pm.navigateTo().datepickerPage();
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15);
});
