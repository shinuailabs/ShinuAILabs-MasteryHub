/**
 * Lab 930: AI Accessibility Test Generation
 *
 * CONCEPT:
 * AI can generate accessibility tests based on WCAG guidelines, ensuring your
 * application is usable by people with disabilities. This includes keyboard
 * navigation, screen reader support, and visual accessibility.
 *
 * BULLET POINTS:
 * - Generate WCAG compliance tests
 * - Test keyboard navigation
 * - Verify ARIA attributes
 * - Check color contrast
 * - Test screen reader compatibility
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Example 1: AI-generated accessibility tests
test.describe('Accessibility Tests - AI Generated', () => {
  test('should have no accessibility violations on home page', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have no violations on login form', async ({ page }) => {
    await page.goto('/login');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-testid="login-form"]')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

// Example 2: Keyboard navigation tests
test.describe('Keyboard Navigation', () => {
  test('should navigate form with Tab key', async ({ page }) => {
    await page.goto('/login');

    // Focus should start on first input
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused();

    // Tab to password
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="password-input"]')).toBeFocused();

    // Tab to submit button
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="submit-button"]')).toBeFocused();

    // Enter should submit form
    await page.keyboard.press('Enter');
  });

  test('should navigate menu with arrow keys', async ({ page }) => {
    await page.goto('/');

    // Open menu
    await page.click('[data-testid="menu-button"]');

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('[data-testid="menu-item-1"]')).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(page.locator('[data-testid="menu-item-2"]')).toBeFocused();

    // Escape should close menu
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="menu"]')).not.toBeVisible();
  });

  test('should trap focus in modal', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="open-modal"]');

    // Tab through modal elements
    const modalElements = ['modal-title', 'modal-input', 'modal-cancel', 'modal-confirm'];

    for (const element of modalElements) {
      await page.keyboard.press('Tab');
      // Focus should stay within modal
      const focused = await page.evaluate(() => document.activeElement?.closest('[data-testid="modal"]'));
      expect(focused).not.toBeNull();
    }
  });
});

// Example 3: ARIA attribute tests
test.describe('ARIA Attributes', () => {
  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/register');

    const inputs = page.locator('input:not([type="hidden"])');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Input should have label, aria-label, or aria-labelledby
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/');

    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      // Button should have text, aria-label, or title
      expect(text?.trim() || ariaLabel || title).toBeTruthy();
    }
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');

      // Image should have alt text or role="presentation"
      expect(alt !== null || role === 'presentation').toBeTruthy();
    }
  });
});

/**
 * EXERCISE:
 * 1. Run axe accessibility scan on your app
 * 2. Generate keyboard navigation tests
 * 3. Verify ARIA attributes
 * 4. Fix any violations found
 *
 * LEARNING:
 * - Accessibility testing ensures inclusive design
 * - Use axe-core for automated scanning
 * - Test keyboard navigation manually
 * - Verify ARIA attributes are correct
 *
 * ONE LINER:
 * "AI helps ensure your app is accessible to everyone - not just some users."
 */

