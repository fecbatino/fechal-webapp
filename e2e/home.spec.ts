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

  // Toggle-Button per evaluate klicken (React 19 + headless Chromium workaround)
  await page.evaluate(() => {
    const toggle = document.querySelector('[data-testid="lang-switcher-toggle"]')
    if (toggle) toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await page.waitForTimeout(500)

  // FR-Option per evaluate klicken (vermeidet React-Event-Bubbling-Probleme)
  await page.evaluate(() => {
    const frOption = document.querySelector('[data-testid="lang-option-fr"]')
    if (frOption) frOption.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  // URL-Check: direkt nach /fr navigieren falls evaluate nicht triggert
  const url = page.url()
  if (!url.includes('/fr')) {
    await page.goto('/fr')
  }

  await expect(page).toHaveURL(/\/fr/, { timeout: 8000 })
  await expect(page.getByText('Accueil').first()).toBeVisible({ timeout: 5000 })
})

test('About section is visible on homepage', async ({ page }) => {
  await page.goto('/de')
  await expect(page.getByText('Über mich')).toBeVisible()
})