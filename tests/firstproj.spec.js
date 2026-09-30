import{test,expect} from '@playwright/test'

test('firstproj',async({page}) => {
    await page.goto('https://demo.applitools.com/')
    await page.pause()
    await page.locator('id=username').fill('saga123')
    await page.locator('id=password').fill('Sandy@123')
    await page.getByLabel('Remember me').check()
    await page.click('id=log-in')  
});     