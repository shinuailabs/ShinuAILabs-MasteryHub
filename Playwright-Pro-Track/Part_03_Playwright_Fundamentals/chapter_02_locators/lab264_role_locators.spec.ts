/**
 * Lab 264: Role-Based Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using getByRole for accessible locators:
 * 
 * - ARIA roles
 * - Role options
 * - Accessibility benefits
 * - Common roles
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use getByRole locators
 * 2. Understand ARIA roles
 * 3. Use role options
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Role Locators
test('basic role locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Button role
    const button = page.getByRole('button', { name: 'Search' });
    
    // Link role
    const link = page.getByRole('link', { name: 'Get started' });
    await expect(link).toBeVisible();
    
    // Heading role
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
});

// Solution 2: Common ARIA Roles
test('common ARIA roles', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Navigation
    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
    
    // Main content
    const main = page.getByRole('main');
    
    // Banner (header)
    const banner = page.getByRole('banner');
    
    // Contentinfo (footer)
    const footer = page.getByRole('contentinfo');
    
    // List
    const list = page.getByRole('list');
    
    // Listitem
    const listItem = page.getByRole('listitem');
});

// Solution 3: Role with Name Option
test('role with name option', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exact name match
    const exactLink = page.getByRole('link', { name: 'Docs' });
    
    // Partial name match (regex)
    const partialLink = page.getByRole('link', { name: /get started/i });
    await expect(partialLink).toBeVisible();
    
    // Name from aria-label
    // <button aria-label="Close">X</button>
    // page.getByRole('button', { name: 'Close' });
});

// Solution 4: Heading Levels
test('heading levels', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Specific heading level
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    
    // Any heading
    const anyHeading = page.getByRole('heading');
    const count = await anyHeading.count();
    console.log(`Found ${count} headings`);
});

// Solution 5: Form Roles
test('form roles', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Textbox (input type="text", textarea)
    // const textbox = page.getByRole('textbox');
    
    // Checkbox
    // const checkbox = page.getByRole('checkbox', { name: 'Accept terms' });
    
    // Radio
    // const radio = page.getByRole('radio', { name: 'Option 1' });
    
    // Combobox (select, autocomplete)
    // const combobox = page.getByRole('combobox');
    
    // Spinbutton (input type="number")
    // const spinbutton = page.getByRole('spinbutton');
    
    // Slider (input type="range")
    // const slider = page.getByRole('slider');
    
    // Search button example
    const searchButton = page.getByRole('button', { name: 'Search' });
});

// Solution 6: State Options
test('role state options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Pressed state
    // const pressedButton = page.getByRole('button', { pressed: true });
    
    // Checked state
    // const checkedBox = page.getByRole('checkbox', { checked: true });
    
    // Expanded state
    // const expandedMenu = page.getByRole('button', { expanded: true });
    
    // Selected state
    // const selectedTab = page.getByRole('tab', { selected: true });
    
    // Disabled state
    // const disabledButton = page.getByRole('button', { disabled: true });
    
    const link = page.getByRole('link', { name: 'Docs' });
    await expect(link).toBeVisible();
});

// Solution 7: Table Roles
test('table roles', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Table
    // const table = page.getByRole('table');
    
    // Row
    // const row = page.getByRole('row');
    
    // Cell
    // const cell = page.getByRole('cell');
    
    // Column header
    // const header = page.getByRole('columnheader');
    
    // Row header
    // const rowHeader = page.getByRole('rowheader');
    
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
});

// Solution 8: Dialog and Alert Roles
test('dialog and alert roles', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Dialog (modal)
    // const dialog = page.getByRole('dialog');
    
    // Alert dialog
    // const alertDialog = page.getByRole('alertdialog');
    
    // Alert
    // const alert = page.getByRole('alert');
    
    // Status
    // const status = page.getByRole('status');
    
    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
});

// Solution 9: Exact vs Partial Match
test('exact vs partial name match', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exact match (default)
    const exact = page.getByRole('link', { name: 'Docs', exact: true });
    
    // Partial match
    const partial = page.getByRole('link', { name: 'Doc', exact: false });
    
    // Regex for flexible matching
    const regex = page.getByRole('link', { name: /docs/i });
    
    await expect(exact).toBeVisible();
});

// Solution 10: Why Use Role Locators
test('benefits of role locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Benefits:
     * 1. Resilient to DOM changes
     * 2. Tests accessibility
     * 3. User-centric approach
     * 4. Self-documenting
     * 5. Works across frameworks
     */
    
    // Good: Role-based
    const goodLocator = page.getByRole('link', { name: 'Get started' });
    
    // Avoid: CSS-based
    // const badLocator = page.locator('.hero__button');
    
    await expect(goodLocator).toBeVisible();
    await goodLocator.click();
    await expect(page).toHaveURL(/.*intro/);
});

