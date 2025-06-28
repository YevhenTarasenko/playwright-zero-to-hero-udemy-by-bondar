import { test, expect } from '@playwright/test';
import { NavigationPage } from '../src/pages/NavigationPage';
import { FormLayoutPage } from '../src/pages/FormLayoutsPage';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
});

test('navigate to form page', async ({ page }) => {
    const navigateTo = new NavigationPage(page);

    await navigateTo.formLayoutsPage();
    await navigateTo.datepickerPage();
    await navigateTo.smartTablePage();
    await navigateTo.toastrPage();
    await navigateTo.tooltipPage();
});

test('parametrized methods', async ({ page }) => {
    const navigateTo = new NavigationPage(page);
    const onFormLayoutPage = new FormLayoutPage(page);

    await navigateTo.formLayoutsPage();
    await onFormLayoutPage.submitUsingTheGridFormWithCredentialsAndSelectOption(
        'test@gmail.com',
        'Qwerty12345%',
        'Option 1',
    );
    await onFormLayoutPage.submitInlineFormWithNameEmailAndCheckbox('Yevhen', 'test1@gmail.com', true);
});
