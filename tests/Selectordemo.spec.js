import{test,expect} from '@playwright/test'

test('selectordemo',async({page}) => {
    await page.goto('https://saucedemo.com/')
    await page.pause()
    //using any object property
    await page.click('id=user-name')
    await page.locator('id=user-name').fill('standard_user')
    await page.click('id=password')
    await page.locator('id=password').fill('secret_sauce')
    //await page.click('id=login-button')
    //using css selector
    //#login-button
   // await page.locator('#login-button').click()
    //using xpath //*[@id="login-button"]
    //await page.locator('xpath=//input[@id="login-button"]').click()
    //using test
    await page.locator('text=LOGIN').click()
   
});
