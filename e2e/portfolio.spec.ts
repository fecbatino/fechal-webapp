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

test.describe('Portfolio Admin page', () => {
  test('admin page redirects unauthenticated user to locale root', async ({ page }) => {
    const response = await page.goto('/de/portfolio/admin')
    // Either redirected (final URL is not /de/portfolio/admin) or shows access denied
    const finalUrl = page.url()
    const isRedirected = !finalUrl.includes('/portfolio/admin')
    const bodyText = await page.locator('body').innerText()
    const showsAccessDenied = bodyText.includes('Kein Zugriff') || bodyText.includes('Access denied')
    expect(isRedirected || showsAccessDenied).toBeTruthy()
  })

  test('admin page in French redirects unauthenticated user', async ({ page }) => {
    await page.goto('/fr/portfolio/admin')
    const finalUrl = page.url()
    const isRedirected = !finalUrl.includes('/portfolio/admin')
    const bodyText = await page.locator('body').innerText()
    const showsAccessDenied = bodyText.includes('Accès refusé') || bodyText.includes('Access denied')
    expect(isRedirected || showsAccessDenied).toBeTruthy()
  })

  test('admin page in English redirects unauthenticated user', async ({ page }) => {
    await page.goto('/en/portfolio/admin')
    const finalUrl = page.url()
    const isRedirected = !finalUrl.includes('/portfolio/admin')
    const bodyText = await page.locator('body').innerText()
    const showsAccessDenied = bodyText.includes('Access denied')
    expect(isRedirected || showsAccessDenied).toBeTruthy()
  })
})
