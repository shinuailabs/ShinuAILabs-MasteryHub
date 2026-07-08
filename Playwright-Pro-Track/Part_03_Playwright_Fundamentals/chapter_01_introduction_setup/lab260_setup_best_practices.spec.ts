/**
 * Lab 260: Setup Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for Playwright setup:
 * 
 * - Project organization
 * - Configuration tips
 * - Common patterns
 * - Avoiding pitfalls
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Organize project properly
 * 3. Configure optimally
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Use Descriptive Test Names
test.describe('User Authentication', () => {
    test('should login with valid credentials', async ({ page }) => {
        // Clear, descriptive name
    });
    
    test('should show error for invalid password', async ({ page }) => {
        // Describes expected behavior
    });
    
    test('should redirect to dashboard after login', async ({ page }) => {
        // Includes expected outcome
    });
});

// Solution 2: Group Related Tests
test.describe('Product Catalog', () => {
    test.describe('Listing', () => {
        test('should display products', async ({ page }) => {});
        test('should paginate results', async ({ page }) => {});
    });
    
    test.describe('Filtering', () => {
        test('should filter by category', async ({ page }) => {});
        test('should filter by price', async ({ page }) => {});
    });
});

// Solution 3: Use beforeEach for Common Setup
test.describe('Dashboard Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Common setup for all tests
        await page.goto('https://playwright.dev');
    });
    
    test('test 1', async ({ page }) => {
        // Already on the page
    });
    
    test('test 2', async ({ page }) => {
        // Already on the page
    });
});

// Solution 4: Use test.use() for Configuration
test.describe('Mobile Tests', () => {
    test.use({
        viewport: { width: 375, height: 667 },
        isMobile: true,
    });
    
    test('mobile layout', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

// Solution 5: Avoid Hard-Coded Values
const CONFIG = {
    baseUrl: process.env.BASE_URL || 'https://playwright.dev',
    timeout: 30000,
};

test('using config', async ({ page }) => {
    await page.goto(CONFIG.baseUrl);
});

// Solution 6: Use Meaningful Assertions
test('meaningful assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Good: Specific assertions
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.locator('h1')).toBeVisible();
    
    // Avoid: Generic assertions
    // expect(true).toBe(true);
});

// Solution 7: Keep Tests Independent
test.describe('Independent Tests', () => {
    // Each test should be able to run alone
    
    test('test A - no dependencies', async ({ page }) => {
        await page.goto('https://playwright.dev');
        // Complete test, doesn't depend on test B
    });
    
    test('test B - no dependencies', async ({ page }) => {
        await page.goto('https://playwright.dev');
        // Complete test, doesn't depend on test A
    });
});

// Solution 8: Use Tags for Organization
test('smoke test @smoke', async ({ page }) => {
    await page.goto('https://playwright.dev');
});

test('regression test @regression', async ({ page }) => {
    await page.goto('https://playwright.dev');
});

// Run with: npx playwright test --grep @smoke

// Solution 9: Handle Test Data Properly
test.describe('Test Data Management', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
    };
    
    test('using test data', async ({ page }) => {
        // Use test data object
        console.log('Testing with:', testUser.email);
    });
});

// Solution 10: Best Practices Summary
/*
 * Setup Best Practices:
 * 
 * 1. Use descriptive test names
 * 2. Group related tests with describe
 * 3. Use beforeEach for common setup
 * 4. Keep tests independent
 * 5. Use configuration for values
 * 6. Add meaningful assertions
 * 7. Use tags for test organization
 * 8. Handle test data properly
 * 9. Use Page Object Model for complex apps
 * 10. Configure CI/CD appropriately
 * 
 * Avoid:
 * - Hard-coded values
 * - Test dependencies
 * - Flaky selectors
 * - Missing assertions
 * - Overly long tests
 */

test('following best practices', async ({ page }) => {
    // Arrange
    await page.goto('https://playwright.dev');
    
    // Act
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Assert
    await expect(page).toHaveURL(/.*intro/);
});

