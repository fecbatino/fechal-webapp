import { test, expect } from '@playwright/test'

test('Login page is reachable', async ({ page }) => {
  await page.goto('/de/auth/login')
  // Use element selectors instead of getByLabel for React 19 hydration reliability
  const emailInput = page.locator('#email')
  const passwordInput = page.locator('#password')
  const submitButton = page.locator('button[type="submit"]')
  await expect(emailInput).toBeVisible({ timeout: 10000 })
  await expect(passwordInput).toBeVisible({ timeout: 10000 })
  await expect(submitButton).toBeVisible({ timeout: 10000 })
})

test('Register page is reachable', async ({ page }) => {
  await page.goto('/de/auth/register')
  await expect(page.getByLabel('Vollständiger Name')).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('button', { name: 'Konto erstellen' })).toBeVisible({ timeout: 10000 })
})

test('Link from login to register works', async ({ page }) => {
  await page.goto('/de/auth/login')
  await page.getByRole('link', { name: 'Registrieren' }).click()
  await expect(page).toHaveURL('/de/auth/register')
})