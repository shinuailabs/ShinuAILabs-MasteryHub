/**
 * Lab 578: Tagged Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using tagged hooks effectively:
 * 
 * - Tag expressions
 * - AND/OR/NOT logic
 * - Conditional execution
 * - Hook organization
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create tagged hooks
 * 2. Use tag expressions
 * 3. Organize hooks
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After } from '@cucumber/cucumber';

// Solution 1: Single Tag
Before({ tags: '@smoke' }, async function () {
    console.log('Running smoke test setup');
    this.testType = 'smoke';
});

// Solution 2: AND Expression (both tags required)
Before({ tags: '@smoke and @critical' }, async function () {
    console.log('Running critical smoke test');
    this.priority = 'critical';
    this.notifyOnFailure = true;
});

// Solution 3: OR Expression (either tag)
Before({ tags: '@api or @integration' }, async function () {
    console.log('Setting up API/Integration test');
    this.apiBaseUrl = process.env.API_URL || 'http://localhost:3000';
});

// Solution 4: NOT Expression (exclude tag)
Before({ tags: 'not @wip' }, async function () {
    // Runs for all scenarios except work-in-progress
    this.isProductionReady = true;
});

// Solution 5: Complex Expression
Before({ tags: '(@smoke or @regression) and not @flaky' }, async function () {
    // Runs for smoke OR regression tests, but NOT flaky ones
    console.log('Running stable test');
    this.isStable = true;
});

// Solution 6: Environment-Specific Tags
Before({ tags: '@staging' }, async function () {
    this.environment = 'staging';
    this.baseUrl = 'https://staging.example.com';
});

Before({ tags: '@production' }, async function () {
    this.environment = 'production';
    this.baseUrl = 'https://www.example.com';
    this.readOnly = true; // Don't modify production data
});

// Solution 7: Browser-Specific Tags
Before({ tags: '@chrome' }, async function () {
    // Chrome-specific setup
    this.browserName = 'chromium';
});

Before({ tags: '@firefox' }, async function () {
    // Firefox-specific setup
    this.browserName = 'firefox';
});

Before({ tags: '@webkit' }, async function () {
    // Safari/WebKit-specific setup
    this.browserName = 'webkit';
});

// Solution 8: Feature-Specific Tags
Before({ tags: '@auth' }, async function () {
    // Authentication feature setup
    this.authConfig = {
        loginUrl: '/login',
        logoutUrl: '/logout',
        sessionTimeout: 3600,
    };
});

Before({ tags: '@payment' }, async function () {
    // Payment feature setup
    this.paymentConfig = {
        testCardNumber: '4111111111111111',
        testCVV: '123',
        testExpiry: '12/25',
    };
});

// Solution 9: Data Setup Tags
Before({ tags: '@needs-user' }, async function () {
    // Create test user
    this.testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPass123!',
    };
});

Before({ tags: '@needs-product' }, async function () {
    // Create test product
    this.testProduct = {
        name: `Test Product ${Date.now()}`,
        price: 99.99,
        sku: `SKU-${Date.now()}`,
    };
});

// Solution 10: Cleanup Tags
After({ tags: '@cleanup-user' }, async function () {
    if (this.testUser?.id) {
        // Delete test user
        console.log(`Cleaning up user: ${this.testUser.id}`);
    }
});

After({ tags: '@cleanup-product' }, async function () {
    if (this.testProduct?.id) {
        // Delete test product
        console.log(`Cleaning up product: ${this.testProduct.id}`);
    }
});

// Solution 11: Priority Tags
Before({ tags: '@p1', order: 1 }, async function () {
    this.priority = 'P1 - Critical';
});

Before({ tags: '@p2', order: 1 }, async function () {
    this.priority = 'P2 - High';
});

Before({ tags: '@p3', order: 1 }, async function () {
    this.priority = 'P3 - Medium';
});

// Solution 12: Skip Tags
Before({ tags: '@skip' }, async function () {
    // Mark scenario to be skipped
    return 'skipped';
});

Before({ tags: '@skip-ci' }, async function () {
    if (process.env.CI) {
        return 'skipped';
    }
});

// Solution 13: Export
export {};

