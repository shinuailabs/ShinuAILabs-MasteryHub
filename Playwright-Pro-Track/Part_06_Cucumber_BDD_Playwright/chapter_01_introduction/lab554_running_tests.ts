/**
 * Lab 554: Running Cucumber Tests
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Running and configuring tests:
 * 
 * - Command line options
 * - Configuration file
 * - Parallel execution
 * - Filtering tests
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Run tests from CLI
 * 2. Configure options
 * 3. Filter by tags
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Commands
/*
# Run all tests
npx cucumber-js

# Run specific feature file
npx cucumber-js features/login.feature

# Run specific scenario by line number
npx cucumber-js features/login.feature:10

# Run with specific configuration
npx cucumber-js --config cucumber.js
*/

// Solution 2: Tag Filtering
/*
# Run scenarios with specific tag
npx cucumber-js --tags "@smoke"

# Run scenarios with multiple tags (AND)
npx cucumber-js --tags "@smoke and @login"

# Run scenarios with either tag (OR)
npx cucumber-js --tags "@smoke or @regression"

# Exclude scenarios with tag
npx cucumber-js --tags "not @wip"

# Complex tag expressions
npx cucumber-js --tags "(@smoke or @regression) and not @skip"
*/

// Solution 3: Configuration File (cucumber.js)
const config = {
    default: {
        // Feature files location
        paths: ['features/**/*.feature'],
        
        // Step definitions location
        require: ['features/step_definitions/**/*.ts'],
        
        // TypeScript support
        requireModule: ['ts-node/register'],
        
        // Output format
        format: [
            'progress-bar',
            'html:reports/cucumber-report.html',
            'json:reports/cucumber-report.json',
        ],
        
        // Format options
        formatOptions: {
            snippetInterface: 'async-await',
            snippetSyntax: './snippets-syntax.js',
        },
        
        // Parallel execution
        parallel: 4,
        
        // Fail fast
        failFast: false,
        
        // Strict mode
        strict: true,
        
        // Dry run
        dryRun: false,
        
        // Retry failed scenarios
        retry: 2,
        retryTagFilter: '@flaky',
        
        // Publish results
        publishQuiet: true,
    },
    
    // Profile for CI
    ci: {
        paths: ['features/**/*.feature'],
        require: ['features/step_definitions/**/*.ts'],
        requireModule: ['ts-node/register'],
        format: ['json:reports/cucumber-report.json'],
        parallel: 8,
        failFast: true,
        tags: 'not @wip',
    },
    
    // Profile for smoke tests
    smoke: {
        paths: ['features/**/*.feature'],
        require: ['features/step_definitions/**/*.ts'],
        requireModule: ['ts-node/register'],
        format: ['progress-bar'],
        tags: '@smoke',
    },
};

// Solution 4: Environment Variables
/*
# Set environment variables
BASE_URL=https://staging.example.com npx cucumber-js

# Use .env file with dotenv
require('dotenv').config();
*/

// Solution 5: NPM Scripts (package.json)
const packageScripts = {
    scripts: {
        'test': 'cucumber-js',
        'test:smoke': 'cucumber-js --tags @smoke',
        'test:regression': 'cucumber-js --tags @regression',
        'test:ci': 'cucumber-js --config cucumber.js --profile ci',
        'test:parallel': 'cucumber-js --parallel 4',
        'test:report': 'cucumber-js --format html:reports/report.html',
    },
};

// Solution 6: Programmatic Execution
import { Cli } from '@cucumber/cucumber';

async function runCucumber() {
    const cli = new Cli({
        argv: [
            'node',
            'cucumber-js',
            '--require', 'features/step_definitions/**/*.ts',
            '--format', 'progress-bar',
            'features/**/*.feature',
        ],
        cwd: process.cwd(),
        stdout: process.stdout,
    });
    
    const result = await cli.run();
    process.exit(result.success ? 0 : 1);
}

// Solution 7: Export
export { config, packageScripts, runCucumber };

