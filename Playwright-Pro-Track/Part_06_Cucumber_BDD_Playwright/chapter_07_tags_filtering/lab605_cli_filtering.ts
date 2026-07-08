/**
 * Lab 605: CLI Tag Filtering
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Filtering tests via CLI:
 * 
 * - Command line options
 * - Profile-based filtering
 * - Environment variables
 * - CI/CD integration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use CLI tag options
 * 2. Create profiles
 * 3. Integrate with CI/CD
 *
 * =====================
 * SOLUTION:
 * =====================
 */

/**
 * CLI Tag Filtering Examples
 * 
 * Basic syntax: npx cucumber-js --tags "<expression>"
 */

// Solution 1: Basic CLI Commands
const cliExamples = {
    // Run smoke tests
    smoke: 'npx cucumber-js --tags "@smoke"',
    
    // Run regression tests
    regression: 'npx cucumber-js --tags "@regression"',
    
    // Run critical tests only
    critical: 'npx cucumber-js --tags "@critical or @p1"',
    
    // Exclude WIP and skip
    excludeWip: 'npx cucumber-js --tags "not @wip and not @skip"',
    
    // Run smoke but not slow
    smokeNotSlow: 'npx cucumber-js --tags "@smoke and not @slow"',
    
    // Run specific feature
    loginFeature: 'npx cucumber-js --tags "@feature:login"',
    
    // Complex expression
    complex: 'npx cucumber-js --tags "(@smoke or @regression) and not @flaky"',
};

// Solution 2: Package.json Scripts
const packageJsonScripts = {
    scripts: {
        'test': 'cucumber-js',
        'test:smoke': 'cucumber-js --tags "@smoke"',
        'test:regression': 'cucumber-js --tags "@regression and not @skip"',
        'test:critical': 'cucumber-js --tags "@critical or @p1"',
        'test:staging': 'cucumber-js --tags "@staging-only or (not @production)"',
        'test:production': 'cucumber-js --tags "@production and @smoke"',
        'test:ci': 'cucumber-js --tags "(@smoke or @regression) and not @flaky"',
        'test:feature': 'cucumber-js --tags "@feature:$npm_config_feature"',
    },
};

// Solution 3: Cucumber Configuration Profiles
// cucumber.js configuration file
const cucumberConfig = {
    default: {
        require: ['./step_definitions/**/*.ts'],
        format: ['progress', 'html:reports/cucumber-report.html'],
        tags: 'not @skip and not @wip',
    },
    smoke: {
        require: ['./step_definitions/**/*.ts'],
        format: ['progress'],
        tags: '@smoke',
    },
    regression: {
        require: ['./step_definitions/**/*.ts'],
        format: ['progress', 'html:reports/regression-report.html'],
        tags: '@regression and not @skip',
    },
    ci: {
        require: ['./step_definitions/**/*.ts'],
        format: ['progress', 'json:reports/cucumber-report.json'],
        tags: '(@smoke or @regression) and not @flaky and not @skip',
        parallel: 4,
    },
};

// Solution 4: Environment Variable Based Filtering
function getTagsFromEnv(): string {
    const env = process.env.TEST_ENV || 'local';
    const tags = process.env.CUCUMBER_TAGS;
    
    if (tags) {
        return tags;
    }
    
    const envTags: Record<string, string> = {
        local: 'not @ci-only',
        ci: '@smoke or @regression',
        staging: '@staging-only or (@smoke and not @production)',
        production: '@production and @smoke',
    };
    
    return envTags[env] || '@smoke';
}

// Solution 5: Dynamic Tag Generation
function generateTags(options: {
    types?: string[];
    priorities?: string[];
    exclude?: string[];
    features?: string[];
}): string {
    const parts: string[] = [];
    
    // Include test types
    if (options.types?.length) {
        const typeExpr = options.types.map(t => `@${t}`).join(' or ');
        parts.push(`(${typeExpr})`);
    }
    
    // Include priorities
    if (options.priorities?.length) {
        const prioExpr = options.priorities.map(p => `@${p}`).join(' or ');
        parts.push(`(${prioExpr})`);
    }
    
    // Include features
    if (options.features?.length) {
        const featExpr = options.features.map(f => `@feature:${f}`).join(' or ');
        parts.push(`(${featExpr})`);
    }
    
    // Build include expression
    let expression = parts.join(' and ');
    
    // Add exclusions
    if (options.exclude?.length) {
        const excludeExpr = options.exclude.map(e => `not @${e}`).join(' and ');
        expression = expression ? `(${expression}) and ${excludeExpr}` : excludeExpr;
    }
    
    return expression || 'not @skip';
}

// Usage
const tags = generateTags({
    types: ['smoke', 'regression'],
    priorities: ['p1', 'p2'],
    exclude: ['skip', 'wip', 'flaky'],
});
// Result: "(@smoke or @regression) and (@p1 or @p2) and not @skip and not @wip and not @flaky"

// Solution 6: CI/CD Pipeline Examples
const ciPipelineExamples = {
    // GitHub Actions
    githubActions: `
    - name: Run Smoke Tests
      run: npm run test:smoke
      
    - name: Run Regression Tests
      run: npm run test:regression
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    `,
    
    // Jenkins
    jenkins: `
    stage('Smoke Tests') {
        sh 'npm run test:smoke'
    }
    stage('Regression Tests') {
        when { branch 'main' }
        sh 'npm run test:regression'
    }
    `,
};

// Solution 7: Export
export { 
    cliExamples, 
    cucumberConfig, 
    getTagsFromEnv, 
    generateTags 
};

