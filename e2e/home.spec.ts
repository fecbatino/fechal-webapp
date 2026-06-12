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
  // Toggle-Button via data-testid öffnen (stabiler als text-basierte Selectoren)
  await page.locator('[data-testid="lang-switcher-toggle"]').click()
  // Auf Dropdown-Render warten
  await page.locator('[data-testid="lang-option-fr"]').waitFor({ state: 'visible', timeout: 5000 })
  // FR-Option klicken
  await page.locator('[data-testid="lang-option-fr"]').click()
  // URL-Prüfung – router.replace wechselt die Locale
  await expect(page).toHaveURL(/\/fr/, { timeout: 8000 })
  await expect(page.getByText('Accueil')).toBeVisible()
})

test('About section is visible on homepage', async ({ page }) => {
  await page.goto('/de')
  await expect(page.getByText('Über mich')).toBeVisible()
})
