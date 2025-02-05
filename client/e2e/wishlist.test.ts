import { login } from './utils/auth'
import { expect, test } from '@playwright/test'

test.describe('create wishlist and interact with it', () => {
  test('creating wishlist', async ({ page }) => {
    // Increase test timeout
    test.setTimeout(30000)
    await login(page)

    await page.getByRole('link', { name: 'Create Wishlist' }).nth(1).click()
    await expect(page).toHaveURL('http://localhost:5173/wishlist')

    // Fill wishlist details
    await page.getByRole('textbox', { name: 'Enter the title of your' }).fill('Testas')
    await page.getByRole('textbox', { name: 'Enter the description of your' }).fill('Test wishlist')
    await page.getByRole('button', { name: 'Create wishlist' }).click()

    // Wait for the form to be processed
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // Add item
    await expect(page.getByRole('textbox', { name: 'Enter the name of the item *' })).toBeVisible({
      timeout: 10000,
    })
    await page.getByRole('textbox', { name: 'Enter the name of the item *' }).fill('Bike')
    await page.getByRole('textbox', { name: 'Enter description (optional)' }).fill('Mountain')
    await page.getByRole('spinbutton', { name: 'Enter price (optional)' }).fill('150')
    await page.getByRole('button', { name: 'Add Item' }).click()

    // Wait for item to appear
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^BikeMountain €150$/ })
        .nth(1)
    ).toBeVisible({ timeout: 10000 })

    // Delete item
    await page.getByRole('button').filter({ hasText: /^$/ }).click()

    // Wait for network operations to complete after deletion
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // Verify that no items are in the wishlist
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^No items added yet\. Start by adding your first gift above!$/ })
    ).toBeVisible({ timeout: 10000 })
  })
})
