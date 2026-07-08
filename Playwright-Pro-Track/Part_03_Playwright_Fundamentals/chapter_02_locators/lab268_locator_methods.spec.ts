/**
 * Lab 268: Locator Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Locator manipulation methods:
 * 
 * - first(), last(), nth()
 * - count()
 * - all()
 * - or(), and()
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use position methods
 * 2. Count and iterate
 * 3. Combine locators
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: first(), last(), nth()
test('position methods', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    
    // First element
    const firstLink = links.first();
    await expect(firstLink).toBeVisible();
    
    // Last element
    const lastLink = links.last();
    await expect(lastLink).toBeVisible();
    
    // Nth element (0-indexed)
    const secondLink = links.nth(1);
    await expect(secondLink).toBeVisible();
});

// Solution 2: count()
test('count method', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    const count = await links.count();
    
    console.log(`Found ${count} navigation links`);
    expect(count).toBeGreaterThan(0);
});

// Solution 3: all()
test('all method', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    const allLinks = await links.all();
    
    console.log(`Processing ${allLinks.length} links`);
    
    for (const link of allLinks) {
        const text = await link.textContent();
        console.log('Link text:', text);
    }
});

// Solution 4: or() - Match Either
test('or method', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Match either locator
    const heading = page.locator('h1').or(page.locator('h2'));
    await expect(heading.first()).toBeVisible();
    
    // Useful for elements that might have different selectors
    const button = page.getByRole('button', { name: 'Search' })
        .or(page.getByRole('link', { name: 'Search' }));
    await expect(button).toBeVisible();
});

// Solution 5: and() - Match Both
test('and method', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Element must match both locators
    const visibleHeading = page.locator('h1').and(page.locator(':visible'));
    await expect(visibleHeading).toBeVisible();
    
    // Combine conditions
    const navLink = page.locator('a')
        .and(page.locator('[href*="docs"]'));
    await expect(navLink.first()).toBeVisible();
});

// Solution 6: Iterating with for loop
test('iterating locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const isVisible = await link.isVisible();
        if (isVisible) {
            const text = await link.textContent();
            console.log(`Link ${i}: ${text}`);
        }
    }
});

// Solution 7: evaluateAll()
test('evaluateAll method', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    
    // Execute function on all matching elements
    const hrefs = await links.evaluateAll(elements => 
        elements.map(el => el.getAttribute('href'))
    );
    
    console.log('All hrefs:', hrefs);
    expect(hrefs.length).toBeGreaterThan(0);
});

// Solution 8: Locator Properties
test('locator properties', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Get text content
    const text = await heading.textContent();
    console.log('Text:', text);
    
    // Get inner text
    const innerText = await heading.innerText();
    console.log('Inner text:', innerText);
    
    // Get inner HTML
    const innerHTML = await heading.innerHTML();
    console.log('Inner HTML:', innerHTML);
    
    // Get attribute
    const className = await heading.getAttribute('class');
    console.log('Class:', className);
});

// Solution 9: Locator State Checks
test('locator state checks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Check visibility
    const isVisible = await heading.isVisible();
    console.log('Is visible:', isVisible);
    
    // Check enabled state
    const isEnabled = await heading.isEnabled();
    console.log('Is enabled:', isEnabled);
    
    // Check if editable
    const isEditable = await heading.isEditable();
    console.log('Is editable:', isEditable);
    
    // Check if hidden
    const isHidden = await heading.isHidden();
    console.log('Is hidden:', isHidden);
});

// Solution 10: Combining Methods
test('combining locator methods', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Complex locator combination
    const navLinks = page.locator('nav')
        .locator('a')
        .filter({ hasText: /doc/i })
        .first();
    
    await expect(navLinks).toBeVisible();
    
    // Or with multiple conditions
    const flexibleLocator = page.getByRole('link', { name: 'Docs' })
        .or(page.locator('a').filter({ hasText: 'Docs' }))
        .first();
    
    await expect(flexibleLocator).toBeVisible();
});

