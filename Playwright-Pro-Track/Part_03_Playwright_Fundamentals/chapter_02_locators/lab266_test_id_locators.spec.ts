/**
 * Lab 266: Test ID Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using test IDs for stable locators:
 * 
 * - getByTestId
 * - Custom test ID attributes
 * - When to use test IDs
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use getByTestId
 * 2. Configure custom attributes
 * 3. Apply best practices
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic getByTestId
test('basic getByTestId', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Default attribute: data-testid
    // <button data-testid="submit-button">Submit</button>
    // const submitButton = page.getByTestId('submit-button');
    
    // Test IDs are stable identifiers added by developers
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
});

// Solution 2: Custom Test ID Attribute
/*
 * Configure in playwright.config.ts:
 * 
 * export default defineConfig({
 *     use: {
 *         testIdAttribute: 'data-test-id',
 *     },
 * });
 * 
 * Common attributes:
 * - data-testid (default)
 * - data-test-id
 * - data-test
 * - data-cy (Cypress convention)
 * - data-qa
 */

test('using test IDs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Example HTML:
    // <div data-testid="hero-section">
    //   <h1 data-testid="hero-title">Welcome</h1>
    //   <button data-testid="cta-button">Get Started</button>
    // </div>
    
    // const heroSection = page.getByTestId('hero-section');
    // const heroTitle = page.getByTestId('hero-title');
    // const ctaButton = page.getByTestId('cta-button');
    
    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
});

// Solution 3: Test ID Patterns
test('test ID naming patterns', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Good naming patterns:
     * 
     * Component-based:
     * - header-logo
     * - nav-menu
     * - footer-links
     * 
     * Feature-based:
     * - login-form
     * - login-email-input
     * - login-submit-button
     * 
     * Action-based:
     * - submit-order-button
     * - cancel-subscription-link
     */
    
    const link = page.getByRole('link', { name: 'Docs' });
    await expect(link).toBeVisible();
});

// Solution 4: Chaining with Test IDs
test('chaining test IDs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Chain test IDs with other locators
    // const form = page.getByTestId('login-form');
    // const emailInput = form.getByRole('textbox', { name: 'Email' });
    // const submitButton = form.getByRole('button', { name: 'Submit' });
    
    const nav = page.getByRole('navigation');
    const links = nav.getByRole('link');
    await expect(links.first()).toBeVisible();
});

// Solution 5: When to Use Test IDs
test('when to use test IDs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Use test IDs when:
     * 1. No semantic role available
     * 2. Text content changes frequently
     * 3. Multiple similar elements exist
     * 4. Element has no accessible name
     * 5. Need stable identifier for CI/CD
     * 
     * Prefer role/text locators when:
     * 1. Element has clear semantic role
     * 2. Text is stable and meaningful
     * 3. Testing accessibility is important
     */
    
    // Prefer this (tests accessibility):
    const goodLocator = page.getByRole('button', { name: 'Search' });
    
    // Use test ID as fallback:
    // const fallbackLocator = page.getByTestId('search-button');
    
    await expect(goodLocator).toBeVisible();
});

// Solution 6: Test IDs in Components
test('test IDs in component libraries', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * React example:
     * <Button data-testid="submit-btn">Submit</Button>
     * 
     * Vue example:
     * <button :data-testid="'submit-btn'">Submit</button>
     * 
     * Angular example:
     * <button [attr.data-testid]="'submit-btn'">Submit</button>
     */
    
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
});

// Solution 7: Dynamic Test IDs
test('dynamic test IDs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * For lists/tables, use dynamic IDs:
     * 
     * {items.map(item => (
     *   <div data-testid={`item-${item.id}`}>
     *     {item.name}
     *   </div>
     * ))}
     * 
     * Access with:
     * page.getByTestId('item-123')
     * page.getByTestId(/^item-/)
     */
    
    const links = page.getByRole('link');
    await expect(links.first()).toBeVisible();
});

// Solution 8: Test ID vs Data Attributes
test('test ID vs other data attributes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Test ID (for testing)
    // page.getByTestId('user-profile');
    
    // Other data attributes (for functionality)
    // page.locator('[data-user-id="123"]');
    // page.locator('[data-status="active"]');
    
    // Combine when needed
    // page.getByTestId('user-row').filter({ has: page.locator('[data-status="active"]') });
    
    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
});

// Solution 9: Removing Test IDs in Production
/*
 * Some teams remove test IDs in production builds:
 * 
 * Babel plugin:
 * babel-plugin-react-remove-properties
 * 
 * Webpack:
 * Use string-replace-loader
 * 
 * Consider keeping them:
 * - Minimal performance impact
 * - Useful for production debugging
 * - Enables production smoke tests
 */

// Solution 10: Best Practices Summary
test('test ID best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Use consistent naming convention
     * 2. Make IDs descriptive
     * 3. Avoid implementation details in names
     * 4. Don't duplicate IDs
     * 5. Prefer role locators when possible
     * 6. Document test ID conventions
     * 7. Review test IDs in code reviews
     */
    
    // Priority order for locators:
    // 1. getByRole (accessibility)
    // 2. getByLabel (forms)
    // 3. getByPlaceholder (inputs)
    // 4. getByText (content)
    // 5. getByTestId (fallback)
    
    const link = page.getByRole('link', { name: 'Get started' });
    await expect(link).toBeVisible();
});

