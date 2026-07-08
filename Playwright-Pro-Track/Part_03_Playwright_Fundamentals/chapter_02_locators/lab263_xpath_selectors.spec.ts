/**
 * Lab 263: XPath Selectors
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using XPath selectors in Playwright:
 * 
 * - XPath basics
 * - Axes navigation
 * - Functions
 * - When to use XPath
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use XPath selectors
 * 2. Navigate with axes
 * 3. Use XPath functions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic XPath
test('basic XPath selectors', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Absolute path (not recommended)
    // const absolute = page.locator('xpath=/html/body/div/h1');
    
    // Relative path (recommended)
    const heading = page.locator('xpath=//h1');
    await expect(heading).toBeVisible();
    
    // By tag name
    const links = page.locator('xpath=//a');
    await expect(links.first()).toBeVisible();
});

// Solution 2: XPath with Attributes
test('XPath with attributes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // By attribute
    const linksWithHref = page.locator('xpath=//a[@href]');
    await expect(linksWithHref.first()).toBeVisible();
    
    // By specific attribute value
    const homeLink = page.locator('xpath=//a[@href="/"]');
    
    // By class
    const navbar = page.locator('xpath=//nav[contains(@class, "navbar")]');
    await expect(navbar).toBeVisible();
    
    // Multiple attributes
    const specific = page.locator('xpath=//a[@href and @class]');
});

// Solution 3: XPath Text Functions
test('XPath text functions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exact text match
    const exactText = page.locator('xpath=//a[text()="Docs"]');
    
    // Contains text
    const containsText = page.locator('xpath=//a[contains(text(), "Doc")]');
    
    // Contains in any descendant
    const descendantText = page.locator(
        'xpath=//div[contains(., "Playwright")]'
    );
    await expect(descendantText.first()).toBeVisible();
});

// Solution 4: XPath Axes
test('XPath axes navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Parent
    const parent = page.locator('xpath=//a/parent::*');
    
    // Ancestor
    const ancestor = page.locator('xpath=//a/ancestor::nav');
    
    // Child
    const children = page.locator('xpath=//nav/child::*');
    
    // Descendant
    const descendants = page.locator('xpath=//nav/descendant::a');
    
    // Following sibling
    const followingSibling = page.locator(
        'xpath=//h1/following-sibling::*'
    );
    
    // Preceding sibling
    const precedingSibling = page.locator(
        'xpath=//h2/preceding-sibling::*'
    );
    
    await expect(descendants.first()).toBeVisible();
});

// Solution 5: XPath Predicates
test('XPath predicates', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // First element
    const first = page.locator('xpath=(//a)[1]');
    await expect(first).toBeVisible();
    
    // Last element
    const last = page.locator('xpath=(//a)[last()]');
    
    // Position
    const second = page.locator('xpath=(//a)[2]');
    
    // Position range
    const firstThree = page.locator('xpath=(//a)[position() <= 3]');
});

// Solution 6: XPath Functions
test('XPath functions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // starts-with
    const startsWithHttp = page.locator(
        'xpath=//a[starts-with(@href, "http")]'
    );
    
    // contains
    const containsDocs = page.locator(
        'xpath=//a[contains(@href, "docs")]'
    );
    
    // normalize-space
    const normalizedText = page.locator(
        'xpath=//a[normalize-space(text())="Docs"]'
    );
    
    // not
    const notExternal = page.locator(
        'xpath=//a[not(starts-with(@href, "http"))]'
    );
    
    await expect(startsWithHttp.first()).toBeVisible();
});

// Solution 7: XPath OR and AND
test('XPath logical operators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // OR
    const h1OrH2 = page.locator('xpath=//h1 | //h2');
    await expect(h1OrH2.first()).toBeVisible();
    
    // AND (in predicate)
    const andCondition = page.locator(
        'xpath=//a[@href and contains(@class, "nav")]'
    );
});

// Solution 8: XPath with Index
test('XPath indexing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Note: XPath indices are 1-based
    const firstLink = page.locator('xpath=(//nav//a)[1]');
    const secondLink = page.locator('xpath=(//nav//a)[2]');
    
    await expect(firstLink).toBeVisible();
});

// Solution 9: Complex XPath
test('complex XPath', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Find link in nav that contains specific text
    const complexXPath = page.locator(
        'xpath=//nav//a[contains(text(), "Doc") and @href]'
    );
    
    // Find parent of element with specific text
    const parentOfText = page.locator(
        'xpath=//*[contains(text(), "Playwright")]/ancestor::div[1]'
    );
    
    await expect(parentOfText.first()).toBeVisible();
});

// Solution 10: When to Use XPath
test('XPath best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Use XPath when:
     * - Need to traverse up the DOM (parent/ancestor)
     * - Complex text matching needed
     * - Need sibling navigation
     * 
     * Prefer CSS/Role locators when:
     * - Simple element selection
     * - Better readability needed
     * - Performance is critical
     */
    
    // Good use case: Find parent of text
    const parentNav = page.locator(
        'xpath=//a[contains(text(), "Docs")]/ancestor::nav'
    );
    
    // Better alternative for simple cases
    const roleLocator = page.getByRole('link', { name: 'Docs' });
    
    await expect(roleLocator).toBeVisible();
});

