import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
    test('should navigate to signup page', async ({ page }) => {
        await page.goto('/')
        await page.click('text=Sign up')
        await expect(page).toHaveURL('/signup')
    })

    test('should show login page', async ({ page }) => {
        await page.goto('/login')
        await expect(page.locator('h2')).toContainText('Welcome back')
    })
})
