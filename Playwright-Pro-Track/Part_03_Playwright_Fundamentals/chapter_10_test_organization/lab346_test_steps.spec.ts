/**
 * Lab 346: Test Steps
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using test steps:
 * 
 * - test.step()
 * - Step nesting
 * - Step reporting
 * - Step best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use test steps
 * 2. Nest steps
 * 3. View steps in reports
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Test Steps
test('basic test steps', async ({ page }) => {
    await test.step('Navigate to homepage', async () => {
        await page.goto('https://playwright.dev');
    });
    
    await test.step('Verify title', async () => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    await test.step('Verify heading', async () => {
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 2: Steps with Return Values
test('steps with return values', async ({ page }) => {
    const title = await test.step('Get page title', async () => {
        await page.goto('https://playwright.dev');
        return await page.title();
    });
    
    await test.step('Verify title', async () => {
        expect(title).toContain('Playwright');
    });
});

// Solution 3: Nested Steps
test('nested steps', async ({ page }) => {
    await test.step('Setup', async () => {
        await test.step('Navigate', async () => {
            await page.goto('https://playwright.dev');
        });
        
        await test.step('Wait for load', async () => {
            await page.waitForLoadState('networkidle');
        });
    });
    
    await test.step('Verify', async () => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 4: Steps for User Actions
test('user action steps', async ({ page }) => {
    await test.step('User navigates to site', async () => {
        await page.goto('https://playwright.dev');
    });
    
    await test.step('User clicks Get Started', async () => {
        await page.getByRole('link', { name: 'Get started' }).click();
    });
    
    await test.step('User sees documentation', async () => {
        await expect(page).toHaveURL(/.*intro/);
    });
});

// Solution 5: Steps for API Calls
test('API call steps', async ({ page, request }) => {
    await test.step('Make API request', async () => {
        const response = await request.get('https://playwright.dev');
        expect(response.ok()).toBeTruthy();
    });
    
    await test.step('Navigate to page', async () => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 6: Steps with Error Handling
test('steps with error handling', async ({ page }) => {
    await test.step('Navigate', async () => {
        await page.goto('https://playwright.dev');
    });
    
    await test.step('Verify element', async () => {
        try {
            await expect(page.locator('.non-existent')).toBeVisible({ timeout: 1000 });
        } catch (error) {
            console.log('Element not found, continuing...');
        }
    });
    
    await test.step('Final verification', async () => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 7: Reusable Step Functions
async function loginStep(page: any, username: string, password: string) {
    await test.step(`Login as ${username}`, async () => {
        // Login logic here
        console.log(`Logging in as ${username}`);
    });
}

test('reusable step functions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await loginStep(page, 'testuser', 'password');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Steps in Page Objects
class HomePage {
    constructor(private page: any) {}
    
    async navigate() {
        await test.step('Navigate to homepage', async () => {
            await this.page.goto('https://playwright.dev');
        });
    }
    
    async verifyTitle() {
        await test.step('Verify homepage title', async () => {
            await expect(this.page).toHaveTitle(/Playwright/);
        });
    }
}

test('steps in page objects', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyTitle();
});

// Solution 9: Steps in Reports
test('steps in reports', async ({ page }) => {
    /*
     * Steps appear in:
     * - HTML report
     * - Trace viewer
     * - Test output
     * 
     * View with:
     * npx playwright show-report
     */
    
    await test.step('Step 1', async () => {
        await page.goto('https://playwright.dev');
    });
    
    await test.step('Step 2', async () => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 10: Step Best Practices
test('step best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use descriptive step names
     * 2. Group related actions
     * 3. Use steps for documentation
     * 4. Don't over-use steps
     * 5. Use steps for debugging
     */
    
    await test.step('Navigate to Playwright website', async () => {
        await page.goto('https://playwright.dev');
    });
    
    await test.step('Verify page loaded correctly', async () => {
        await expect(page).toHaveTitle(/Playwright/);
        await expect(page.locator('h1')).toBeVisible();
    });
});

