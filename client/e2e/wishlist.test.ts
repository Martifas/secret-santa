import { login } from './utils/auth'
import { expect, test } from '@playwright/test'

test.describe('create wishlist and interact with it', () => {
  test('creating wishlist', async ({ page }) => {
    await login(page, 'thesecretgiftmeister@gmail.com', 'Kakarotas2025++')

    await page.getByRole('link', { name: 'Create Wishlist' }).nth(1).click()
    await expect(page).toHaveURL('http://localhost:5173/wishlist')

    // Fill wishlist details
    await page.getByRole('textbox', { name: 'Enter the title of your' }).fill('Testas')
    await page.getByRole('textbox', { name: 'Enter the description of your' }).fill('Test wishlist')
    await page.getByRole('button', { name: 'Create wishlist' }).click()

    // Add first item
    await page.getByRole('textbox', { name: 'Enter the name of the item *' }).fill('Bike')
    await page.getByRole('textbox', { name: 'Enter description (optional)' }).fill('Mountain')
    await page.getByRole('spinbutton', { name: 'Enter price (optional)' }).fill('150')
    await page.getByRole('button', { name: 'Add Item' }).click()

    await expect(
      page
        .locator('div')
        .filter({ hasText: /^BikeMountain €150$/ })
        .nth(1)
    ).toBeVisible()

    // Add second item
    await page.getByRole('textbox', { name: 'Enter the name of the item *' }).fill('Mountain shoes')
    await page.getByRole('textbox', { name: 'Enter description (optional)' }).fill('Stable and fun')
    await page.getByRole('spinbutton', { name: 'Enter price (optional)' }).fill('500')
    await page.getByRole('button', { name: 'Add Item' }).click()

    await expect(
      page
        .locator('div')
        .filter({ hasText: /^Mountain shoesStable and fun €500$/ })
        .first()
    ).toBeVisible()

    // Delete Second item
    await page.getByRole('button').nth(4).click()

    await expect(
      page
        .locator('div')
        .filter({ hasText: /^BikeMountain €150$/ })
        .nth(1)
    ).not.toBeVisible()
  })
})
