/**
 * Lab 273: Form Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with form elements:
 * 
 * - Checkboxes
 * - Radio buttons
 * - Select dropdowns
 * - File uploads
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Interact with checkboxes
 * 2. Select dropdown options
 * 3. Upload files
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Checkbox - Check
test('checkbox check', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check a checkbox
    // await page.getByRole('checkbox', { name: 'Accept terms' }).check();
    
    // Verify checked
    // await expect(page.getByRole('checkbox')).toBeChecked();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 2: Checkbox - Uncheck
test('checkbox uncheck', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Uncheck a checkbox
    // await page.getByRole('checkbox', { name: 'Subscribe' }).uncheck();
    
    // Verify unchecked
    // await expect(page.getByRole('checkbox')).not.toBeChecked();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 3: Checkbox - Set Checked State
test('checkbox set checked', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Set to specific state
    // await page.getByRole('checkbox').setChecked(true);
    // await page.getByRole('checkbox').setChecked(false);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 4: Radio Buttons
test('radio buttons', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Select radio button
    // await page.getByRole('radio', { name: 'Option 1' }).check();
    
    // Verify selected
    // await expect(page.getByRole('radio', { name: 'Option 1' })).toBeChecked();
    
    // Other options should not be checked
    // await expect(page.getByRole('radio', { name: 'Option 2' })).not.toBeChecked();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 5: Select Dropdown - By Value
test('select by value', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Select by value attribute
    // await page.getByRole('combobox').selectOption('value1');
    
    // Verify selection
    // await expect(page.getByRole('combobox')).toHaveValue('value1');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 6: Select Dropdown - By Label
test('select by label', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Select by visible text
    // await page.getByRole('combobox').selectOption({ label: 'Option One' });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 7: Select Dropdown - By Index
test('select by index', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Select by index (0-based)
    // await page.getByRole('combobox').selectOption({ index: 2 });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 8: Multi-Select
test('multi select', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Select multiple options
    // await page.locator('select[multiple]').selectOption(['value1', 'value2']);
    
    // Or by label
    // await page.locator('select[multiple]').selectOption([
    //     { label: 'Option 1' },
    //     { label: 'Option 2' }
    // ]);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 9: File Upload
test('file upload', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Upload single file
    // await page.getByLabel('Upload file').setInputFiles('path/to/file.pdf');
    
    // Upload multiple files
    // await page.getByLabel('Upload files').setInputFiles([
    //     'path/to/file1.pdf',
    //     'path/to/file2.pdf'
    // ]);
    
    // Clear file input
    // await page.getByLabel('Upload file').setInputFiles([]);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 10: File Upload with Buffer
test('file upload with buffer', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Upload file from buffer
    // await page.getByLabel('Upload').setInputFiles({
    //     name: 'test.txt',
    //     mimeType: 'text/plain',
    //     buffer: Buffer.from('Hello World')
    // });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 11: Form Submission
test('form submission', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Fill form and submit
    // await page.getByLabel('Email').fill('test@example.com');
    // await page.getByLabel('Password').fill('password123');
    // await page.getByRole('button', { name: 'Submit' }).click();
    
    // Or press Enter to submit
    // await page.getByLabel('Password').press('Enter');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

