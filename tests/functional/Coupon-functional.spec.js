
import { test, expect } from '@playwright/test'
test('Coupon should not apply when cart value is below €50', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/');
        await page.getByRole('textbox', { name: 'Test email' }).click();
        await page.getByRole('textbox', { name: 'Test email' }).fill('qa-api-new01@example.test');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('Practice123!');
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.locator('#qty-bag').fill('1');
        await page.locator('#qty-bag').click();
        await page.getByRole('button', { name: 'Update cart' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Coupon code' }).click();
        await page.getByRole('textbox', { name: 'Coupon code' }).fill('SAVE10');
        await page.getByRole('button', { name: 'Apply coupon' }).click()
        await expect(
            page.getByText('Minimum subtotal of €50.00 is required')).toBeVisible();
        await expect(page.locator('#discount')).toHaveText('€0.00');
    });

    test('Invalid coupon code should not apply discount', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/');
        await page.getByRole('textbox', { name: 'Test email' }).click();
        await page.getByRole('textbox', { name: 'Test email' }).click();
        await page.getByRole('textbox', { name: 'Test email' }).fill('qa-api-new01@example.test');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('Practice123!');
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.locator('#qty-headphones').fill('1');
        await page.locator('#qty-headphones').click();
        await page.getByRole('button', { name: 'Update cart' }).nth(2).click();
        await page.getByRole('textbox', { name: 'Coupon code' }).click();
        await page.getByRole('textbox', { name: 'Coupon code' }).fill('WRONG10');
        await page.getByRole('button', { name: 'Apply coupon' }).click();
        await expect(
            page.getByText('Coupon code was not found')).toBeVisible();
        await expect(page.locator('#discount')).toHaveText('€0.00');
    });

    test('Discount should not exceed maximum of €20', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/');
        await page.getByRole('textbox', { name: 'Test email' }).click();
        await page.getByRole('textbox', { name: 'Test email' }).fill('qa-api-new01@example.test');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('Practice123!');
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.locator('#qty-headphones').click();
        await page.locator('#qty-headphones').fill('03');
        await page.locator('#qty-headphones').press('ArrowLeft');
        await page.locator('#qty-headphones').fill('3');
        await page.getByRole('button', { name: 'Update cart' }).nth(2).click();
        await page.getByRole('textbox', { name: 'Coupon code' }).click();
        await page.getByRole('textbox', { name: 'Coupon code' }).fill('SAVE10');
        await page.getByRole('button', { name: 'Apply coupon' }).click();
        await expect(page.locator('#discount')).toHaveText('€20.00');
        await expect(page.locator('#shipping')).toHaveText('€0.00');
    });

    test('Coupon should apply when cart subtotal is exactly €50', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/');
        await page.getByRole('textbox', { name: 'Test email' }).click();
        await page.getByRole('textbox', { name: 'Test email' }).fill('qa-api-new01@example.test');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('Practice123!');
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.locator('#qty-shirt').click();
        await page.locator('#qty-shirt').fill('2');
        await page.getByRole('button', { name: 'Update cart' }).first().click();
        await page.getByRole('textbox', { name: 'Coupon code' }).click();
        await page.getByRole('textbox', { name: 'Coupon code' }).fill('SAVE10');
        await page.getByRole('button', { name: 'Apply coupon' }).click();
        await expect(
            page.getByText('Coupon applied successfully')).toBeVisible();
        await expect(page.locator('#total')).toHaveText('€50.00');
        await expect(page.locator('#discount')).toHaveText('€5.00');
        await expect(page.locator('#shipping')).toHaveText('€5.00');
    });
    test('Empty coupon code should not apply discount', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/');
        await page.getByRole('textbox', { name: 'Test email' }).click();
        await page.getByRole('textbox', { name: 'Test email' }).fill('qa-api-new01@example.test');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('Practice123!');
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.locator('#qty-headphones').click();
        await page.locator('#qty-headphones').fill('1');
        await page.getByRole('button', { name: 'Update cart' }).nth(2).click();
        await page.getByRole('button', { name: 'Apply coupon' }).click();
        await expect(
            page.getByText('Coupon code is empty')).toBeVisible();
        await expect(page.locator('#discount')).toHaveText('€0.00');
    });
    