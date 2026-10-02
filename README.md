# ShopSphere QA Automation

[![Playwright Tests](https://github.com/sagasratchi/shopsphere-qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/sagasratchi/shopsphere-qa-automation/actions/workflows/playwright.yml)

## Project Overview

ShopSphere is an e-commerce QA automation project created using Playwright and JavaScript.

The project covers functional, smoke, and end-to-end testing of the coupon and checkout flow.

## Test Coverage

- User registration and login
- Product quantity update
- Coupon validation
- Minimum subtotal validation
- Invalid coupon validation
- Empty coupon validation
- 10% discount verification
- Maximum discount cap verification
- Checkout flow
- Payment simulation
- Order confirmation
- Cross-browser testing

## Coupon Business Rules

- Coupon code: `SAVE10`
- Minimum cart subtotal: `€50.00`
- `€49.99` is not eligible
- `€50.00` is eligible
- Discount: `10%`
- Maximum discount: `€20`
- Login is required to apply the coupon

## Test Types

- Smoke Testing
- Functional Testing
- End-to-End Testing
- Positive Testing
- Negative Testing
- Boundary Value Testing

## Tech Stack

- Playwright
- JavaScript
- Page Object Model
- Git
- GitHub
- GitHub Actions

## Cross-Browser Testing

Tests are executed on:

- Chromium
- Firefox
- WebKit

## Latest Test Result

- Total Tests: 21
- Passed: 21
- Failed: 0
- Flaky: 0
- Skipped: 0

## Continuous Integration

GitHub Actions automatically runs the Playwright test suite on every push to the repository.

The CI workflow:

1. Checks out the repository
2. Sets up Node.js
3. Installs project dependencies
4. Installs Playwright browsers
5. Runs Playwright tests
6. Generates the Playwright HTML report
7. Uploads the report as a GitHub Actions artifact

## Run Tests Locally

Run the complete test suite:

```bash
npx playwright test --workers=1

Bash
  npx playwright test tests/e2e/checkout-e2e.spec.js --workers=1
Bash
  npx playwright test tests/functional/Coupon-functional.spec.js --workers=1
Bash
  npx playwright test tests/smoke/coupon-smoke.spec.js --workers=1
Bash      
  npx playwright show-report

Project structure

.github/
  workflows/
    playwright.yml

app/
  index.html
  server.js
  practice-data.json

pages/
  checkoutpages.js

tests/
  e2e/
    checkout-e2e.spec.js
  functional/
    Coupon-functional.spec.js
  smoke/
    coupon-smoke.spec.js

playwright.config.ts
package.json
README.md

CI Test Report

The latest GitHub Actions run generates a downloadable playwright-report artifact containing the HTML report and test execution details.

Project Status

✅ 21 tests passed
✅ 0 failed
✅ 0 flaky
✅ Chromium, Firefox and WebKit validated
✅ GitHub Actions CI configured successfully