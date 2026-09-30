import{test,expect} from '@playwright/test'

test('firstproj',async({page}) => {
    await page.goto('https://admin-demo.nopcommerce.com/')
    await page.pause()
    await page.getByRole('textbox', { name: 'Email:' }).fill('admin@yourstore.com')
    await page.getByRole('textbox', {name: 'Password'}).fill('admin')
    await page.getByRole('button',{name:'LOG IN'}).click()



});