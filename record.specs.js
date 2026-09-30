const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.amazon.it/');
  await page.getByRole('link', { name: 'Hello, sign in Account & Lists' }).click();
  await page.getByRole('textbox', { name: 'Enter mobile number or email' }).click();
  await page.getByRole('textbox', { name: 'Enter mobile number or email' }).fill('sadaff');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('Buying for work?').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Need help?' }).click();
  const page1 = await page1Promise;
  await page.getByRole('link', { name: 'Create a free business account' }).click();
  await page.goto('https://www.amazon.it/');

  // ---------------------
  await context.close();
  await browser.close();
})();