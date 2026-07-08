/**
 * Lab 627: Integration Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for Playwright + Cucumber:
 * 
 * - Project structure
 * - Code organization
 * - Performance
 * - Maintainability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Organize code
 * 3. Optimize performance
 *
 * =====================
 * SOLUTION:
 * =====================
 */

/*
 * Best Practice 1: Project Structure
 * 
 * project/
 * ├── features/
 * │   ├── login.feature
 * │   └── checkout.feature
 * ├── step_definitions/
 * │   ├── common.steps.ts
 * │   ├── login.steps.ts
 * │   └── checkout.steps.ts
 * ├── pages/
 * │   ├── BasePage.ts
 * │   ├── LoginPage.ts
 * │   └── CheckoutPage.ts
 * ├── support/
 * │   ├── hooks.ts
 * │   ├── world.ts
 * │   └── helpers.ts
 * ├── fixtures/
 * │   └── users.json
 * ├── reports/
 * └── cucumber.js
 */

// Solution 1: Centralized Configuration
interface TestConfig {
    baseUrl: string;
    browser: 'chromium' | 'firefox' | 'webkit';
    headless: boolean;
    timeout: number;
    retries: number;
    parallel: number;
}

function getConfig(): TestConfig {
    return {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        browser: (process.env.BROWSER as any) || 'chromium',
        headless: process.env.HEADLESS !== 'false',
        timeout: parseInt(process.env.TIMEOUT || '30000'),
        retries: parseInt(process.env.RETRIES || '0'),
        parallel: parseInt(process.env.PARALLEL || '1'),
    };
}

// Solution 2: Reusable Step Patterns
/*
 * BAD: Specific steps
 * When('I click the login button', ...)
 * When('I click the submit button', ...)
 * When('I click the save button', ...)
 * 
 * GOOD: Generic steps
 * When('I click the {string} button', ...)
 */

// Solution 3: Page Object Best Practices
/*
 * - Keep locators private
 * - Expose actions as methods
 * - Return page objects for navigation
 * - Use meaningful method names
 */

// Solution 4: Avoid Hardcoded Waits
/*
 * BAD:
 * await page.waitForTimeout(5000);
 * 
 * GOOD:
 * await page.waitForSelector('.loaded');
 * await expect(page.locator('.item')).toBeVisible();
 */

// Solution 5: Use Data-Testid Attributes
/*
 * BAD:
 * page.locator('.btn.primary.large')
 * page.locator('//div[@class="container"]/button[2]')
 * 
 * GOOD:
 * page.locator('[data-testid="submit-button"]')
 * page.getByTestId('submit-button')
 */

// Solution 6: Error Handling
import { After } from '@cucumber/cucumber';

After(async function (scenario) {
    if (scenario.result?.status === 'FAILED') {
        // Capture diagnostic information
        if (this.page) {
            // Screenshot
            const screenshot = await this.page.screenshot({ fullPage: true });
            await this.attach(screenshot, 'image/png');
            
            // Page URL
            await this.attach(`URL: ${this.page.url()}`, 'text/plain');
            
            // Console logs
            if (this.consoleLogs?.length) {
                await this.attach(
                    `Console:\n${this.consoleLogs.join('\n')}`,
                    'text/plain'
                );
            }
        }
    }
});

// Solution 7: Parallel Execution Considerations
/*
 * - Use unique test data per worker
 * - Avoid shared state between scenarios
 * - Use database transactions for isolation
 * - Clean up after each scenario
 */

// Solution 8: Performance Tips
/*
 * - Reuse browser instance across scenarios
 * - Use storage state for authentication
 * - Mock slow external services
 * - Run tests in parallel
 * - Use headless mode in CI
 */

// Solution 9: Debugging Tips
/*
 * - Use PWDEBUG=1 for Playwright Inspector
 * - Add --tags "@debug" for specific scenarios
 * - Use page.pause() for breakpoints
 * - Enable trace recording for failures
 */

// Solution 10: CI/CD Integration
/*
 * - Use JUnit reporter for test results
 * - Archive screenshots and traces
 * - Set appropriate timeouts
 * - Use retry for flaky tests
 * - Run smoke tests on PR, full suite on merge
 */

// Solution 11: Cucumber Configuration
const cucumberConfig = {
    default: {
        require: ['step_definitions/**/*.ts', 'support/**/*.ts'],
        requireModule: ['ts-node/register'],
        format: ['progress', 'html:reports/cucumber-report.html'],
        formatOptions: { snippetInterface: 'async-await' },
        publishQuiet: true,
    },
    ci: {
        require: ['step_definitions/**/*.ts', 'support/**/*.ts'],
        requireModule: ['ts-node/register'],
        format: ['progress', 'json:reports/cucumber-report.json'],
        parallel: 4,
        retry: 1,
        tags: 'not @skip and not @wip',
    },
};

// Solution 12: Export
export { getConfig, cucumberConfig, TestConfig };

