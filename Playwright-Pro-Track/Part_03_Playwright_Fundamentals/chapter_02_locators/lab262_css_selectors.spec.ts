/**
 * Lab 262: CSS Selectors
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using CSS selectors in Playwright:
 * 
 * - Basic CSS selectors
 * - Attribute selectors
 * - Pseudo-classes
 * - Combinators
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use various CSS selectors
 * 2. Combine selectors
 * 3. Use pseudo-classes
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic CSS Selectors
test('basic CSS selectors', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // By tag name
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // By class
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    
    // By ID
    // const element = page.locator('#unique-id');
    
    // By tag and class
    const navLinks = page.locator('nav.navbar');
    await expect(navLinks).toBeVisible();
});

// Solution 2: Attribute Selectors
test('attribute selectors', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Has attribute
    const linksWithHref = page.locator('a[href]');
    await expect(linksWithHref.first()).toBeVisible();
    
    // Exact match
    const homeLink = page.locator('a[href="/"]');
    
    // Contains
    const docsLinks = page.locator('a[href*="docs"]');
    
    // Starts with
    const externalLinks = page.locator('a[href^="https"]');
    
    // Ends with
    const pdfLinks = page.locator('a[href$=".pdf"]');
});

// Solution 3: Combinators
test('CSS combinators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Descendant (space)
    const navLinks = page.locator('nav a');
    await expect(navLinks.first()).toBeVisible();
    
    // Child (>)
    const directChildren = page.locator('nav > div');
    
    // Adjacent sibling (+)
    // const adjacent = page.locator('h1 + p');
    
    // General sibling (~)
    // const siblings = page.locator('h1 ~ p');
});

// Solution 4: Pseudo-Classes
test('pseudo-classes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // First child
    const firstLink = page.locator('nav a:first-child');
    
    // Last child
    const lastLink = page.locator('nav a:last-child');
    
    // Nth child
    const secondLink = page.locator('nav a:nth-child(2)');
    
    // Not
    const notFirst = page.locator('nav a:not(:first-child)');
    
    await expect(firstLink.or(page.locator('nav a').first())).toBeVisible();
});

// Solution 5: Multiple Classes
test('multiple classes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Element with multiple classes
    const element = page.locator('.navbar.navbar--fixed-top');
    
    // Any of the classes
    const anyClass = page.locator('.navbar, .footer');
    
    await expect(element.or(page.locator('.navbar'))).toBeVisible();
});

// Solution 6: Text-Based CSS (Playwright Extension)
test('text-based CSS', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Playwright extends CSS with text selector
    const getStarted = page.locator('a:has-text("Get started")');
    await expect(getStarted).toBeVisible();
    
    // Exact text match
    const exactMatch = page.locator('a:text("Docs")');
    
    // Case insensitive
    const caseInsensitive = page.locator('a:text-is("docs")');
});

// Solution 7: Has Selector (Playwright Extension)
test('has selector', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Parent that contains specific child
    const navWithLinks = page.locator('nav:has(a)');
    await expect(navWithLinks).toBeVisible();
    
    // Div containing specific text
    const divWithText = page.locator('div:has-text("Playwright")');
    await expect(divWithText.first()).toBeVisible();
});

// Solution 8: Visible Selector
test('visible selector', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Only visible elements
    const visibleLinks = page.locator('a:visible');
    const count = await visibleLinks.count();
    
    console.log(`Visible links: ${count}`);
    expect(count).toBeGreaterThan(0);
});

// Solution 9: Complex Selectors
test('complex CSS selectors', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Combining multiple conditions
    const complexSelector = page.locator(
        'nav.navbar a[href*="docs"]:visible'
    );
    
    // Multiple selectors (OR)
    const multipleSelectors = page.locator('h1, h2, h3');
    
    await expect(multipleSelectors.first()).toBeVisible();
});

// Solution 10: CSS Selector Best Practices
test('CSS selector best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Good: Specific and stable
    const goodSelector = page.locator('[data-testid="hero-title"]');
    
    // Good: Semantic
    const semanticSelector = page.locator('nav a[href="/docs"]');
    
    // Avoid: Too generic
    // const badSelector = page.locator('div > div > span');
    
    // Avoid: Dependent on styling
    // const stylingDependent = page.locator('.mt-4.px-2');
    
    // Prefer role-based locators over CSS
    const roleBasedLocator = page.getByRole('link', { name: 'Docs' });
    await expect(roleBasedLocator).toBeVisible();
});

