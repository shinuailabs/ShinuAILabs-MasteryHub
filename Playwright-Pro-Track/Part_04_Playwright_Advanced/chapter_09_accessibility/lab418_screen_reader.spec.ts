/**
 * Lab 418: Screen Reader Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing for screen reader compatibility:
 * 
 * - Accessible names
 * - ARIA labels
 * - Live regions
 * - Announcements
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Check accessible names
 * 2. Verify ARIA labels
 * 3. Test live regions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Check Accessible Names
test('check accessible names', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const accessibleNames = await page.evaluate(() => {
        const elements = document.querySelectorAll('button, a, input, select, textarea');
        return Array.from(elements).slice(0, 10).map(el => {
            const ariaLabel = el.getAttribute('aria-label');
            const ariaLabelledBy = el.getAttribute('aria-labelledby');
            const title = el.getAttribute('title');
            const text = el.textContent?.trim();
            
            return {
                tag: el.tagName,
                accessibleName: ariaLabel || ariaLabelledBy || title || text || 'none',
            };
        });
    });
    
    console.log('Accessible names:', accessibleNames);
});

// Solution 2: Check ARIA Labels
test('check ARIA labels', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const ariaLabels = await page.evaluate(() => {
        const withAriaLabel = document.querySelectorAll('[aria-label]');
        const withAriaLabelledBy = document.querySelectorAll('[aria-labelledby]');
        const withAriaDescribedBy = document.querySelectorAll('[aria-describedby]');
        
        return {
            ariaLabel: withAriaLabel.length,
            ariaLabelledBy: withAriaLabelledBy.length,
            ariaDescribedBy: withAriaDescribedBy.length,
        };
    });
    
    console.log('ARIA labels:', ariaLabels);
});

// Solution 3: Check Live Regions
test('check live regions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const liveRegions = await page.evaluate(() => {
        const polite = document.querySelectorAll('[aria-live="polite"]');
        const assertive = document.querySelectorAll('[aria-live="assertive"]');
        const status = document.querySelectorAll('[role="status"]');
        const alert = document.querySelectorAll('[role="alert"]');
        
        return {
            polite: polite.length,
            assertive: assertive.length,
            status: status.length,
            alert: alert.length,
        };
    });
    
    console.log('Live regions:', liveRegions);
});

// Solution 4: Check Image Descriptions
test('check image descriptions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const images = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        return Array.from(imgs).map(img => ({
            src: img.src.split('/').pop(),
            alt: img.alt || 'missing',
            role: img.getAttribute('role'),
            ariaLabel: img.getAttribute('aria-label'),
        }));
    });
    
    console.log('Images:', images.slice(0, 5));
    
    const missingAlt = images.filter(img => img.alt === 'missing');
    expect(missingAlt.length).toBe(0);
});

// Solution 5: Check Button Accessibility
test('check button accessibility', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const buttons = await page.evaluate(() => {
        const btns = document.querySelectorAll('button, [role="button"]');
        return Array.from(btns).map(btn => {
            const text = btn.textContent?.trim();
            const ariaLabel = btn.getAttribute('aria-label');
            const title = btn.getAttribute('title');
            
            return {
                hasAccessibleName: !!(text || ariaLabel || title),
                accessibleName: ariaLabel || title || text || 'none',
                disabled: btn.hasAttribute('disabled'),
                ariaDisabled: btn.getAttribute('aria-disabled'),
            };
        });
    });
    
    const inaccessible = buttons.filter(b => !b.hasAccessibleName);
    console.log('Inaccessible buttons:', inaccessible.length);
});

// Solution 6: Check Link Accessibility
test('check link accessibility', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = await page.evaluate(() => {
        const anchors = document.querySelectorAll('a');
        return Array.from(anchors).slice(0, 10).map(a => {
            const text = a.textContent?.trim();
            const ariaLabel = a.getAttribute('aria-label');
            const title = a.getAttribute('title');
            
            return {
                hasAccessibleName: !!(text || ariaLabel || title),
                accessibleName: (ariaLabel || title || text || 'none').substring(0, 30),
                href: a.href ? 'yes' : 'no',
            };
        });
    });
    
    console.log('Links:', links);
});

// Solution 7: Check Form Accessibility
test('check form accessibility', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const formElements = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, select, textarea');
        return Array.from(inputs).map(input => {
            const id = input.id;
            const label = id ? document.querySelector(`label[for="${id}"]`) : null;
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');
            const placeholder = input.getAttribute('placeholder');
            
            return {
                type: input.getAttribute('type') || input.tagName.toLowerCase(),
                hasLabel: !!(label || ariaLabel || ariaLabelledBy),
                labelMethod: label ? 'label' : ariaLabel ? 'aria-label' : ariaLabelledBy ? 'aria-labelledby' : placeholder ? 'placeholder only' : 'none',
            };
        });
    });
    
    console.log('Form elements:', formElements);
});

// Solution 8: Check Heading Hierarchy
test('check heading hierarchy', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const headings = await page.evaluate(() => {
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(allHeadings).map(h => ({
            level: parseInt(h.tagName[1]),
            text: h.textContent?.trim().substring(0, 50),
        }));
    });
    
    console.log('Heading hierarchy:', headings);
    
    // Check for skipped levels
    let previousLevel = 0;
    const skippedLevels: number[] = [];
    
    headings.forEach(h => {
        if (h.level > previousLevel + 1 && previousLevel !== 0) {
            skippedLevels.push(h.level);
        }
        previousLevel = h.level;
    });
    
    console.log('Skipped levels:', skippedLevels);
});

// Solution 9: Check Table Accessibility
test('check table accessibility', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const tables = await page.evaluate(() => {
        const allTables = document.querySelectorAll('table');
        return Array.from(allTables).map(table => ({
            hasCaption: !!table.querySelector('caption'),
            hasHeaders: table.querySelectorAll('th').length > 0,
            headerCount: table.querySelectorAll('th').length,
            rowCount: table.querySelectorAll('tr').length,
        }));
    });
    
    console.log('Tables:', tables);
});

// Solution 10: Screen Reader Best Practices
test('screen reader best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Provide accessible names
     * 2. Use proper ARIA labels
     * 3. Implement live regions
     * 4. Maintain heading hierarchy
     * 5. Label all form elements
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

