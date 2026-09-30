const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.instagram.com/');
  await page.getByRole('button', { name: 'Decline optional cookies' }).click();
  await page.getByRole('textbox', { name: 'Mobile number, username or' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await page.getByRole('button', { name: 'Log in with Facebook' }).click();
  await page.getByRole('link', { name: 'Create new account' }).click();
  await page.getByRole('textbox', { name: 'Mobile number or email Mobile' }).click();
  await page.getByRole('textbox', { name: 'Password Password' }).click();
  await page.getByRole('combobox', { name: 'Select Month' }).click();

  // ---------------------
  await context.close();
  await browser.close();
})();