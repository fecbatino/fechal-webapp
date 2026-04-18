import { test, expect } from '@playwright/test'

test('Startseite redirects to a locale and shows section cards', async ({ page }) => {
  await page.goto('/de')
  await expect(page).toHaveURL(/\/de/)
  await expect(page.getByText('Alltag').first()).toBeVisible()
  await expect(page.getByText('Portfolio').first()).toBeVisible()
  await expect(page.getByText('Hajj & Umrah').first()).toBeVisible()
  await expect(page.getByText('Vereine').first()).toBeVisible()
})

test('Language switcher changes to French', async ({ page }) => {
  await page.goto('/de')
  await page.getByRole('button', { name: 'FR' }).click()
  await expect(page).toHaveURL(/\/fr/)
  await expect(page.getByText('Accueil')).toBeVisible()
})

test('About section is visible on homepage', async ({ page }) => {
  await page.goto('/de')
  await expect(page.getByText('Über mich')).toBeVisible()
})
