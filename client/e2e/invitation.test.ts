import { login } from './utils/auth'
import { expect, test } from '@playwright/test'



test.describe('creating invitations', () => {
  // Common setup function
  async function setupGiftExchange(page) {
    await login(page)

    // Navigation
    await page.getByRole('link', { name: 'Gift Exchange' }).first().click()
    await expect(page).toHaveURL('http://localhost:5173/gift-exchanges')

    // Fill in the form
    await page.getByRole('textbox', { name: 'Title' }).fill('Test')
    await page.getByRole('textbox', { name: 'Enter a description*' }).fill('test')
    await page.getByRole('spinbutton', { name: 'Budget*' }).fill('100')

    // Date selection
    await page.locator('[data-test-id="dp-input"]').click()
    await page.locator('[data-test-id="month-toggle-overlay-0"]').click()
    await page.getByText('Dec').click()
    await page.locator('[data-test-id="dp-2025-12-31"]').click()
    await page.locator('[data-test-id="select-button"]').click()

    // Create exchange
    await page.getByRole('button', { name: 'Create gift exchange' }).click()
  }

  async function waitForRadioButton(page, buttonName) {
    await expect(page.getByRole('radio', { name: buttonName })).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByRole('radio', { name: buttonName })).toBeEnabled({
      timeout: 10000,
    })
  }

  async function waitForSendInvitationsButton(page) {
    await expect(page.getByRole('button', { name: 'Send Invitations' })).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByRole('button', { name: 'Send Invitations' })).toBeEnabled({
      timeout: 10000,
    })
  }

  test('failed invitations with 2 guests participating', async ({ page }) => {
    test.setTimeout(30000)
    await setupGiftExchange(page)

    // Select role and add participants
    await waitForRadioButton(page, 'I am just organising')
    await page.getByRole('radio', { name: 'I am just organising' }).check()

    // Add first participant
    await expect(page.getByPlaceholder("Friend's 1 email ")).toBeVisible({ timeout: 10000 })
    await page.getByPlaceholder("Friend's 1 email ").fill('test@teslandija.lt')
    await page.getByRole('button', { name: 'Add Person' }).click()

    // Add second participant
    await expect(page.getByRole('textbox', { name: "Friend's 2 email" })).toBeVisible({
      timeout: 10000,
    })
    await page.getByRole('textbox', { name: "Friend's 2 email" }).fill('test2@testlandija.lt')

    // Send invitations
    await waitForSendInvitationsButton(page)
    await page.getByRole('button', { name: 'Send Invitations' }).click()

    // Check for error message
    await expect(page.getByText('At least 3 participants with')).toBeVisible({ timeout: 10000 })
  })

  test('failed invitations with creator and 1 guest participating', async ({ page }) => {
    test.setTimeout(30000)
    await setupGiftExchange(page)

    // Select participation and add participant
    await waitForRadioButton(page, 'I am participating')
    await page.getByRole('radio', { name: 'I am participating' }).check()

    // Add participant
    await expect(page.getByPlaceholder("Friend's 1 email ")).toBeVisible({ timeout: 10000 })
    await page.getByPlaceholder("Friend's 1 email ").fill('test@teslandija.lt')

    // Send invitations
    await waitForSendInvitationsButton(page)
    await page.getByRole('button', { name: 'Send Invitations' }).click()

    // Check for error message
    await expect(page.getByText('At least 2 other participants')).toBeVisible({ timeout: 10000 })
  })
})
