/**
 * Lab 548: Cucumber Setup
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Setting up Cucumber with Playwright:
 * 
 * - Installation
 * - Configuration
 * - Project structure
 * - Running tests
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Install dependencies
 * 2. Configure cucumber
 * 3. Set up project structure
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Package.json dependencies
/*
{
  "devDependencies": {
    "@cucumber/cucumber": "^10.0.0",
    "@playwright/test": "^1.40.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "test:cucumber": "cucumber-js --require-module ts-node/register"
  }
}
*/

// Solution 2: cucumber.js configuration
export const cucumberConfig = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['features/step_definitions/**/*.ts'],
        format: [
            'progress-bar',
            'html:reports/cucumber-report.html',
            'json:reports/cucumber-report.json',
        ],
        formatOptions: {
            snippetInterface: 'async-await',
        },
        paths: ['features/**/*.feature'],
        publishQuiet: true,
    },
};

// Solution 3: Project Structure
/*
project/
├── features/
│   ├── login.feature
│   ├── checkout.feature
│   └── step_definitions/
│       ├── login.steps.ts
│       ├── checkout.steps.ts
│       └── common.steps.ts
├── support/
│   ├── world.ts
│   ├── hooks.ts
│   └── playwright.ts
├── reports/
├── cucumber.js
├── tsconfig.json
└── package.json
*/

// Solution 4: TypeScript Configuration
/*
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./",
    "resolveJsonModule": true
  },
  "include": ["features/**/*", "support/**/*"],
  "exclude": ["node_modules"]
}
*/

// Solution 5: World Class
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page, BrowserContext, chromium } from '@playwright/test';

export interface CustomWorld extends World {
    browser: Browser;
    context: BrowserContext;
    page: Page;
}

class PlaywrightWorld extends World implements CustomWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    
    constructor(options: IWorldOptions) {
        super(options);
    }
    
    async init() {
        this.browser = await chromium.launch({ headless: true });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }
    
    async cleanup() {
        await this.page?.close();
        await this.context?.close();
        await this.browser?.close();
    }
}

setWorldConstructor(PlaywrightWorld);

// Solution 6: Running Tests
/*
Commands:
  npm run test:cucumber                    # Run all tests
  npm run test:cucumber -- --tags @smoke   # Run tagged tests
  npm run test:cucumber -- features/login.feature  # Run specific feature
*/

// Solution 7: Export
export { PlaywrightWorld, cucumberConfig };

