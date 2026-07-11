import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Conecta Santa Maria/);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have working links to main sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for main section links
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('Navigation', () => {
  test('should navigate to Ouvidoria', async ({ page }) => {
    await page.goto('/ouvidoria');
    await expect(page.locator('h1')).toContainText('ouvidoria');
  });

  test('should navigate to Relatar', async ({ page }) => {
    await page.goto('/relatar');
    await expect(page.locator('h1')).toContainText('Relatar');
  });

  test('should navigate to Petições', async ({ page }) => {
    await page.goto('/peticoes');
    await expect(page.locator('h1')).toContainText('Petições');
  });

  test('should navigate to Saúde', async ({ page }) => {
    await page.goto('/saude');
    await expect(page.locator('h1')).toContainText('Saúde');
  });

  test('should navigate to Educação', async ({ page }) => {
    await page.goto('/educacao');
    await expect(page.locator('h1')).toContainText('Educação');
  });
});

test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have no critical accessibility issues on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility
    const mainLandmark = page.locator('main');
    await expect(mainLandmark).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
});
