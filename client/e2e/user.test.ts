import { login, logout } from './utils/auth'
import { expect, test } from '@playwright/test'

test('login flow', async ({ page }) => {
  await login(page)
  await expect(page.getByRole('button', { name: 'Open user menu' })).toBeVisible()
})
test('logout flow', async ({ page }) => {
  await login(page)
  await logout(page)
})
