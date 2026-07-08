/**
 * Lab 420: WCAG Compliance
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing WCAG compliance:
 * 
 * - WCAG 2.1 guidelines
 * - Level A, AA, AAA
 * - Perceivable
 * - Operable
 * - Understandable
 * - Robust
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test WCAG criteria
 * 2. Check compliance levels
 * 3. Generate reports
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Perceivable - Text Alternatives
test('perceivable text alternatives', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 1.1.1 Non-text Content
    const nonTextContent = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const missingAlt = Array.from(images).filter(img => !img.alt && img.getAttribute('role') !== 'presentation');
        
        return {
            totalImages: images.length,
            missingAlt: missingAlt.length,
        };
    });
    
    console.log('Non-text content:', nonTextContent);
    expect(nonTextContent.missingAlt).toBe(0);
});

// Solution 2: Perceivable - Time-based Media
test('perceivable time based media', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 1.2.x Time-based Media
    const media = await page.evaluate(() => {
        const videos = document.querySelectorAll('video');
        const audios = document.querySelectorAll('audio');
        
        return {
            videos: Array.from(videos).map(v => ({
                hasCaptions: v.querySelector('track[kind="captions"]') !== null,
                hasControls: v.hasAttribute('controls'),
            })),
            audios: audios.length,
        };
    });
    
    console.log('Time-based media:', media);
});

// Solution 3: Perceivable - Adaptable
test('perceivable adaptable', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 1.3.x Adaptable
    const structure = await page.evaluate(() => {
        return {
            hasLandmarks: document.querySelectorAll('main, nav, header, footer, aside').length > 0,
            hasHeadings: document.querySelectorAll('h1, h2, h3').length > 0,
            hasLists: document.querySelectorAll('ul, ol').length > 0,
            hasTables: document.querySelectorAll('table').length,
        };
    });
    
    console.log('Adaptable structure:', structure);
    expect(structure.hasLandmarks).toBeTruthy();
});

// Solution 4: Operable - Keyboard Accessible
test('operable keyboard accessible', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 2.1.x Keyboard Accessible
    const keyboardAccessible = await page.evaluate(() => {
        const interactive = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        const notFocusable = Array.from(interactive).filter(el => {
            const tabindex = el.getAttribute('tabindex');
            return tabindex === '-1';
        });
        
        return {
            totalInteractive: interactive.length,
            notFocusable: notFocusable.length,
        };
    });
    
    console.log('Keyboard accessible:', keyboardAccessible);
});

// Solution 5: Operable - Enough Time
test('operable enough time', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 2.2.x Enough Time
    const timeConstraints = await page.evaluate(() => {
        // Check for auto-updating content
        const autoRefresh = document.querySelector('meta[http-equiv="refresh"]');
        const carousels = document.querySelectorAll('[class*="carousel"], [class*="slider"]');
        
        return {
            hasAutoRefresh: !!autoRefresh,
            hasCarousels: carousels.length > 0,
        };
    });
    
    console.log('Time constraints:', timeConstraints);
});

// Solution 6: Operable - Seizures
test('operable seizures', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 2.3.x Seizures
    const flashingContent = await page.evaluate(() => {
        // Check for potentially flashing content
        const animations = document.querySelectorAll('[class*="flash"], [class*="blink"]');
        const gifs = document.querySelectorAll('img[src$=".gif"]');
        
        return {
            potentialFlashing: animations.length,
            animatedGifs: gifs.length,
        };
    });
    
    console.log('Flashing content:', flashingContent);
});

// Solution 7: Operable - Navigable
test('operable navigable', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 2.4.x Navigable
    const navigation = await page.evaluate(() => {
        return {
            hasTitle: !!document.title,
            hasSkipLink: !!document.querySelector('a[href="#main"], a[href="#content"]'),
            hasHeadings: document.querySelectorAll('h1, h2, h3').length > 0,
            hasFocusVisible: true, // Would need to test interactively
        };
    });
    
    console.log('Navigation:', navigation);
    expect(navigation.hasTitle).toBeTruthy();
});

// Solution 8: Understandable - Readable
test('understandable readable', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 3.1.x Readable
    const readable = await page.evaluate(() => {
        return {
            hasLang: !!document.documentElement.lang,
            lang: document.documentElement.lang,
            hasAbbreviations: document.querySelectorAll('abbr').length,
        };
    });
    
    console.log('Readable:', readable);
    expect(readable.hasLang).toBeTruthy();
});

// Solution 9: Robust - Compatible
test('robust compatible', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // 4.1.x Compatible
    const compatible = await page.evaluate(() => {
        // Check for duplicate IDs
        const allIds = document.querySelectorAll('[id]');
        const ids = Array.from(allIds).map(el => el.id);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        
        return {
            totalIds: ids.length,
            duplicateIds: [...new Set(duplicates)],
        };
    });
    
    console.log('Compatible:', compatible);
    expect(compatible.duplicateIds.length).toBe(0);
});

// Solution 10: WCAG Compliance Best Practices
test('WCAG compliance best practices', async ({ page }) => {
    /*
     * WCAG 2.1 Levels:
     * - Level A: Minimum accessibility
     * - Level AA: Recommended (most common target)
     * - Level AAA: Highest level
     * 
     * Four Principles (POUR):
     * 1. Perceivable
     * 2. Operable
     * 3. Understandable
     * 4. Robust
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

