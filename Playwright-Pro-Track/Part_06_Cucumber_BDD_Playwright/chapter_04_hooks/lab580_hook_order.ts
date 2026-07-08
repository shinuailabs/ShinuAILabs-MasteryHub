/**
 * Lab 580: Hook Order
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding hook execution order:
 * 
 * - Order property
 * - Execution sequence
 * - Dependencies
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Control hook order
 * 2. Manage dependencies
 * 3. Understand sequence
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, BeforeAll, AfterAll, BeforeStep, AfterStep } from '@cucumber/cucumber';

/*
 * Hook Execution Order:
 * 
 * 1. BeforeAll (once, before all scenarios)
 * 2. Before (before each scenario, lower order first)
 * 3. BeforeStep (before each step)
 * 4. Step execution
 * 5. AfterStep (after each step)
 * 6. After (after each scenario, higher order first)
 * 7. AfterAll (once, after all scenarios)
 */

// Solution 1: BeforeAll - Runs First
BeforeAll({ order: 1 }, async function () {
    console.log('1. BeforeAll (order: 1) - Initialize browser');
});

BeforeAll({ order: 2 }, async function () {
    console.log('2. BeforeAll (order: 2) - Setup test data');
});

// Solution 2: Before Hooks - Lower Order Runs First
Before({ order: 1 }, async function () {
    console.log('3. Before (order: 1) - Create browser context');
    // This runs first - create context
});

Before({ order: 2 }, async function () {
    console.log('4. Before (order: 2) - Create page');
    // This runs second - create page (depends on context)
});

Before({ order: 3 }, async function () {
    console.log('5. Before (order: 3) - Navigate to app');
    // This runs third - navigate (depends on page)
});

Before({ order: 4 }, async function () {
    console.log('6. Before (order: 4) - Login if needed');
    // This runs fourth - login (depends on navigation)
});

// Solution 3: Tagged Before Hooks with Order
Before({ tags: '@database', order: 1 }, async function () {
    console.log('DB Before (order: 1) - Connect to database');
});

Before({ tags: '@database', order: 2 }, async function () {
    console.log('DB Before (order: 2) - Start transaction');
});

Before({ tags: '@database', order: 3 }, async function () {
    console.log('DB Before (order: 3) - Seed test data');
});

// Solution 4: BeforeStep
BeforeStep(async function () {
    console.log('  BeforeStep - Prepare for step');
});

// Solution 5: AfterStep
AfterStep(async function () {
    console.log('  AfterStep - Step completed');
});

// Solution 6: After Hooks - Higher Order Runs First
After({ order: 4 }, async function () {
    console.log('7. After (order: 4) - Logout');
    // This runs first - logout
});

After({ order: 3 }, async function () {
    console.log('8. After (order: 3) - Take screenshot');
    // This runs second - screenshot
});

After({ order: 2 }, async function () {
    console.log('9. After (order: 2) - Close page');
    // This runs third - close page
});

After({ order: 1 }, async function () {
    console.log('10. After (order: 1) - Close context');
    // This runs fourth - close context
});

// Solution 7: Tagged After Hooks with Order
After({ tags: '@database', order: 3 }, async function () {
    console.log('DB After (order: 3) - Cleanup test data');
});

After({ tags: '@database', order: 2 }, async function () {
    console.log('DB After (order: 2) - Rollback transaction');
});

After({ tags: '@database', order: 1 }, async function () {
    console.log('DB After (order: 1) - Close connection');
});

// Solution 8: AfterAll - Runs Last
AfterAll({ order: 2 }, async function () {
    console.log('11. AfterAll (order: 2) - Generate report');
});

AfterAll({ order: 1 }, async function () {
    console.log('12. AfterAll (order: 1) - Close browser');
});

/*
 * Complete Execution Order Example:
 * 
 * BeforeAll (order: 1) - Initialize browser
 * BeforeAll (order: 2) - Setup test data
 * 
 * --- Scenario 1 ---
 * Before (order: 1) - Create context
 * Before (order: 2) - Create page
 * Before (order: 3) - Navigate
 * Before (order: 4) - Login
 * 
 *   BeforeStep
 *   Given step
 *   AfterStep
 * 
 *   BeforeStep
 *   When step
 *   AfterStep
 * 
 *   BeforeStep
 *   Then step
 *   AfterStep
 * 
 * After (order: 4) - Logout
 * After (order: 3) - Screenshot
 * After (order: 2) - Close page
 * After (order: 1) - Close context
 * 
 * --- Scenario 2 ---
 * (same pattern)
 * 
 * AfterAll (order: 2) - Generate report
 * AfterAll (order: 1) - Close browser
 */

// Solution 9: Export
export {};

