/**
 * Lab 317: PDF Generation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Generating PDFs from pages:
 * 
 * - page.pdf()
 * - PDF options
 * - Page format
 * - Headers and footers
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Generate PDFs
 * 2. Configure PDF options
 * 3. Add headers/footers
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, chromium } from '@playwright/test';

// Solution 1: Basic PDF Generation
test('basic PDF generation', async () => {
    // PDF only works in Chromium headless
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Generate PDF
    await page.pdf({ path: 'pdfs/basic.pdf' });
    
    await browser.close();
});

// Solution 2: PDF with Format
test('PDF with format', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    // A4 format
    await page.pdf({
        path: 'pdfs/a4.pdf',
        format: 'A4',
    });
    
    await browser.close();
});

// Solution 3: PDF with Custom Size
test('PDF with custom size', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Custom dimensions
    await page.pdf({
        path: 'pdfs/custom.pdf',
        width: '8.5in',
        height: '11in',
    });
    
    await browser.close();
});

// Solution 4: PDF with Margins
test('PDF with margins', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Custom margins
    await page.pdf({
        path: 'pdfs/margins.pdf',
        format: 'A4',
        margin: {
            top: '1in',
            right: '0.5in',
            bottom: '1in',
            left: '0.5in',
        },
    });
    
    await browser.close();
});

// Solution 5: PDF with Header and Footer
test('PDF with header footer', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    await page.pdf({
        path: 'pdfs/header-footer.pdf',
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size:10px; text-align:center; width:100%;">Header</div>',
        footerTemplate: '<div style="font-size:10px; text-align:center; width:100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
        margin: { top: '1in', bottom: '1in' },
    });
    
    await browser.close();
});

// Solution 6: PDF Landscape
test('PDF landscape', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    await page.pdf({
        path: 'pdfs/landscape.pdf',
        format: 'A4',
        landscape: true,
    });
    
    await browser.close();
});

// Solution 7: PDF Print Background
test('PDF print background', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Include background colors/images
    await page.pdf({
        path: 'pdfs/background.pdf',
        format: 'A4',
        printBackground: true,
    });
    
    await browser.close();
});

// Solution 8: PDF Scale
test('PDF scale', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Scale content
    await page.pdf({
        path: 'pdfs/scaled.pdf',
        format: 'A4',
        scale: 0.8, // 80%
    });
    
    await browser.close();
});

// Solution 9: PDF Page Ranges
test('PDF page ranges', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Specific pages
    await page.pdf({
        path: 'pdfs/pages.pdf',
        format: 'A4',
        pageRanges: '1-2',
    });
    
    await browser.close();
});

// Solution 10: PDF as Buffer
test('PDF as buffer', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Get PDF as buffer
    const buffer = await page.pdf({ format: 'A4' });
    
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
    
    await browser.close();
});

