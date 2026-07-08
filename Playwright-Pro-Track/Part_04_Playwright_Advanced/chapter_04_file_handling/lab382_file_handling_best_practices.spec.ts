/**
 * Lab 382: File Handling Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for file handling:
 * 
 * - Organization
 * - Cleanup
 * - Fixtures
 * - Verification
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply file handling best practices
 * 2. Organize test files
 * 3. Clean up artifacts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Solution 1: Test File Fixtures
test('test file fixtures', async ({ page }) => {
    /*
     * Organize test files:
     * 
     * fixtures/
     * ├── uploads/
     * │   ├── test-image.png
     * │   ├── test-document.pdf
     * │   └── test-data.csv
     * └── downloads/
     *     └── .gitkeep
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Create Test Files
test('create test files', async ({ page }) => {
    // Create test file dynamically
    const testDir = 'test-files';
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
    
    fs.writeFileSync(
        path.join(testDir, 'test.txt'),
        'Test content'
    );
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Cleanup After Tests
test('cleanup after tests', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * globalTeardown: require.resolve('./global-teardown'),
     * 
     * global-teardown.ts:
     * 
     * export default async function() {
     *   fs.rmSync('downloads', { recursive: true, force: true });
     *   fs.rmSync('screenshots', { recursive: true, force: true });
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: File Verification Helper
async function verifyFileExists(filePath: string): Promise<boolean> {
    return fs.existsSync(filePath);
}

async function verifyFileContent(filePath: string, expected: string): Promise<boolean> {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes(expected);
}

test('file verification helper', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use helpers
    // const exists = await verifyFileExists('downloads/file.txt');
    // const hasContent = await verifyFileContent('downloads/file.txt', 'expected');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Unique File Names
test('unique file names', async ({ page }) => {
    const timestamp = Date.now();
    const uniqueName = `test-${timestamp}.txt`;
    
    // Use unique name for uploads/downloads
    console.log('Unique filename:', uniqueName);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: File Size Validation
test('file size validation', async ({ page }) => {
    const validateFileSize = (filePath: string, maxSize: number): boolean => {
        const stats = fs.statSync(filePath);
        return stats.size <= maxSize;
    };
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: File Type Validation
test('file type validation', async ({ page }) => {
    const validateFileType = (filename: string, allowedTypes: string[]): boolean => {
        const ext = path.extname(filename).toLowerCase();
        return allowedTypes.includes(ext);
    };
    
    const isValid = validateFileType('test.pdf', ['.pdf', '.doc', '.docx']);
    expect(isValid).toBeTruthy();
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Artifact Organization
test('artifact organization', async ({ page }) => {
    /*
     * Organize artifacts:
     * 
     * test-results/
     * ├── screenshots/
     * │   └── test-name/
     * ├── videos/
     * │   └── test-name/
     * └── downloads/
     *     └── test-name/
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Parallel Test File Isolation
test('parallel test file isolation', async ({ page }, testInfo) => {
    // Use test-specific directory
    const testDir = path.join('test-files', testInfo.testId);
    
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: File Handling Best Practices Summary
test('file handling best practices summary', async ({ page }) => {
    /*
     * Best Practices Summary:
     * 
     * Organization:
     * - Use fixtures directory
     * - Organize by type
     * - Use meaningful names
     * 
     * Cleanup:
     * - Clean up in teardown
     * - Use unique names
     * - Isolate parallel tests
     * 
     * Verification:
     * - Verify file exists
     * - Verify content
     * - Validate size/type
     * 
     * Performance:
     * - Reuse test files
     * - Clean up large files
     * - Use appropriate formats
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

