/**
 * Lab 636: Comprehensive Best Practices Checklist
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Complete checklist for Cucumber BDD:
 * 
 * - Feature writing
 * - Step definitions
 * - Project setup
 * - CI/CD
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Review checklist
 * 2. Apply to project
 * 3. Validate compliance
 *
 * =====================
 * SOLUTION:
 * =====================
 */

/*
 * ========================================
 * CUCUMBER BDD BEST PRACTICES CHECKLIST
 * ========================================
 */

const bestPracticesChecklist = {
    featureFiles: {
        title: 'Feature File Best Practices',
        items: [
            '✅ Use business language, not technical jargon',
            '✅ Write clear, descriptive feature descriptions',
            '✅ Keep scenarios focused on single behavior',
            '✅ Use Background for common setup steps',
            '✅ Use Scenario Outline for data-driven tests',
            '✅ Organize features by business domain',
            '✅ Use meaningful tags for filtering',
            '✅ Avoid implementation details in steps',
            '✅ Keep scenarios independent',
            '✅ Limit scenarios to 5-10 steps',
        ],
    },
    
    stepDefinitions: {
        title: 'Step Definition Best Practices',
        items: [
            '✅ Create reusable, parameterized steps',
            '✅ Use Cucumber expressions over regex',
            '✅ Keep step definitions thin (delegate to helpers)',
            '✅ Organize steps by domain/feature',
            '✅ Use async/await properly',
            '✅ Handle errors gracefully',
            '✅ Avoid hardcoded waits',
            '✅ Use data tables for complex data',
            '✅ Document complex steps',
            '✅ Follow single responsibility principle',
        ],
    },
    
    pageObjects: {
        title: 'Page Object Best Practices',
        items: [
            '✅ Keep locators private',
            '✅ Expose actions as public methods',
            '✅ Use data-testid attributes',
            '✅ Return page objects for navigation',
            '✅ Implement base page class',
            '✅ Use meaningful method names',
            '✅ Handle dynamic elements properly',
            '✅ Avoid assertions in page objects',
            '✅ Use composition over inheritance',
            '✅ Keep page objects focused',
        ],
    },
    
    hooks: {
        title: 'Hooks Best Practices',
        items: [
            '✅ Use BeforeAll/AfterAll for global setup',
            '✅ Use Before/After for scenario setup',
            '✅ Use tagged hooks for specific scenarios',
            '✅ Capture screenshots on failure',
            '✅ Clean up resources in After hooks',
            '✅ Log useful debugging information',
            '✅ Handle errors in hooks',
            '✅ Keep hooks focused and simple',
            '✅ Order hooks appropriately',
            '✅ Use AfterStep sparingly',
        ],
    },
    
    testData: {
        title: 'Test Data Best Practices',
        items: [
            '✅ Use fixtures for static data',
            '✅ Generate unique data for isolation',
            '✅ Use builder pattern for complex objects',
            '✅ Clean up created data after tests',
            '✅ Use environment-specific data',
            '✅ Protect sensitive data',
            '✅ Use data registry for tracking',
            '✅ Seed data before test runs',
            '✅ Isolate data between workers',
            '✅ Version control test data',
        ],
    },
    
    parallelExecution: {
        title: 'Parallel Execution Best Practices',
        items: [
            '✅ Ensure test isolation',
            '✅ Use unique data per worker',
            '✅ Avoid shared mutable state',
            '✅ Use database transactions',
            '✅ Lock shared resources',
            '✅ Configure appropriate worker count',
            '✅ Handle flaky tests with retry',
            '✅ Use sharding for large suites',
            '✅ Monitor resource usage',
            '✅ Aggregate results properly',
        ],
    },
    
    cicd: {
        title: 'CI/CD Best Practices',
        items: [
            '✅ Run tests on every PR',
            '✅ Use appropriate test selection',
            '✅ Configure retries for flaky tests',
            '✅ Archive test artifacts',
            '✅ Generate JUnit reports',
            '✅ Set appropriate timeouts',
            '✅ Use caching for dependencies',
            '✅ Notify on failures',
            '✅ Run nightly full suites',
            '✅ Monitor test trends',
        ],
    },
    
    debugging: {
        title: 'Debugging Best Practices',
        items: [
            '✅ Use Playwright Inspector (PWDEBUG=1)',
            '✅ Capture screenshots on failure',
            '✅ Log console messages',
            '✅ Record traces for failures',
            '✅ Use meaningful error messages',
            '✅ Add debug tags for verbose output',
            '✅ Use page.pause() for breakpoints',
            '✅ Log network requests',
            '✅ Capture page HTML on failure',
            '✅ Use step-by-step screenshots',
        ],
    },
    
    reporting: {
        title: 'Reporting Best Practices',
        items: [
            '✅ Generate HTML reports',
            '✅ Generate JSON for processing',
            '✅ Generate JUnit for CI',
            '✅ Include screenshots in reports',
            '✅ Include environment info',
            '✅ Track test history',
            '✅ Categorize failures',
            '✅ Generate trend reports',
            '✅ Archive reports appropriately',
            '✅ Make reports accessible',
        ],
    },
};

/*
 * Validation Function
 */
function validateProject(projectPath: string): { passed: string[]; failed: string[] } {
    const passed: string[] = [];
    const failed: string[] = [];
    
    // Check for required files
    const requiredFiles = [
        'cucumber.js',
        'tsconfig.json',
        'package.json',
        'features/',
        'step_definitions/',
        'support/hooks.ts',
        'support/world.ts',
    ];
    
    // In real implementation, check file existence
    // For demo, just return the checklist
    
    return { passed, failed };
}

// Export
export { bestPracticesChecklist, validateProject };

