/**
 * Lab 419: Color Contrast
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing color contrast:
 * 
 * - WCAG contrast ratios
 * - Text contrast
 * - UI component contrast
 * - Color blindness
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Check text contrast
 * 2. Verify UI contrast
 * 3. Test color schemes
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Helper function to calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper function to calculate contrast ratio
function getContrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Solution 1: Basic Contrast Check
test('basic contrast check', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const contrastData = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, span, a, h1, h2, h3, button');
        const results: any[] = [];
        
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            results.push({
                tag: el.tagName,
                color: style.color,
                backgroundColor: style.backgroundColor,
            });
        });
        
        return results.slice(0, 5);
    });
    
    console.log('Contrast data:', contrastData);
});

// Solution 2: Text Contrast Analysis
test('text contrast analysis', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const textElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, span, a, li');
        return Array.from(elements).slice(0, 10).map(el => {
            const style = window.getComputedStyle(el);
            return {
                text: el.textContent?.substring(0, 20),
                color: style.color,
                fontSize: style.fontSize,
            };
        });
    });
    
    console.log('Text elements:', textElements);
});

// Solution 3: Heading Contrast
test('heading contrast', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const headings = await page.evaluate(() => {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(elements).map(el => {
            const style = window.getComputedStyle(el);
            return {
                level: el.tagName,
                text: el.textContent?.substring(0, 30),
                color: style.color,
                fontSize: style.fontSize,
            };
        });
    });
    
    console.log('Headings:', headings);
});

// Solution 4: Button Contrast
test('button contrast', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const buttons = await page.evaluate(() => {
        const elements = document.querySelectorAll('button, [role="button"], .btn');
        return Array.from(elements).map(el => {
            const style = window.getComputedStyle(el);
            return {
                text: el.textContent?.trim().substring(0, 20),
                color: style.color,
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
            };
        });
    });
    
    console.log('Buttons:', buttons);
});

// Solution 5: Link Contrast
test('link contrast', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = await page.evaluate(() => {
        const elements = document.querySelectorAll('a');
        return Array.from(elements).slice(0, 10).map(el => {
            const style = window.getComputedStyle(el);
            return {
                text: el.textContent?.trim().substring(0, 20),
                color: style.color,
                textDecoration: style.textDecoration,
            };
        });
    });
    
    console.log('Links:', links);
});

// Solution 6: Focus State Contrast
test('focus state contrast', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Tab to focus an element
    await page.keyboard.press('Tab');
    
    const focusStyles = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        
        const style = window.getComputedStyle(el);
        return {
            outline: style.outline,
            outlineColor: style.outlineColor,
            boxShadow: style.boxShadow,
            backgroundColor: style.backgroundColor,
        };
    });
    
    console.log('Focus styles:', focusStyles);
});

// Solution 7: Dark Mode Contrast
test('dark mode contrast', async ({ browser }) => {
    const context = await browser.newContext({
        colorScheme: 'dark',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const darkModeColors = await page.evaluate(() => {
        const body = document.body;
        const style = window.getComputedStyle(body);
        return {
            backgroundColor: style.backgroundColor,
            color: style.color,
        };
    });
    
    console.log('Dark mode colors:', darkModeColors);
    await context.close();
});

// Solution 8: Input Field Contrast
test('input field contrast', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const inputs = await page.evaluate(() => {
        const elements = document.querySelectorAll('input, textarea, select');
        return Array.from(elements).map(el => {
            const style = window.getComputedStyle(el);
            return {
                type: el.getAttribute('type') || el.tagName,
                color: style.color,
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
            };
        });
    });
    
    console.log('Input fields:', inputs);
});

// Solution 9: Icon Contrast
test('icon contrast', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const icons = await page.evaluate(() => {
        const elements = document.querySelectorAll('svg, i, [class*="icon"]');
        return Array.from(elements).slice(0, 5).map(el => {
            const style = window.getComputedStyle(el);
            return {
                tag: el.tagName,
                fill: style.fill,
                color: style.color,
            };
        });
    });
    
    console.log('Icons:', icons);
});

// Solution 10: Color Contrast Best Practices
test('color contrast best practices', async ({ page }) => {
    /*
     * WCAG Contrast Requirements:
     * - Normal text: 4.5:1 minimum
     * - Large text (18pt+): 3:1 minimum
     * - UI components: 3:1 minimum
     * 
     * Best Practices:
     * 1. Test all text elements
     * 2. Check focus states
     * 3. Test dark mode
     * 4. Verify UI components
     * 5. Use automated tools
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

