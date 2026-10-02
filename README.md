# ShopSphere QA Automation Project

## Project Overview
ShopSphere is an e-commerce QA practice project focused on manual testing and Playwright automation.

This project covers coupon validation, cart updates, checkout flow, discount calculation, payment simulation, and order confirmation.

## Tools & Technologies
- Playwright
- JavaScript
- Node.js
- Visual Studio Code
- Git
- GitHub

## Test Coverage

### Functional Testing
- Valid coupon
- Invalid coupon
- Minimum subtotal validation
- Boundary value testing
- Discount cap validation
- Guest user coupon validation

### E2E Checkout Flow
- User login
- Update product quantity
- Verify subtotal
- Apply coupon
- Verify discount
- Verify shipping
- Verify final total
- Simulate successful payment
- Verify order confirmation

## Cross-Browser Testing
The automation tests were validated across:
- Chromium
- Firefox
- WebKit

## Page Object Model
Page Object Model (POM) was implemented to improve reusability and maintainability.

Reusable methods include:
- login()
- updateQuantity()
- applyCoupon()
- completePayment()

## Project Structure

```text
pages/
  checkoutpages.js

tests/
  e2e/
    checkout-e2e.spec.js

  functional/
    Coupon-functional.spec.js

  smoke/
    coupon-smoke.spec.js