import { test } from '@playwright/test';
import { PageManager } from '../src/pages/pageManager';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
});

test('navigate to form page', async ({ page }) => {
    const pm = new PageManager(page);

    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datepickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().tooltipPage();
});

test('parametrized methods', async ({ page }) => {
    const pm = new PageManager(page);

    await pm.navigateTo().formLayoutsPage();
    await pm
        .onFormLayoutPage()
        .submitUsingTheGridFormWithCredentialsAndSelectOption('test@gmail.com', 'Qwerty12345%', 'Option 1');
    await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox('Yevhen', 'test1@gmail.com', true);
    await pm.navigateTo().datepickerPage();
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15);
});
