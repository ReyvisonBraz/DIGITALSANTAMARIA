import { test, expect } from '@playwright/test';

test.describe('Report Flow', () => {
  test('should load report form', async ({ page }) => {
    await page.goto('/relatar');
    await expect(page.locator('h1')).toContainText('Relatar');
  });

  test('should have title input', async ({ page }) => {
    await page.goto('/relatar');
    const titleInput = page.locator('#report-title');
    await expect(titleInput).toBeVisible();
  });

  test('should have description textarea', async ({ page }) => {
    await page.goto('/relatar');
    const descriptionInput = page.locator('#report-description');
    await expect(descriptionInput).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/relatar');
    
    // Try to submit without filling fields
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      // Check for validation messages
      const titleInput = page.locator('#report-title');
      const isValid = await titleInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(isValid).toBe(false);
    }
  });
});

test.describe('Petition Flow', () => {
  test('should load petitions page', async ({ page }) => {
    await page.goto('/peticoes');
    await expect(page.locator('h1')).toContainText('Petições');
  });

  test('should have create petition button', async ({ page }) => {
    await page.goto('/peticoes');
    const createButton = page.locator('button:has-text("Criar petição")');
    await expect(createButton).toBeVisible();
  });
});

test.describe('Health Module', () => {
  test('should load health page', async ({ page }) => {
    await page.goto('/saude');
    await expect(page.locator('h1')).toContainText('Saúde');
  });

  test('should have schedule appointment button', async ({ page }) => {
    await page.goto('/saude');
    const scheduleButton = page.locator('button:has-text("Agendar Consulta")');
    await expect(scheduleButton).toBeVisible();
  });
});
