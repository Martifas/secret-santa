import { login } from './utils/auth'
import { expect, test } from '@playwright/test'

test('creating and deleting an exchange event', async ({ page }) => {
  // Increase the test timeout
  test.setTimeout(30000)

  await login(page)
  await page.getByRole('link', { name: 'Gift Exchange' }).first().click()
  await expect(page).toHaveURL('http://localhost:5173/gift-exchanges')

  // Fill the event form
  await page.getByRole('textbox', { name: 'Title' }).click()
  await page.getByRole('textbox', { name: 'Title' }).fill('Test')
  await page.getByRole('textbox', { name: 'Enter a description*' }).click()
  await page.getByRole('textbox', { name: 'Enter a description*' }).fill('test')
  await page.getByRole('textbox', { name: 'Enter a description*' }).press('Tab')
  await page.getByRole('spinbutton', { name: 'Budget*' }).fill('100')
  await page.getByRole('spinbutton', { name: 'Budget*' }).press('Tab')
  await page.locator('[data-test-id="dp-input"]').click()
  await page.locator('[data-test-id="month-toggle-overlay-0"]').click()
  await page.getByText('Dec').click()
  await page.locator('[data-test-id="dp-2025-12-31"]').getByText('31').click()
  await page.locator('[data-test-id="select-button"]').click()
  await page.getByRole('button', { name: 'Create gift exchange' }).click()

  // Wait for navigation and radio button to be visible and enabled
  await expect(page.getByRole('radio', { name: 'I am participating' })).toBeVisible({
    timeout: 10000,
  })
  await expect(page.getByRole('radio', { name: 'I am participating' })).toBeEnabled({
    timeout: 10000,
  })

  // Fill event invitation
  await page.getByRole('radio', { name: 'I am participating' }).check()
  await page.getByPlaceholder("Friend's 1 email ").click()
  await page.getByPlaceholder("Friend's 1 email ").fill('test@testlandija.lt')
  await expect(page.getByRole('button', { name: 'Add Person' })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'Add Person' }).click()
  await page.getByRole('textbox', { name: "Friend's 2 email" }).click()
  await page.getByRole('textbox', { name: "Friend's 2 email" }).fill('test@testlandija2.lt')
  await page.getByRole('button', { name: 'Send Invitations' }).click()

  // Wait for navigation after sending invitations
  await page.waitForLoadState('networkidle', { timeout: 10000 })

  // Delete event
  await expect(page.getByRole('button', { name: 'Delete Event' })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'Delete Event' }).click()
  await page.getByText('Delete Event Are you sure you').click()
  await expect(page.getByRole('button', { name: 'Delete', exact: true })).toBeVisible({
    timeout: 10000,
  })
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page).toHaveURL('http://localhost:5173/dashboard')
})
