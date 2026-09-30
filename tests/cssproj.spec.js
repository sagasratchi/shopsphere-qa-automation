import{test,expect} from '@playwright/test'

test('firstproj',async({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.pause()
    await page.locator('input[name="username"]').fill('Admin')
    await page.locator('input[name=password]').fill('admin123')
    await page.getByRole('button',{name:'Login'}).click()
    await page.locator('.oxd-userdropdown-tab').click()
    await page.getByText('Logout',{exac:true}).click()

});    