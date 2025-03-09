import { expect, test } from '@playwright/test';

test.describe('Visual testing', () => {
  test.describe('Static pages', () => {
    test('should take screenshot of the homepage', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveTitle(/Landing Page/);
    });

    test('should take screenshot of the French homepage', async ({ page }) => {
      await page.goto('/zh');

      await expect(page).toHaveTitle(/Landing Page/);
    });
  });
});
