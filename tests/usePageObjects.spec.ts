import {test, expect} from '@playwright/test';
import {NavigationPage} from '../src/pages/NavigationPage';

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/');
});

test('navigate to form page', async ({page}) => {
    const navigateTo = new NavigationPage(page);

    await navigateTo.formLayoutsPage();
});
