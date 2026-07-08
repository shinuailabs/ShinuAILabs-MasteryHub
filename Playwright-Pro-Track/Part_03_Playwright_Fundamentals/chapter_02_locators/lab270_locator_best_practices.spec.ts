/**
 * Lab 270: Locator Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for locators:
 * 
 * - Locator priority
 * - Stability tips
 * - Performance
 * - Maintainability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply locator best practices
 * 2. Choose appropriate locators
 * 3. Write maintainable selectors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Locator Priority (Recommended Order)
test('locator priority', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Priority Order (most to least preferred):
     * 1. getByRole - Tests accessibility
     * 2. getByLabel - For form inputs
     * 3. getByPlaceholder - For inputs without labels
     * 4. getByText - For static content
     * 5. getByTestId - Stable but not user-facing
     * 6. CSS/XPath - Last resort
     */
    
    // Best: Role-based
    const bestLocator = page.getByRole('link', { name: 'Get started' });
    await expect(bestLocator).toBeVisible();
});

// Solution 2: User-Facing Locators
test('user-facing locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Good: What user sees
    const goodButton = page.getByRole('button', { name: 'Search' });
    
    // Avoid: Implementation details
    // const badButton = page.locator('.btn-primary.search-btn');
    
    await expect(goodButton).toBeVisible();
});

// Solution 3: Stable Selectors
test('stable selectors', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Good: Stable attributes
    // page.getByTestId('submit-button');
    // page.getByRole('button', { name: 'Submit' });
    
    // Avoid: Fragile selectors
    // page.locator('div > div > button:nth-child(2)');
    // page.locator('.mt-4.px-2.bg-blue-500');
    
    const stableLocator = page.getByRole('heading', { level: 1 });
    await expect(stableLocator).toBeVisible();
});

// Solution 4: Specific Locators
test('specific locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Good: Specific and unique
    const specific = page.getByRole('link', { name: 'Docs', exact: true });
    
    // Avoid: Too generic
    // const generic = page.locator('a');
    // const veryGeneric = page.locator('div');
    
    await expect(specific).toBeVisible();
});

// Solution 5: Chaining for Context
test('chaining for context', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Good: Provide context through chaining
    const navLink = page.getByRole('navigation')
        .getByRole('link', { name: 'Docs' });
    
    // This is more specific than just:
    // page.getByRole('link', { name: 'Docs' });
    
    await expect(navLink.first()).toBeVisible();
});

// Solution 6: Avoiding Flaky Locators
test('avoiding flaky locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Flaky locator patterns to avoid:
     * 1. Index-based: nth-child(3)
     * 2. Position-based: first div after header
     * 3. Style-based: .text-red-500
     * 4. Generated IDs: #ember123
     * 5. Deep nesting: div > div > div > span
     */
    
    // Good: Semantic and stable
    const goodLocator = page.getByRole('link', { name: 'Get started' });
    await expect(goodLocator).toBeVisible();
});

// Solution 7: Handling Dynamic Content
test('handling dynamic content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // For dynamic content, use patterns
    // const dynamicItem = page.getByTestId(/^item-/);
    
    // Or filter by stable attributes
    // const activeItem = page.locator('[data-status="active"]');
    
    // Or use text patterns
    const textPattern = page.getByText(/Playwright/i);
    await expect(textPattern.first()).toBeVisible();
});

// Solution 8: Performance Considerations
test('performance considerations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Performance tips:
     * 1. Prefer ID selectors when available
     * 2. Avoid complex XPath
     * 3. Use specific selectors
     * 4. Minimize DOM traversal
     */
    
    // Fast: Direct selector
    const fast = page.locator('h1');
    
    // Slower: Complex traversal
    // const slow = page.locator('body > div > main > section > h1');
    
    await expect(fast).toBeVisible();
});

// Solution 9: Maintainability
test('maintainability', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Maintainability tips:
     * 1. Use Page Object Model
     * 2. Create reusable locator functions
     * 3. Document complex selectors
     * 4. Review locators in code reviews
     */
    
    // Good: Self-documenting
    const searchButton = page.getByRole('button', { name: 'Search' });
    
    // Document if complex
    // Find the submit button in the checkout form
    // const checkoutSubmit = page.locator('#checkout-form button[type="submit"]');
    
    await expect(searchButton).toBeVisible();
});

// Solution 10: Summary Checklist
test('locator checklist', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Locator Checklist:
     * ✓ Uses user-facing attributes
     * ✓ Tests accessibility (role-based)
     * ✓ Specific enough to be unique
     * ✓ Stable across deployments
     * ✓ Not dependent on styling
     * ✓ Not using generated IDs
     * ✓ Readable and maintainable
     * ✓ Documented if complex
     */
    
    // Example of good locator
    const goodLocator = page.getByRole('link', { name: 'Get started' });
    await expect(goodLocator).toBeVisible();
    await goodLocator.click();
    await expect(page).toHaveURL(/.*intro/);
});

