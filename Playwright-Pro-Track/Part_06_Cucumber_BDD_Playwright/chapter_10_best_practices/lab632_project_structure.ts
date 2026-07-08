/**
 * Lab 632: Project Structure Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Organizing Cucumber projects:
 * 
 * - Folder structure
 * - File naming
 * - Module organization
 * - Configuration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Set up project structure
 * 2. Organize files
 * 3. Configure properly
 *
 * =====================
 * SOLUTION:
 * =====================
 */

/*
 * Best Practice 1: Recommended Project Structure
 * 
 * project/
 * ├── features/                    # Feature files
 * │   ├── authentication/
 * │   │   ├── login.feature
 * │   │   └── registration.feature
 * │   ├── checkout/
 * │   │   ├── cart.feature
 * │   │   └── payment.feature
 * │   └── user/
 * │       └── profile.feature
 * │
 * ├── step_definitions/            # Step definitions
 * │   ├── common/
 * │   │   ├── navigation.steps.ts
 * │   │   ├── forms.steps.ts
 * │   │   └── assertions.steps.ts
 * │   ├── authentication/
 * │   │   └── login.steps.ts
 * │   └── checkout/
 * │       └── cart.steps.ts
 * │
 * ├── pages/                       # Page Objects
 * │   ├── BasePage.ts
 * │   ├── LoginPage.ts
 * │   ├── DashboardPage.ts
 * │   └── index.ts
 * │
 * ├── support/                     # Support files
 * │   ├── hooks.ts
 * │   ├── world.ts
 * │   ├── config.ts
 * │   └── helpers/
 * │       ├── api.ts
 * │       └── data.ts
 * │
 * ├── fixtures/                    # Test data
 * │   ├── users.json
 * │   └── products.json
 * │
 * ├── reports/                     # Generated reports
 * │   └── .gitkeep
 * │
 * ├── .auth/                       # Auth state files
 * │   └── .gitkeep
 * │
 * ├── cucumber.js                  # Cucumber config
 * ├── tsconfig.json
 * ├── package.json
 * └── README.md
 */

/*
 * Best Practice 2: Cucumber Configuration
 */
// cucumber.js
const cucumberConfig = {
    default: {
        require: [
            'step_definitions/**/*.ts',
            'support/**/*.ts',
        ],
        requireModule: ['ts-node/register'],
        format: [
            'progress-bar',
            'html:reports/cucumber-report.html',
            'json:reports/cucumber-report.json',
        ],
        formatOptions: {
            snippetInterface: 'async-await',
        },
        publishQuiet: true,
    },
    
    // Profile for CI
    ci: {
        require: [
            'step_definitions/**/*.ts',
            'support/**/*.ts',
        ],
        requireModule: ['ts-node/register'],
        format: [
            'progress',
            'json:reports/cucumber-report.json',
            'junit:reports/junit-report.xml',
        ],
        parallel: 4,
        retry: 1,
        tags: 'not @skip and not @wip',
    },
    
    // Profile for smoke tests
    smoke: {
        require: [
            'step_definitions/**/*.ts',
            'support/**/*.ts',
        ],
        requireModule: ['ts-node/register'],
        format: ['progress'],
        tags: '@smoke',
    },
};

/*
 * Best Practice 3: TypeScript Configuration
 */
// tsconfig.json
const tsConfig = {
    compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        outDir: './dist',
        rootDir: './',
        resolveJsonModule: true,
        declaration: true,
    },
    include: [
        'step_definitions/**/*',
        'support/**/*',
        'pages/**/*',
    ],
    exclude: ['node_modules', 'dist', 'reports'],
};

/*
 * Best Practice 4: Package.json Scripts
 */
const packageScripts = {
    scripts: {
        test: 'cucumber-js',
        'test:ci': 'cucumber-js --profile ci',
        'test:smoke': 'cucumber-js --profile smoke',
        'test:parallel': 'cucumber-js --parallel 4',
        'test:tags': 'cucumber-js --tags',
        'report:open': 'open reports/cucumber-report.html',
        lint: 'eslint . --ext .ts',
        'lint:fix': 'eslint . --ext .ts --fix',
    },
};

/*
 * Best Practice 5: Environment Configuration
 */
// .env.example
const envExample = `
# Application
BASE_URL=http://localhost:3000
TEST_ENV=local

# Browser
BROWSER=chromium
HEADLESS=true

# Timeouts
DEFAULT_TIMEOUT=30000

# Parallel
PARALLEL_WORKERS=4

# Reporting
ENABLE_SCREENSHOTS=true
ENABLE_VIDEOS=false
ENABLE_TRACES=false
`;

// Export
export { cucumberConfig, tsConfig, packageScripts, envExample };

