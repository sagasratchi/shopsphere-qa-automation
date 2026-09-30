import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/checkoutpages';

test('test', async ({ page, browserName }) => {

  const checkoutPage = new CheckoutPage(page);

  const user = {
    email: `qa-smoke-${browserName}-${Date.now()}@example.test`,
    password: 'Practice123!'
  };

  await page.goto('http://127.0.0.1:3000/');

  await checkoutPage.registerAndLogin(
    user.email,
    user.password
  );

  await expect(
    page.getByText('Logged in successfully')
  ).toBeVisible();

  await checkoutPage.updateQuantity('2');

  await expect(checkoutPage.total)
    .toHaveText('€55.00');

  await checkoutPage.applyCoupon('SAVE10');

  await expect(checkoutPage.discount)
    .toHaveText('€5.00');

  await expect(checkoutPage.shipping)
    .toHaveText('€5.00');
});