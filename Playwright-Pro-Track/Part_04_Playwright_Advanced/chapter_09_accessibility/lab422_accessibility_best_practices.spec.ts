/**
 * Lab 422: Accessibility Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for accessibility testing:
 *
 * - Testing strategies
 * - Automation approaches
 * - Manual testing
 * - Continuous monitoring
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply accessibility best practices
 * 2. Create comprehensive tests
 * 3. Set up monitoring
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Comprehensive Page Audit
test('comprehensive page audit', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const audit = await page.evaluate(() => {
        return {
            // Document structure
            hasTitle: !!document.title,
            hasLang: !!document.documentElement.lang,
            hasMain: !!document.querySelector('main'),

            // Images
            totalImages: document.querySelectorAll('img').length,
            imagesWithAlt: document.querySelectorAll('img[alt]').length,

            // Headings
            h1Count: document.querySelectorAll('h1').length,
            totalHeadings: document.querySelectorAll('h1,h2,h3,h4,h5,h6').length,

            // Forms
            totalInputs: document.querySelectorAll('input,select,textarea').length,

            // Links
            totalLinks: document.querySelectorAll('a').length,
        };
    });

    console.log('Page Audit:', audit);

    expect(audit.hasTitle).toBeTruthy();
    expect(audit.hasLang).toBeTruthy();
    expect(audit.h1Count).toBe(1);
});

// Solution 2: Keyboard Accessibility Check
test('keyboard accessibility check', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Test tab navigation
    const focusableCount = await page.evaluate(() => {
        return document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ).length;
    });

    // Tab through elements
    let tabCount = 0;
    for (let i = 0; i < Math.min(focusableCount, 20); i++) {
        await page.keyboard.press('Tab');
        const hasFocus = await page.evaluate(() => document.activeElement !== document.body);
        if (hasFocus) tabCount++;
    }

    console.log('Focusable elements:', focusableCount);
    console.log('Successfully tabbed:', tabCount);
});

// Solution 3: Form Accessibility Check
test('form accessibility check', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const formIssues = await page.evaluate(() => {
        const issues: string[] = [];
        const inputs = document.querySelectorAll('input, select, textarea');

        inputs.forEach((input, index) => {
            const id = input.id;
            const label = id ? document.querySelector(`label[for="${id}"]`) : null;
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');

            if (!label && !ariaLabel && !ariaLabelledBy) {
                issues.push(`Input ${index + 1} missing label`);
            }
        });

        return issues;
    });

    console.log('Form issues:', formIssues);
});

// Solution 4: Color and Contrast Check
test('color and contrast check', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const colorInfo = await page.evaluate(() => {
        const body = document.body;
        const style = window.getComputedStyle(body);

        return {
            backgroundColor: style.backgroundColor,
            color: style.color,
            fontSize: style.fontSize,
        };
    });

    console.log('Color info:', colorInfo);
});

// Solution 5: Link Accessibility Check
test('link accessibility check', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const linkIssues = await page.evaluate(() => {
        const issues: string[] = [];
        const links = document.querySelectorAll('a');

        links.forEach((link, index) => {
            const text = link.textContent?.trim();
            const ariaLabel = link.getAttribute('aria-label');

            if (!text && !ariaLabel) {
                issues.push(`Link ${index + 1} has no accessible name`);
            }

            if (text?.toLowerCase() === 'click here' || text?.toLowerCase() === 'read more') {
                issues.push(`Link ${index + 1} has non-descriptive text: "${text}"`);
            }
        });

        return issues;
    });

    console.log('Link issues:', linkIssues);
});

// Solution 6: Media Accessibility Check
test('media accessibility check', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const mediaInfo = await page.evaluate(() => {
        const videos = document.querySelectorAll('video');
        const audios = document.querySelectorAll('audio');

        return {
            videos: Array.from(videos).map(v => ({
                hasCaptions: !!v.querySelector('track[kind="captions"]'),
                hasControls: v.hasAttribute('controls'),
            })),
            audios: Array.from(audios).map(a => ({
                hasControls: a.hasAttribute('controls'),
            })),
        };
    });

    console.log('Media info:', mediaInfo);
});

// Solution 7: Dynamic Content Check
test('dynamic content check', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const dynamicContent = await page.evaluate(() => {
        return {
            liveRegions: document.querySelectorAll('[aria-live]').length,
            alerts: document.querySelectorAll('[role="alert"]').length,
            status: document.querySelectorAll('[role="status"]').length,
        };
    });

    console.log('Dynamic content:', dynamicContent);
});

// Solution 8: Mobile Accessibility Check
test('mobile accessibility check', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        isMobile: true,
    });

    const page = await context.newPage();
    await page.goto('https://playwright.dev');

    const mobileA11y = await page.evaluate(() => {
        return {
            hasViewport: !!document.querySelector('meta[name="viewport"]'),
            touchTargets: document.querySelectorAll('a, button').length,
        };
    });

    console.log('Mobile accessibility:', mobileA11y);
    await context.close();
});

// Solution 9: Accessibility Report Generator
test('accessibility report generator', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const report = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const links = document.querySelectorAll('a');
        const buttons = document.querySelectorAll('button');
        const inputs = document.querySelectorAll('input, select, textarea');
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        return {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            metrics: {
                images: { total: images.length, withAlt: document.querySelectorAll('img[alt]').length },
                links: { total: links.length },
                buttons: { total: buttons.length },
                inputs: { total: inputs.length },
                headings: { total: headings.length, h1: document.querySelectorAll('h1').length },
            },
            checks: {
                hasTitle: !!document.title,
                hasLang: !!document.documentElement.lang,
                hasMain: !!document.querySelector('main'),
                hasNav: !!document.querySelector('nav'),
            },
        };
    });

    console.log('Accessibility Report:', JSON.stringify(report, null, 2));
});

// Solution 10: Accessibility Best Practices Summary
test('accessibility best practices summary', async ({ page }) => {
    /*
     * Accessibility Testing Best Practices:
     *
     * Automated Testing:
     * - Use axe-core or similar tools
     * - Include in CI/CD pipeline
     * - Test all pages and states
     *
     * Manual Testing:
     * - Keyboard navigation
     * - Screen reader testing
     * - Color contrast verification
     *
     * Continuous Monitoring:
     * - Track accessibility metrics
     * - Set accessibility budgets
     * - Regular audits
     *
     * Key Areas:
     * - Document structure
     * - Images and media
     * - Forms and inputs
     * - Navigation and links
     * - Dynamic content
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});
