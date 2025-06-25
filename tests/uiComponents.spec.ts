import test, { expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
});

test.describe('Form Layout page', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  test('inputs', async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('checkbox', { name: 'Email' });

    await usingTheGridEmailInput.fill('yevhe@gmail.com');
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially('yevhe@gmail.com', { delay: 150 });

    //generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual('yevhe@gmail.com');

    //locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('yevhe@gmail.com');
  });

  test('radio-buttons', async ({ page }) => {
    const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

    // flow 1
    // await usingTheGridForm.getByLabel('Option 1').check({ force: true });

    // flow 2
    await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).check({ force: true });

    //generic assertion
    // const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked();
    // expect(radioStatus).toBeTruthy();

    //locator assertion
    await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).toBeChecked();

    await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });
    await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).toBeChecked();
    await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
  });
});

test('Checkboxes', async ({ page }) => {
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Toastr').click();

  await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true });
  await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true });

  const allBoxes = page.getByRole('checkbox');
  for (const box of await allBoxes.all()) {
    await box.check({ force: true });

    expect(await box.isChecked()).toBeTruthy();
  }

  for (const box of await allBoxes.all()) {
    await box.uncheck({ force: true });

    expect(await box.isChecked()).toBeFalsy();
  }
});

test('Dropdown', async ({ page }) => {
  const dropdownMenu = page.locator('ngx-header nb-select');
  await dropdownMenu.click();

  // page.getByRole('list'); //when the list has a ul tag
  // page.getByRole('listitem'); //when the list has a li tag

  // const optionList = page.getByRole('list').locator('nb-option');
  const optionList = page.locator('nb-option-list nb-option');
  await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);
  await optionList.filter({ hasText: 'Cosmic' }).click();

  await expect(page.locator('body')).toContainClass('nb-theme-cosmic');
  await expect(page.locator('.layout nb-layout-header')).toHaveCSS('background-color', 'rgb(50, 50, 89)');

  const colors = {
    Light: 'rgb(255, 255, 255)',
    Dark: 'rgb(34, 43, 69)',
    Cosmic: 'rgb(50, 50, 89)',
    Corporate: 'rgb(255, 255, 255)',
  };

  const header = page.locator('nb-layout-header');

  await dropdownMenu.click();
  for (const color in colors) {
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS('background-color', colors[color]);
    if (color != 'Corporate') {
      await dropdownMenu.click();
    }
  }
});

test('tooltip', async ({ page }) => {
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Tooltip').click();

  const tooltipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
  await tooltipCard.getByRole('button', { name: 'TOP' }).hover();
  const tooltip = await page.locator('nb-tooltip').textContent();
  // await expect(page.locator('nb-tooltip')).toHaveText('This is a tooltip');
  expect(tooltip).toEqual('This is a tooltip');
});

test('dialog boxes (browsers)', async ({ page }) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  page.on('dialog', (dialog) => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?');
    dialog.accept();
  });

  await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click();
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
});

test('web table 1', async ({ page }) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  //1 get the row by any text in this row
  // const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'});
  // await targetRow.locator('.nb-edit').click();
  // await page.locator('input-editor').getByPlaceholder('Age').clear();
  // await page.locator('input-editor').getByPlaceholder('Age').fill('35');
  // await page.locator('.nb-checkmark').click();

  //2 get the row based on the value in the specific column
  // await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
  // const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')});
  // await targetRowById.locator('.nb-edit').click();
  // await page.locator('input-editor').getByPlaceholder('E-mail').clear();
  // await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
  // await page.locator('.nb-checkmark').click();
  // await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com');

  //3 test filter of the table
  const ages = ['20', '30', '40', '200'];

  for (let age of ages) {
    await page.locator('input-filter').getByPlaceholder('Age').clear();
    await page.locator('input-filter').getByPlaceholder('Age').fill(age);
    await page.waitForTimeout(500);

    const ageRows = page.locator('tbody tr');
    for (let row of await ageRows.all()) {
      const cellValue = await row.locator('td').last().textContent();

      if (age === '200') {
        expect(await page.getByRole('table').textContent()).toContain('No data found');
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});

test('Datepicker', async ({ page }) => {
  await page.getByText('Forms').click();
  await page.getByText('Datepicker').click();

  const calendarInputField = page.getByPlaceholder('Form Picker');
  await calendarInputField.click();

  let date = new Date();
  date.setDate(date.getDate() + 200);
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' });
  const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });

  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  let calendarMontAndYear = await page.locator('nb-calendar-view-mode').textContent();
  const expectedMontAndYear = ` ${expectedMonthLong} ${expectedYear}`;

  while (!calendarMontAndYear?.includes(expectedMontAndYear)) {
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
    calendarMontAndYear = await page.locator('nb-calendar-view-mode').textContent();
  }

  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click();
  await expect(calendarInputField).toHaveValue(dateToAssert);
});

test('Sliders', async ({ page }) => {
  await page.getByText('IoT Dashboard').click();

  // Update the attribute
  // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
  // await tempGauge.evaluate((node) => {
  //   node.setAttribute('cx', '232.110'), node.setAttribute('cy', '232.110');
  // });
  // await tempGauge.click();

  // Mouse movement
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
  await tempBox.scrollIntoViewIfNeeded();

  const box = await tempBox.boundingBox();
  const x = box!.x + box!.width / 2;
  const y = box!.y + box!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 25, y);
  await page.mouse.move(x + 25, y + 25);
  await page.mouse.up();

  await expect(tempBox).toContainText('28');
});
