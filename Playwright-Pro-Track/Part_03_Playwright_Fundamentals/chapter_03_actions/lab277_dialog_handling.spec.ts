/**
 * Lab 277: Dialog Handling
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling browser dialogs:
 * 
 * - Alert dialogs
 * - Confirm dialogs
 * - Prompt dialogs
 * - beforeunload
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle alert dialogs
 * 2. Accept/dismiss confirms
 * 3. Enter text in prompts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Handle Alert Dialog
test('handle alert dialog', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Set up dialog handler BEFORE triggering dialog
    page.on('dialog', async dialog => {
        console.log('Dialog message:', dialog.message());
        expect(dialog.type()).toBe('alert');
        await dialog.accept();
    });
    
    // Trigger alert (example)
    // await page.evaluate(() => alert('Hello!'));
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 2: Handle Confirm Dialog - Accept
test('handle confirm dialog accept', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Accept the confirm dialog
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        await dialog.accept();
    });
    
    // Trigger confirm and check result
    // const result = await page.evaluate(() => confirm('Are you sure?'));
    // expect(result).toBe(true);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 3: Handle Confirm Dialog - Dismiss
test('handle confirm dialog dismiss', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Dismiss the confirm dialog
    page.on('dialog', async dialog => {
        await dialog.dismiss();
    });
    
    // Trigger confirm and check result
    // const result = await page.evaluate(() => confirm('Are you sure?'));
    // expect(result).toBe(false);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 4: Handle Prompt Dialog
test('handle prompt dialog', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Enter text in prompt
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.defaultValue()).toBe('');
        await dialog.accept('My Answer');
    });
    
    // Trigger prompt and check result
    // const result = await page.evaluate(() => prompt('Enter name:'));
    // expect(result).toBe('My Answer');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 5: Handle Prompt with Default Value
test('handle prompt with default', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    page.on('dialog', async dialog => {
        // Check default value
        console.log('Default:', dialog.defaultValue());
        // Accept with different value
        await dialog.accept('New Value');
    });
    
    // Trigger prompt with default
    // const result = await page.evaluate(() => prompt('Name:', 'Default'));
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 6: Dialog with Once Handler
test('dialog with once handler', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Handle only one dialog
    page.once('dialog', async dialog => {
        await dialog.accept();
    });
    
    // First dialog will be handled
    // await page.evaluate(() => alert('First'));
    
    // Second dialog needs another handler
    // page.once('dialog', dialog => dialog.accept());
    // await page.evaluate(() => alert('Second'));
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 7: Wait for Dialog
test('wait for dialog', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for dialog to appear
    const dialogPromise = page.waitForEvent('dialog');
    
    // Trigger dialog
    // await page.evaluate(() => alert('Hello'));
    
    // Handle dialog
    // const dialog = await dialogPromise;
    // await dialog.accept();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 8: Multiple Dialogs
test('multiple dialogs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const dialogMessages: string[] = [];
    
    page.on('dialog', async dialog => {
        dialogMessages.push(dialog.message());
        await dialog.accept();
    });
    
    // Trigger multiple dialogs
    // await page.evaluate(() => {
    //     alert('First');
    //     alert('Second');
    // });
    
    // console.log('Dialog messages:', dialogMessages);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 9: beforeunload Dialog
test('beforeunload dialog', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Handle beforeunload
    page.on('dialog', async dialog => {
        if (dialog.type() === 'beforeunload') {
            await dialog.accept(); // or dismiss() to stay
        }
    });
    
    // Set up beforeunload
    // await page.evaluate(() => {
    //     window.onbeforeunload = () => 'Changes not saved!';
    // });
    
    // Navigate away
    // await page.goto('https://example.com');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 10: Dialog Properties
test('dialog properties', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    page.on('dialog', async dialog => {
        // Dialog properties
        console.log('Type:', dialog.type()); // alert, confirm, prompt, beforeunload
        console.log('Message:', dialog.message());
        console.log('Default Value:', dialog.defaultValue());
        
        await dialog.accept();
    });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

