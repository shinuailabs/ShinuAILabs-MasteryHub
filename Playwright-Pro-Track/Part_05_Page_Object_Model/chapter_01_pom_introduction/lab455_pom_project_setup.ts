/**
 * Lab 455: POM Project Setup
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Setting up a POM project:
 *
 * - Project structure
 * - Configuration files
 * - Dependencies
 * - Initial setup
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Set up project structure
 * 2. Configure Playwright
 * 3. Create initial files
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Project Structure
/*
 * Recommended Project Structure:
 *
 * project/
 * ├── pages/
 * │   ├── index.ts
 * │   ├── base.page.ts
 * │   ├── home.page.ts
 * │   └── login.page.ts
 * ├── components/
 * │   ├── index.ts
 * │   ├── header.component.ts
 * │   └── footer.component.ts
 * ├── tests/
 * │   ├── home.spec.ts
 * │   └── login.spec.ts
 * ├── fixtures/
 * │   └── test.fixture.ts
 * ├── utils/
 * │   └── helpers.ts
 * ├── playwright.config.ts
 * ├── package.json
 * └── tsconfig.json
 */

// Solution 2: Package.json Setup
/*
 * {
 *   "name": "playwright-pom-project",
 *   "version": "1.0.0",
 *   "scripts": {
 *     "test": "playwright test",
 *     "test:headed": "playwright test --headed",
 *     "test:debug": "playwright test --debug",
 *     "report": "playwright show-report"
 *   },
 *   "devDependencies": {
 *     "@playwright/test": "^1.40.0",
 *     "typescript": "^5.0.0"
 *   }
 * }
 */

// Solution 3: TypeScript Config
/*
 * tsconfig.json:
 * {
 *   "compilerOptions": {
 *     "target": "ES2020",
 *     "module": "commonjs",
 *     "strict": true,
 *     "esModuleInterop": true,
 *     "skipLibCheck": true,
 *     "forceConsistentCasingInFileNames": true,
 *     "outDir": "./dist",
 *     "rootDir": "./"
 *   },
 *   "include": ["**/*.ts"],
 *   "exclude": ["node_modules"]
 * }
 */

// Solution 4: Playwright Config
/*
 * playwright.config.ts:
 *
 * import { defineConfig } from '@playwright/test';
 *
 * export default defineConfig({
 *   testDir: './tests',
 *   timeout: 30000,
 *   retries: 1,
 *   use: {
 *     baseURL: 'https://example.com',
 *     screenshot: 'only-on-failure',
 *     trace: 'on-first-retry',
 *   },
 *   projects: [
 *     { name: 'chromium', use: { browserName: 'chromium' } },
 *     { name: 'firefox', use: { browserName: 'firefox' } },
 *   ],
 * });
 */

// Solution 5: Base Page Class
import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string) {
        await this.page.goto(path);
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}

// Solution 6: Example Page Class
export class HomePage extends BasePage {
    readonly logo: Locator;
    readonly heading: Locator;

    constructor(page: Page) {
        super(page);
        this.logo = page.locator('.logo');
        this.heading = page.locator('h1');
    }

    async navigate() {
        await super.navigate('/');
    }

    async getHeadingText() {
        return await this.heading.textContent();
    }
}

// Solution 7: Pages Index File
/*
 * pages/index.ts:
 *
 * export { BasePage } from './base.page';
 * export { HomePage } from './home.page';
 * export { LoginPage } from './login.page';
 */

// Solution 8: Test File Example
/*
 * tests/home.spec.ts:
 *
 * import { test, expect } from '@playwright/test';
 * import { HomePage } from '../pages';
 *
 * test('home page loads', async ({ page }) => {
 *   const homePage = new HomePage(page);
 *   await homePage.navigate();
 *   await expect(homePage.heading).toBeVisible();
 * });
 */

// Solution 9: Setup Commands
/*
 * Initial Setup Commands:
 *
 * 1. Create project:
 *    npm init -y
 *
 * 2. Install Playwright:
 *    npm install -D @playwright/test
 *
 * 3. Install browsers:
 *    npx playwright install
 *
 * 4. Create folders:
 *    mkdir pages components tests fixtures utils
 *
 * 5. Run tests:
 *    npx playwright test
 */

// Solution 10: Project Setup Best Practices
/*
 * Best Practices:
 *
 * 1. Use TypeScript for type safety
 * 2. Organize files by feature
 * 3. Create index files for exports
 * 4. Configure proper timeouts
 * 5. Set up CI/CD integration
 * 6. Use environment variables
 * 7. Add proper .gitignore
 */
