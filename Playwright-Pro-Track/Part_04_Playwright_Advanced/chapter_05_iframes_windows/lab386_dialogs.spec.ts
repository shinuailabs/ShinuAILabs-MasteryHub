/**
 * Lab 386: Dialogs
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling browser dialogs:
 * 
 * - Alert
 * - Confirm
 * - Prompt
 * - beforeunload
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle alert dialogs
 * 2. Handle confirm dialogs
 * 3. Handle prompt dialogs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Handle Alert
test('handle alert', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Handle alert dialog
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('Alert message');
        await dialog.accept();
    });
    
    // Trigger alert
    // await page.click('button.show-alert');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Handle Confirm - Accept
test('handle confirm accept', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Accept confirm dialog
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        await dialog.accept();
    });
    
    // Trigger confirm
    // await page.click('button.show-confirm');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Handle Confirm - Dismiss
test('handle confirm dismiss', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Dismiss confirm dialog
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        await dialog.dismiss();
    });
    
    // Trigger confirm
    // await page.click('button.show-confirm');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Handle Prompt
test('handle prompt', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Handle prompt with input
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        await dialog.accept('User input');
    });
    
    // Trigger prompt
    // await page.click('button.show-prompt');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Handle Prompt - Cancel
test('handle prompt cancel', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Cancel prompt
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        await dialog.dismiss();
    });
    
    // Trigger prompt
    // await page.click('button.show-prompt');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Get Dialog Message
test('get dialog message', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    let dialogMessage = '';
    
    page.on('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.accept();
    });
    
    // Trigger dialog
    // await page.click('button.show-alert');
    // expect(dialogMessage).toBe('Expected message');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Get Prompt Default Value
test('get prompt default value', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    page.on('dialog', async dialog => {
        const defaultValue = dialog.defaultValue();
        console.log('Default value:', defaultValue);
        await dialog.accept(defaultValue);
    });
    
    // Trigger prompt
    // await page.click('button.show-prompt');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Handle beforeunload
test('handle beforeunload', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Handle beforeunload dialog
    page.on('dialog', async dialog => {
        if (dialog.type() === 'beforeunload') {
            await dialog.accept();
        }
    });
    
    // Navigate away (triggers beforeunload if set)
    // await page.goto('https://example.com');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Multiple Dialogs
test('multiple dialogs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    let dialogCount = 0;
    
    page.on('dialog', async dialog => {
        dialogCount++;
        await dialog.accept();
    });
    
    // Trigger multiple dialogs
    // await page.click('button.show-multiple');
    // expect(dialogCount).toBe(3);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Dialog Best Practices
test('dialog best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Set up handler before trigger
     * 2. Check dialog type
     * 3. Verify dialog message
     * 4. Handle all dialog types
     * 5. Use accept/dismiss appropriately
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

