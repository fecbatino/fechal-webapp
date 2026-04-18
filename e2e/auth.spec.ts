import { test, expect } from '@playwright/test'

test('Login page is reachable', async ({ page }) => {
  await page.goto('/de/auth/login')
  await expect(page.getByLabel('E-Mail')).toBeVisible()
  await expect(page.getByLabel('Passwort')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Anmelden' })).toBeVisible()
})

test('Register page is reachable', async ({ page }) => {
  await page.goto('/de/auth/register')
  await expect(page.getByLabel('Vollständiger Name')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Konto erstellen' })).toBeVisible()
})

test('Link from login to register works', async ({ page }) => {
  await page.goto('/de/auth/login')
  await page.getByRole('link', { name: 'Registrieren' }).click()
  await expect(page).toHaveURL('/de/auth/register')
})
