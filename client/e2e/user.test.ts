import { login, logout } from './utils/auth'
import { test } from '@playwright/test'

test('login and logout flow', async ({ page }) => {
  await login(page, 'thesecretgiftmeister@gmail.com', 'Kakarotas2025++')
  await logout(page)
})
