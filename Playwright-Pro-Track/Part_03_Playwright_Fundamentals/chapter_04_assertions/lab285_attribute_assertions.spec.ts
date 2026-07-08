/**
 * Lab 285: Attribute Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Asserting element attributes:
 * 
 * - toHaveAttribute
 * - toHaveClass
 * - toHaveId
 * - CSS properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert attributes
 * 2. Assert classes
 * 3. Assert CSS properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: toHaveAttribute - Exists
test('toHaveAttribute exists', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    
    // Check attribute exists
    await expect(link).toHaveAttribute('href');
});

// Solution 2: toHaveAttribute - Value
test('toHaveAttribute value', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    
    // Check attribute value
    await expect(link).toHaveAttribute('href', '/docs/intro');
});

// Solution 3: toHaveAttribute - Regex
test('toHaveAttribute regex', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    
    // Regex match
    await expect(link).toHaveAttribute('href', /docs/);
});

// Solution 4: toHaveClass - Single Class
test('toHaveClass single', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const nav = page.locator('nav');
    
    // Check has class
    await expect(nav).toHaveClass(/navbar/);
});

// Solution 5: toHaveClass - Multiple Classes
test('toHaveClass multiple', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const nav = page.locator('nav');
    
    // Check multiple classes (all must be present)
    await expect(nav).toHaveClass(/navbar.*navbar--fixed-top/);
});

// Solution 6: toHaveClass - Exact Match
test('toHaveClass exact', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exact class string match
    // await expect(element).toHaveClass('btn btn-primary');
    
    const nav = page.locator('nav');
    await expect(nav).toHaveClass(/navbar/);
});

// Solution 7: toHaveId
test('toHaveId', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check element ID
    // const element = page.locator('#my-element');
    // await expect(element).toHaveId('my-element');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 8: toHaveCSS
test('toHaveCSS', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Check CSS property
    await expect(heading).toHaveCSS('display', 'block');
    
    // Check color (computed value)
    // await expect(heading).toHaveCSS('color', 'rgb(0, 0, 0)');
});

// Solution 9: Data Attributes
test('data attributes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check data attributes
    // await expect(element).toHaveAttribute('data-testid', 'submit-btn');
    // await expect(element).toHaveAttribute('data-status', 'active');
    
    const link = page.getByRole('link', { name: 'Docs' });
    await expect(link).toHaveAttribute('href');
});

// Solution 10: ARIA Attributes
test('ARIA attributes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check ARIA attributes
    // await expect(button).toHaveAttribute('aria-label', 'Close');
    // await expect(menu).toHaveAttribute('aria-expanded', 'true');
    // await expect(input).toHaveAttribute('aria-invalid', 'false');
    
    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
});

// Solution 11: Boolean Attributes
test('boolean attributes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Boolean attributes (disabled, readonly, required)
    // await expect(input).toHaveAttribute('disabled', '');
    // await expect(input).toHaveAttribute('required', '');
    
    // Or check state
    // await expect(input).toBeDisabled();
    
    const link = page.getByRole('link', { name: 'Get started' });
    await expect(link).toBeEnabled();
});

// Solution 12: Negative Attribute Assertions
test('negative attribute assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    
    // Assert attribute NOT present or NOT equal
    await expect(link).not.toHaveAttribute('disabled');
    await expect(link).not.toHaveClass(/hidden/);
});

// Solution 13: Multiple Attribute Checks
test('multiple attribute checks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    
    // Check multiple attributes
    await expect(link).toHaveAttribute('href', /docs/);
    await expect(link).not.toHaveAttribute('target', '_blank');
});

