import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/checkoutpages';

test('test', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await page.goto('http://127.0.0.1:3000/');
  await page.getByRole('textbox', { name: 'Test email' }).click();
  await page.getByRole('textbox', { name: 'Test email' }).fill('qa-api-new01@example.test');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Practice123!');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await checkoutPage.updateQuantity('2');
  await expect(checkoutPage.total).toHaveText('€55.00', { timeout: 10000 });
  await checkoutPage.applyCoupon('SAVE10');
  await expect(checkoutPage.discount).toHaveText('€5.00', { timeout : 10000});
  await expect(checkoutPage.shipping).toHaveText('€5.00');
  await expect(checkoutPage.total).toHaveText('€50.00');
  
});
