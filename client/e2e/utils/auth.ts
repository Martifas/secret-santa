import { Page, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const email = process.env.VITE_TESTING_EMAIL as string
const password = process.env.VITE_TESTING_PASSWORD as string

export async function login(page: Page) {
  await page.goto('http://localhost:5173/')
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.getByRole('textbox', { name: 'Email address' }).click()
  await page.getByRole('textbox', { name: 'Email address' }).fill(email)
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab')
  await page.getByRole('textbox', { name: 'Password' }).fill(password)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()

  await expect(page).toHaveURL('http://localhost:5173/')
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open user menu' }).click()
  await expect(page.getByRole('menuitem', { name: 'Sign out' })).toBeVisible()
  await page.getByRole('menuitem', { name: 'Sign out' }).click()
}
