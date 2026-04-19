import { test, expect } from '@playwright/test'

test.describe('Portfolio page', () => {
  test('portfolio page is reachable in German', async ({ page }) => {
    const response = await page.goto('/de/portfolio')
    expect(response?.status()).not.toBe(404)
  })

  test('portfolio page loads without crashing', async ({ page }) => {
    await page.goto('/de/portfolio')
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
  })

  test('portfolio page shows a heading', async ({ page }) => {
    await page.goto('/de/portfolio')
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
  })

  test('portfolio page in French is reachable', async ({ page }) => {
    const response = await page.goto('/fr/portfolio')
    expect(response?.status()).not.toBe(404)
  })

  test('portfolio page in English is reachable', async ({ page }) => {
    const response = await page.goto('/en/portfolio')
    expect(response?.status()).not.toBe(404)
  })
})
