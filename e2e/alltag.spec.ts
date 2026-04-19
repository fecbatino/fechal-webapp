import { test, expect } from '@playwright/test'

test('Unauthenticated user is redirected from /alltag to login', async ({ page }) => {
  await page.goto('/de/alltag')
  await expect(page).toHaveURL(/\/auth\/login/)
})

test('Unauthenticated user is redirected from /alltag/familie/mitglieder to login', async ({ page }) => {
  await page.goto('/de/alltag/familie/mitglieder')
  await expect(page).toHaveURL(/\/auth\/login/)
})

test('Alltag login page is accessible', async ({ page }) => {
  await page.goto('/de/auth/login')
  await expect(page.getByLabel(/e-mail/i)).toBeVisible()
})
