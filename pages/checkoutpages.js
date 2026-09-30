export class CheckoutPage {

  constructor(page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', {
      name: 'Test email'
    });

    this.passwordInput = page.getByRole('textbox', {
      name: 'Password'
    });

    this.loginButton = page.getByRole('button', {
      name: 'Log in',
      exact: true
    });
    this.registerButton = page.getByRole('button', {
      name: 'Register & log in'
    });
    this.quantity = page.locator('#qty-shirt');

    this.updateCartButton = page
      .getByRole('button', { name: 'Update cart' })
      .first();
    this.couponInput = page.getByRole('textbox', { name: 'Coupon code' });
    this.applyCouponButton = page.getByRole('button', { name: 'Apply coupon' });
    
    this.total = page.locator('#total');
    this.discount = page.locator('#discount');
    this.shipping = page.locator('#shipping');

    this.paymentButton = page.getByRole('button', { name: 'Simulate Successful payment' });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  async registerAndLogin(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }
  async updateQuantity(value) {
    await this.quantity.fill(value);
    await this.updateCartButton.click();
  }
  async applyCoupon(code) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }
  async completePayment() {
    await this.paymentButton.click();
  }
}