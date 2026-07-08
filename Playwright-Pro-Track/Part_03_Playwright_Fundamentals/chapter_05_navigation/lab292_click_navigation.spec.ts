/**
 * Lab 292: Click Navigation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Navigation through clicks:
 * 
 * - Link clicks
 * - Button clicks
 * - Form submissions
 * - Navigation events
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Navigate via link clicks
 * 2. Handle navigation events
 * 3. Wait for navigation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Link Click
test('basic link click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click link to navigate
    await page.getByRole('link', { name: 'Get started' }).click();
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 2: Navigation Link
test('navigation link', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click nav link
    await page.getByRole('link', { name: 'Docs' }).click();
    
    await expect(page).toHaveURL(/.*docs/);
});

// Solution 3: Wait for Navigation
test('wait for navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click and wait for navigation
    await Promise.all([
        page.waitForNavigation(),
        page.getByRole('link', { name: 'Get started' }).click(),
    ]);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 4: Wait for URL
test('wait for URL', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click link
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for specific URL
    await page.waitForURL(/.*intro/);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Click with Navigation Timeout
test('click with navigation timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click and wait with timeout
    await Promise.all([
        page.waitForNavigation({ timeout: 10000 }),
        page.getByRole('link', { name: 'Get started' }).click(),
    ]);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 6: Multiple Navigation Clicks
test('multiple navigation clicks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // First navigation
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
    
    // Second navigation
    await page.getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/.*docs/);
});

// Solution 7: Button Click Navigation
test('button click navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Some buttons trigger navigation
    // await page.getByRole('button', { name: 'Submit' }).click();
    // await expect(page).toHaveURL(/.*success/);
    
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 8: Form Submit Navigation
test('form submit navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Form submission often navigates
    // await page.getByLabel('Email').fill('test@example.com');
    // await page.getByRole('button', { name: 'Submit' }).click();
    // await expect(page).toHaveURL(/.*thank-you/);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Click Opens New Tab
test('click opens new tab', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for new page
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link', { name: 'GitHub' }).click(),
    ]);
    
    // Work with new page
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/github/);
});

// Solution 10: Prevent Navigation
test('prevent navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Intercept navigation
    // await page.route('**/*', route => {
    //     if (route.request().isNavigationRequest()) {
    //         route.abort();
    //     } else {
    //         route.continue();
    //     }
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Navigation Events
test('navigation events', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for navigation
    page.on('framenavigated', frame => {
        console.log('Navigated to:', frame.url());
    });
    
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 12: Click and Verify Content
test('click and verify content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click to navigate
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Verify new page content
    await expect(page).toHaveURL(/.*intro/);
    await expect(page.locator('h1')).toBeVisible();
});

