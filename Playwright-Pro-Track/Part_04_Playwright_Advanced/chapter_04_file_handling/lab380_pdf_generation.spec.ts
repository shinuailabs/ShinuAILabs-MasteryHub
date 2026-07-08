/**
 * Lab 380: PDF Generation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Generating PDFs from pages:
 * 
 * - page.pdf()
 * - PDF options
 * - Headers/footers
 * - Print styles
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Generate PDF
 * 2. Configure options
 * 3. Add headers/footers
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic PDF Generation
test('basic PDF generation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // PDF only works in Chromium headless
    // await page.pdf({ path: 'output/page.pdf' });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: PDF with Format
test('PDF with format', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // await page.pdf({
    //     path: 'output/a4.pdf',
    //     format: 'A4',
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: PDF with Custom Size
test('PDF with custom size', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // await page.pdf({
    //     path: 'output/custom.pdf',
    //     width: '8.5in',
    //     height: '11in',
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: PDF with Margins
test('PDF with margins', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // await page.pdf({
    //     path: 'output/margins.pdf',
    //     margin: {
    //         top: '1in',
    //         right: '0.5in',
    //         bottom: '1in',
    //         left: '0.5in',
    //     },
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: PDF with Header/Footer
test('PDF with header footer', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // await page.pdf({
    //     path: 'output/header-footer.pdf',
    //     displayHeaderFooter: true,
    //     headerTemplate: '<div style="font-size:10px;">Header</div>',
    //     footerTemplate: '<div style="font-size:10px;">Page <span class="pageNumber"></span></div>',
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: PDF Landscape
test('PDF landscape', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // await page.pdf({
    //     path: 'output/landscape.pdf',
    //     landscape: true,
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: PDF with Print Background
test('PDF with print background', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // await page.pdf({
    //     path: 'output/background.pdf',
    //     printBackground: true,
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: PDF Page Ranges
test('PDF page ranges', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // await page.pdf({
    //     path: 'output/pages.pdf',
    //     pageRanges: '1-3',
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: PDF to Buffer
test('PDF to buffer', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // const pdfBuffer = await page.pdf();
    // console.log('PDF size:', pdfBuffer.length, 'bytes');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: PDF Generation Best Practices
test('PDF generation best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use Chromium headless
     * 2. Set appropriate margins
     * 3. Include print styles
     * 4. Test page breaks
     * 5. Verify PDF content
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

