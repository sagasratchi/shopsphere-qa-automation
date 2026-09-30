import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/checkoutpages';
test.describe.configure({ retries: 0 });


test.describe('ShopSphere E2E Checkout Flow', () => {

    test('User can complete checkout with valid coupon', async ({ page, browserName }) => {

        const user = {
            email: `qa-e2e-${browserName}-${Date.now()}@example.test`,
            password: 'Practice123!'
        };
        const checkoutPage = new CheckoutPage(page);

        // 1. Open application
        await page.goto('http://127.0.0.1:3000/');

        // 2. Login
        await checkoutPage.registerAndLogin(user.email, user.password);
        await expect(
            page.getByText('Logged in successfully')).toBeVisible();
        


        // 3. Add product / update quantity
        await checkoutPage.updateQuantity('2');
        await expect(page.locator('#subtotal')).toHaveText('€50.00')

        // 4. Apply SAVE10 coupon
        await checkoutPage.applyCoupon('SAVE10');

        await expect(page.getByText('Coupon applied successfully')).toBeVisible();

        //5. Verify discount and shipping
        await expect(page.locator('#discount'))
            .toHaveText('€5.00', { timeout: 10000 });

        await expect(page.locator('#shipping'))
            .toHaveText('€5.00');
        // 6. Verify final total
        await expect(page.locator('#total'))
            .toHaveText('€50.00');
        // 7. Place order / simulate payment
        await checkoutPage.completePayment();
        // 8. Verify order confirmation
        await expect(
            page.getByText('Simulated payment successful. Order confirmed.')
        ).toBeVisible();


    });

});