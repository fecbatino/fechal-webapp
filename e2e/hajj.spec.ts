import { test, expect } from '@playwright/test'

test.describe('Hajj & Umrah page', () => {
  test('hajj page is reachable in German', async ({ page }) => {
    const response = await page.goto('/de/hajj-umrah')
    expect(response?.status()).not.toBe(404)
  })

  test('hajj page is reachable in French', async ({ page }) => {
    const response = await page.goto('/fr/hajj-umrah')
    expect(response?.status()).not.toBe(404)
  })

  test('hajj page is reachable in English', async ({ page }) => {
    const response = await page.goto('/en/hajj-umrah')
    expect(response?.status()).not.toBe(404)
  })

  test('hajj page shows h1 heading', async ({ page }) => {
    await page.goto('/de/hajj-umrah')
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
  })

  test('hajj page shows checklist checkboxes', async ({ page }) => {
    await page.goto('/de/hajj-umrah')
    // Komponente nutzt <button role="checkbox">, kein <input>
    await expect(page.locator('[data-testid^="checklist-item-"]').first()).toBeVisible({ timeout: 10000 })
  })
})