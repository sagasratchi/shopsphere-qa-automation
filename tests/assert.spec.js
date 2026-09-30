import test, {page, expect} from '@playwright/test'


test('assertdemo',async({page}) => {
    await page.goto('https://kitchen.applitools.com/')
    await page.pause()
    //chevk element present
    await expect(page.locator('text=The Kitchen')).toHaveCount(1)
   
    if (await page.$('text=The Kitchen')){

        await page.locator('text=The Kitchen').click()
    }
 //checl element hidden or visible
     await expect(page.locator('text=The Kitchen')).toBeVisible()

 
    
});    