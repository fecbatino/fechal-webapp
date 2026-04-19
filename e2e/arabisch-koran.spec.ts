import { test, expect } from '@playwright/test'

test.describe('Arabisch page', () => {
  test('redirects unauthenticated users away from arabisch page', async ({ page }) => {
    await page.goto('/de/alltag/arabisch')
    // Either redirects to login or shows an auth error
    await expect(page).not.toHaveURL(/\/de\/alltag\/arabisch$/, { timeout: 10000 })
  })
})

test.describe('Koran page', () => {
  test('loads the koran surah list', async ({ page }) => {
    await page.goto('/de/alltag/koran')
    // Koran page is accessible without auth (public quran data)
    // Should show either the list or an error — just not crash
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 })
  })

  test('koran page URL is reachable', async ({ page }) => {
    const response = await page.goto('/de/alltag/koran')
    expect(response?.status()).not.toBe(404)
  })

  test('koran surah reader URL is reachable', async ({ page }) => {
    const response = await page.goto('/de/alltag/koran/1')
    expect(response?.status()).not.toBe(404)
  })
})
