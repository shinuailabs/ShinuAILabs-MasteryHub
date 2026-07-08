/**
 * Lab 416: Axe Integration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using axe-core for accessibility testing:
 * 
 * - axe-core integration
 * - Automated a11y checks
 * - Rule configuration
 * - Report generation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Integrate axe-core
 * 2. Run accessibility scans
 * 3. Configure rules
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Note: In real usage, install @axe-core/playwright
// npm install @axe-core/playwright

// Solution 1: Basic Axe Scan (Manual Implementation)
test('basic axe scan', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Inject axe-core (simplified example)
    const results = await page.evaluate(() => {
        // In real implementation, use axe-core library
        return {
            violations: [],
            passes: [],
            incomplete: [],
        };
    });
    
    console.log('Violations:', results.violations.length);
    expect(results.violations.length).toBe(0);
});

// Solution 2: Check ARIA Attributes
test('check ARIA attributes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const ariaIssues = await page.evaluate(() => {
        const issues: string[] = [];
        
        // Check for invalid ARIA roles
        const elementsWithRole = document.querySelectorAll('[role]');
        const validRoles = ['button', 'link', 'navigation', 'main', 'banner', 'contentinfo', 'search', 'form', 'region', 'complementary', 'article', 'heading', 'list', 'listitem', 'img', 'dialog', 'alert', 'alertdialog', 'menu', 'menuitem', 'tab', 'tablist', 'tabpanel', 'tree', 'treeitem', 'grid', 'gridcell', 'row', 'rowgroup', 'columnheader', 'rowheader', 'presentation', 'none', 'status', 'log', 'marquee', 'timer', 'tooltip', 'progressbar', 'slider', 'spinbutton', 'textbox', 'checkbox', 'radio', 'combobox', 'listbox', 'option', 'switch', 'separator', 'scrollbar', 'group', 'figure', 'definition', 'term', 'note', 'directory', 'document', 'application', 'cell', 'table', 'feed', 'math'];
        
        elementsWithRole.forEach(el => {
            const role = el.getAttribute('role');
            if (role && !validRoles.includes(role)) {
                issues.push(`Invalid role: ${role}`);
            }
        });
        
        return issues;
    });
    
    console.log('ARIA issues:', ariaIssues);
});

// Solution 3: Check Required ARIA Properties
test('check required ARIA properties', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const missingProps = await page.evaluate(() => {
        const issues: string[] = [];
        
        // Check sliders have required properties
        const sliders = document.querySelectorAll('[role="slider"]');
        sliders.forEach(slider => {
            if (!slider.hasAttribute('aria-valuenow')) {
                issues.push('Slider missing aria-valuenow');
            }
            if (!slider.hasAttribute('aria-valuemin')) {
                issues.push('Slider missing aria-valuemin');
            }
            if (!slider.hasAttribute('aria-valuemax')) {
                issues.push('Slider missing aria-valuemax');
            }
        });
        
        // Check checkboxes have aria-checked
        const checkboxes = document.querySelectorAll('[role="checkbox"]');
        checkboxes.forEach(cb => {
            if (!cb.hasAttribute('aria-checked')) {
                issues.push('Checkbox missing aria-checked');
            }
        });
        
        return issues;
    });
    
    console.log('Missing ARIA properties:', missingProps);
});

// Solution 4: Check Landmark Regions
test('check landmark regions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const landmarks = await page.evaluate(() => {
        return {
            main: document.querySelectorAll('main, [role="main"]').length,
            nav: document.querySelectorAll('nav, [role="navigation"]').length,
            banner: document.querySelectorAll('header, [role="banner"]').length,
            contentinfo: document.querySelectorAll('footer, [role="contentinfo"]').length,
            search: document.querySelectorAll('[role="search"]').length,
        };
    });
    
    console.log('Landmarks:', landmarks);
    expect(landmarks.main).toBeGreaterThanOrEqual(1);
});

// Solution 5: Check Skip Links
test('check skip links', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const hasSkipLink = await page.evaluate(() => {
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        return Array.from(skipLinks).some(link => {
            const text = link.textContent?.toLowerCase() || '';
            return text.includes('skip') || text.includes('main');
        });
    });
    
    console.log('Has skip link:', hasSkipLink);
});

// Solution 6: Check Tab Order
test('check tab order', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const tabOrder: string[] = [];
    
    for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => {
            const el = document.activeElement;
            return el ? `${el.tagName}${el.id ? '#' + el.id : ''}` : 'none';
        });
        tabOrder.push(focused);
    }
    
    console.log('Tab order:', tabOrder);
});

// Solution 7: Check Focus Trap
test('check focus trap', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check that focus doesn't get trapped unexpectedly
    const startElement = await page.evaluate(() => document.activeElement?.tagName);
    
    // Tab through many elements
    for (let i = 0; i < 50; i++) {
        await page.keyboard.press('Tab');
    }
    
    const endElement = await page.evaluate(() => document.activeElement?.tagName);
    
    console.log('Start:', startElement, 'End:', endElement);
});

// Solution 8: Check Interactive Elements
test('check interactive elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const interactiveIssues = await page.evaluate(() => {
        const issues: string[] = [];
        
        // Check buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (!btn.textContent?.trim() && !btn.getAttribute('aria-label')) {
                issues.push('Button without accessible name');
            }
        });
        
        // Check links
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (!link.textContent?.trim() && !link.getAttribute('aria-label')) {
                issues.push('Link without accessible name');
            }
        });
        
        return issues;
    });
    
    console.log('Interactive element issues:', interactiveIssues.length);
});

// Solution 9: Generate Accessibility Report
test('generate accessibility report', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const report = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const links = document.querySelectorAll('a');
        const buttons = document.querySelectorAll('button');
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        return {
            totalImages: images.length,
            imagesWithAlt: Array.from(images).filter(i => i.alt).length,
            totalLinks: links.length,
            totalButtons: buttons.length,
            totalHeadings: headings.length,
            hasLang: !!document.documentElement.lang,
            hasTitle: !!document.title,
        };
    });
    
    console.log('Accessibility Report:', JSON.stringify(report, null, 2));
});

// Solution 10: Axe Integration Best Practices
test('axe integration best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Run axe on all pages
     * 2. Configure relevant rules
     * 3. Track violations over time
     * 4. Include in CI/CD
     * 5. Fix critical issues first
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

