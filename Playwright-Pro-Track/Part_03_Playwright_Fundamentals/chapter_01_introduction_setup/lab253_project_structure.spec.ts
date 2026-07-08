/**
 * Lab 253: Project Structure
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Organizing Playwright projects:
 * 
 * - Directory structure
 * - File naming conventions
 * - Test organization
 * - Configuration files
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand project structure
 * 2. Organize test files
 * 3. Configure project
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

/*
 * Solution 1: Recommended Project Structure
 * 
 * project-root/
 * ├── tests/
 * │   ├── e2e/
 * │   │   ├── auth/
 * │   │   │   ├── login.spec.ts
 * │   │   │   └── logout.spec.ts
 * │   │   ├── products/
 * │   │   │   ├── list.spec.ts
 * │   │   │   └── detail.spec.ts
 * │   │   └── checkout/
 * │   │       └── cart.spec.ts
 * │   └── api/
 * │       └── users.spec.ts
 * ├── pages/
 * │   ├── login.page.ts
 * │   └── home.page.ts
 * ├── fixtures/
 * │   └── test-data.json
 * ├── utils/
 * │   └── helpers.ts
 * ├── playwright.config.ts
 * └── package.json
 */

/*
 * Solution 2: File Naming Conventions
 * 
 * Test files: *.spec.ts or *.test.ts
 * Page objects: *.page.ts
 * Fixtures: *.fixture.ts
 * Utilities: *.util.ts or *.helper.ts
 * 
 * Examples:
 * - login.spec.ts
 * - LoginPage.page.ts
 * - auth.fixture.ts
 * - api.helper.ts
 */

// Solution 3: Test File Structure
test.describe('Feature: User Authentication', () => {
    test.describe('Login', () => {
        test('should login with valid credentials', async ({ page }) => {
            // Test implementation
        });
        
        test('should show error for invalid credentials', async ({ page }) => {
            // Test implementation
        });
    });
    
    test.describe('Logout', () => {
        test('should logout successfully', async ({ page }) => {
            // Test implementation
        });
    });
});

/*
 * Solution 4: Configuration Files
 * 
 * playwright.config.ts - Main configuration
 * tsconfig.json - TypeScript configuration
 * .env - Environment variables
 * .gitignore - Git ignore patterns
 */

/*
 * Solution 5: Test Data Organization
 * 
 * fixtures/
 * ├── users.json
 * ├── products.json
 * └── test-data/
 *     ├── valid-user.json
 *     └── invalid-user.json
 */

// Solution 6: Importing Test Data
test('using test data', async ({ page }) => {
    // Import test data
    const testData = {
        username: 'testuser',
        password: 'password123'
    };
    
    // Use in test
    await page.goto('https://example.com/login');
    // await page.fill('#username', testData.username);
});

/*
 * Solution 7: Utility Functions Location
 * 
 * utils/
 * ├── api.helper.ts      - API utilities
 * ├── date.helper.ts     - Date formatting
 * ├── random.helper.ts   - Random data generation
 * └── index.ts           - Barrel export
 */

/*
 * Solution 8: Environment-Specific Config
 * 
 * config/
 * ├── dev.config.ts
 * ├── staging.config.ts
 * └── prod.config.ts
 * 
 * Or use .env files:
 * .env.dev
 * .env.staging
 * .env.prod
 */

// Solution 9: Grouping Related Tests
test.describe('Product Catalog', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://example.com/products');
    });
    
    test('should display product list', async ({ page }) => {
        // Test implementation
    });
    
    test('should filter products', async ({ page }) => {
        // Test implementation
    });
    
    test('should sort products', async ({ page }) => {
        // Test implementation
    });
});

/*
 * Solution 10: Best Practices
 * 
 * 1. Group tests by feature/module
 * 2. Use descriptive file names
 * 3. Keep test files focused
 * 4. Separate test data from tests
 * 5. Use page objects for reusability
 * 6. Create utility functions for common tasks
 * 7. Use environment variables for config
 * 8. Document project structure in README
 */

