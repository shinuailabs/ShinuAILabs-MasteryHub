/**
 * Lab 257: Test Generator (Codegen)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using Playwright's test generator:
 * 
 * - Recording tests
 * - Generating selectors
 * - Editing generated code
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use codegen tool
 * 2. Record interactions
 * 3. Refine generated tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

/*
 * Solution 1: Starting Codegen
 * 
 * Basic usage:
 * npx playwright codegen
 * 
 * With specific URL:
 * npx playwright codegen https://playwright.dev
 * 
 * With specific browser:
 * npx playwright codegen --browser=firefox
 * 
 * With device emulation:
 * npx playwright codegen --device="iPhone 13"
 */

/*
 * Solution 2: Codegen Options
 * 
 * Save to file:
 * npx playwright codegen -o tests/generated.spec.ts
 * 
 * Target language:
 * npx playwright codegen --target=javascript
 * npx playwright codegen --target=python
 * 
 * With viewport:
 * npx playwright codegen --viewport-size=1280,720
 */

/*
 * Solution 3: Codegen Features
 * 
 * - Record clicks, fills, navigations
 * - Generate assertions
 * - Pick locators
 * - Pause/resume recording
 * - Copy code snippets
 */

// Solution 4: Example Generated Test
// This is what codegen might generate:
test('generated test example', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

/*
 * Solution 5: Locator Picker
 * 
 * In codegen window:
 * 1. Click "Pick locator" button
 * 2. Hover over elements
 * 3. Click to copy locator
 * 
 * Or use in browser console:
 * playwright.locator(element)
 */

// Solution 6: Refining Generated Code
// Before (generated):
test('before refining', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await page.locator('text=Get started').click();
});

// After (refined):
test('after refining', async ({ page }) => {
    // Added comments
    await page.goto('https://playwright.dev/');
    
    // Used better locator
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Added assertion
    await expect(page).toHaveURL(/.*intro/);
});

/*
 * Solution 7: Recording with Authentication
 * 
 * Save auth state:
 * npx playwright codegen --save-storage=auth.json
 * 
 * Load auth state:
 * npx playwright codegen --load-storage=auth.json
 */

/*
 * Solution 8: Codegen with Emulation
 * 
 * Mobile device:
 * npx playwright codegen --device="Pixel 5"
 * 
 * Geolocation:
 * npx playwright codegen --geolocation="37.7749,-122.4194"
 * 
 * Timezone:
 * npx playwright codegen --timezone="America/New_York"
 * 
 * Color scheme:
 * npx playwright codegen --color-scheme=dark
 */

// Solution 9: Best Practices for Generated Tests
test.describe('Generated Test Best Practices', () => {
    test.beforeEach(async ({ page }) => {
        // Extract common setup
        await page.goto('https://playwright.dev/');
    });
    
    test('should navigate to docs', async ({ page }) => {
        // Use role-based locators
        await page.getByRole('link', { name: 'Docs' }).click();
        
        // Add meaningful assertions
        await expect(page).toHaveURL(/.*docs/);
        await expect(page.locator('h1')).toBeVisible();
    });
});

/*
 * Solution 10: Tips for Using Codegen
 * 
 * 1. Use as starting point, not final code
 * 2. Refine locators for stability
 * 3. Add meaningful assertions
 * 4. Extract common patterns
 * 5. Add comments and documentation
 * 6. Use Page Object Model for complex flows
 * 7. Remove unnecessary waits
 * 8. Group related actions
 */

// Solution 11: Combining Manual and Generated
test('combined approach', async ({ page }) => {
    // Manual setup
    await page.goto('https://playwright.dev/');
    
    // Generated interaction (refined)
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Manual assertions
    await expect(page).toHaveURL(/.*intro/);
    const heading = page.locator('h1');
    await expect(heading).toContainText('Installation');
});

