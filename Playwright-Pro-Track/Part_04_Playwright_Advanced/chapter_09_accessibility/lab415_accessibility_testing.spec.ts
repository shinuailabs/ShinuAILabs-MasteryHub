/**
 * Lab 415: Accessibility Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Introduction to accessibility testing:
 * 
 * - WCAG guidelines
 * - Accessibility tree
 * - Screen reader testing
 * - Keyboard navigation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test accessibility basics
 * 2. Check WCAG compliance
 * 3. Verify keyboard navigation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Accessibility Snapshot
test('accessibility snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const snapshot = await page.accessibility.snapshot();
    
    console.log('Accessibility tree root:', snapshot?.role);
    console.log('Children count:', snapshot?.children?.length);
});

// Solution 2: Check Page Title
test('check page title', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const title = await page.title();
    
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    console.log('Page title:', title);
});

// Solution 3: Check Language Attribute
test('check language attribute', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const lang = await page.evaluate(() => {
        return document.documentElement.lang;
    });
    
    expect(lang).toBeTruthy();
    console.log('Language:', lang);
});

// Solution 4: Check Heading Structure
test('check heading structure', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const headings = await page.evaluate(() => {
        const h1s = document.querySelectorAll('h1');
        const h2s = document.querySelectorAll('h2');
        const h3s = document.querySelectorAll('h3');
        
        return {
            h1Count: h1s.length,
            h2Count: h2s.length,
            h3Count: h3s.length,
            h1Text: Array.from(h1s).map(h => h.textContent),
        };
    });
    
    console.log('Heading structure:', headings);
    expect(headings.h1Count).toBe(1); // Should have exactly one h1
});

// Solution 5: Check Image Alt Text
test('check image alt text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const images = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        return Array.from(imgs).map(img => ({
            src: img.src.split('/').pop(),
            alt: img.alt,
            hasAlt: img.hasAttribute('alt'),
        }));
    });
    
    const missingAlt = images.filter(img => !img.hasAlt);
    console.log('Images without alt:', missingAlt.length);
    
    // All images should have alt attribute
    expect(missingAlt.length).toBe(0);
});

// Solution 6: Check Link Text
test('check link text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = await page.evaluate(() => {
        const anchors = document.querySelectorAll('a');
        return Array.from(anchors).map(a => ({
            text: a.textContent?.trim(),
            href: a.href,
            hasText: (a.textContent?.trim().length || 0) > 0,
        })).filter(l => !l.hasText);
    });
    
    console.log('Links without text:', links.length);
});

// Solution 7: Check Form Labels
test('check form labels', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const formIssues = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, select, textarea');
        const issues: string[] = [];
        
        inputs.forEach(input => {
            const id = input.id;
            const label = id ? document.querySelector(`label[for="${id}"]`) : null;
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');
            
            if (!label && !ariaLabel && !ariaLabelledBy) {
                issues.push(`Input without label: ${input.outerHTML.substring(0, 50)}`);
            }
        });
        
        return issues;
    });
    
    console.log('Form label issues:', formIssues.length);
});

// Solution 8: Check Color Contrast
test('check color contrast', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Basic contrast check (simplified)
    const contrastIssues = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, span, a, h1, h2, h3, h4, h5, h6');
        const issues: string[] = [];
        
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            // This is a simplified check - real contrast checking is more complex
            if (color === bgColor) {
                issues.push('Same color as background');
            }
        });
        
        return issues;
    });
    
    console.log('Potential contrast issues:', contrastIssues.length);
});

// Solution 9: Check Focus Indicators
test('check focus indicators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Tab through focusable elements
    const focusableElements = await page.evaluate(() => {
        const focusable = document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        return focusable.length;
    });
    
    console.log('Focusable elements:', focusableElements);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    console.log('First focused element:', focused);
});

// Solution 10: Accessibility Testing Best Practices
test('accessibility testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test with screen readers
     * 2. Verify keyboard navigation
     * 3. Check color contrast
     * 4. Validate heading structure
     * 5. Ensure form accessibility
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

