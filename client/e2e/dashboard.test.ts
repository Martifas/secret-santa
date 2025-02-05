import { login } from './utils/auth'
import { expect, test } from '@playwright/test'

test.describe('dashboard interactions', () => {
  test('opening dashboard', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Dashboard' }).first().click()

    await expect(page).toHaveURL('http://localhost:5173/dashboard')

    await expect(page.getByRole('button', { name: 'Create New Gift Exchange' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create New Wishlist' })).toBeVisible()
  }),
    test('dashboard create new gift exchange button leading to exchange page', async ({ page }) => {
      await login(page)
      await page.getByRole('link', { name: 'Dashboard' }).first().click()

      await page.getByRole('button', { name: 'Create New Gift Exchange' }).click()

      await expect(page).toHaveURL('http://localhost:5173/gift-exchanges')
    })
  test('dashboard create new wishlist button leading to wishlist page', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Dashboard' }).first().click()

    await page.getByRole('button', { name: 'Create New Wishlist' }).click()

    await expect(page).toHaveURL('http://localhost:5173/wishlist')
  })
})
