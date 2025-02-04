import { login } from './utils/auth'
import { expect, test } from '@playwright/test'

test('creating an exchange event', async ({ page }) => {
  await login(page, 'thesecretgiftmeister@gmail.com', 'Kakarotas2025++')
  await page.getByRole('link', { name: 'Create Exchange Event' }).click()

  await expect(page).toHaveURL('http://localhost:5173/gift-exchanges')

  await page.getByRole('textbox', { name: 'Title' }).click()
  await page.getByRole('textbox', { name: 'Title' }).fill('Testas')
  await page.getByRole('textbox', { name: 'Enter a description*' }).click()
  await page.getByRole('textbox', { name: 'Enter a description*' }).fill('Test description')
  await page.getByRole('textbox', { name: 'Enter a description*' }).press('Tab')
  await page.getByRole('spinbutton', { name: 'Budget*' }).fill('100')
  await page.locator('[data-test-id="dp-input"]').click()
  await page.locator('[data-test-id="month-toggle-overlay-0"]').click()
  await page.getByText('Dec').click()
  await page.locator('[data-test-id="dp-2025-12-31"]').getByText('31').click()
  await page.locator('[data-test-id="select-button"]').click()
  await page.getByRole('button', { name: 'Create gift exchange' }).click()

  await expect(
    page.locator('div').filter({ hasText: 'Invite your friendsShare your' }).nth(1)
  ).toBeVisible()
})
