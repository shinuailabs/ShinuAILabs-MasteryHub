# Part 02: Cucumber Setup with Playwright

## 📚 Overview
Setting up Cucumber with Playwright enables BDD-style testing with powerful browser automation.

---

## 🎯 Key Concepts

### 1. Installation

```bash
# Create new project
mkdir cucumber-playwright
cd cucumber-playwright
npm init -y

# Install dependencies
npm install -D @cucumber/cucumber @playwright/test typescript ts-node

# Install Playwright browsers
npx playwright install
```

### 2. Project Structure

```
project/
├── features/
│   ├── login.feature
│   ├── cart.feature
│   └── checkout.feature
├── step-definitions/
│   ├── login.steps.ts
│   ├── cart.steps.ts
│   └── common.steps.ts
├── support/
│   ├── hooks.ts
│   ├── world.ts
│   └── pages/
│       ├── LoginPage.ts
│       └── DashboardPage.ts
├── cucumber.js
├── tsconfig.json
└── package.json
```

### 3. Cucumber Configuration

```javascript
// cucumber.js
module.exports = {
  default: {
    require: [
      'step-definitions/**/*.ts',
      'support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true
  }
};
```

### 4. TypeScript Configuration

```json
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
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. Custom World

```typescript
// support/world.ts
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export class CustomWorld extends World {
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

setWorldConstructor(CustomWorld);
```

### 6. Hooks

```typescript
// support/hooks.ts
import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

BeforeAll(async function() {
  console.log('Starting test suite');
});

Before(async function(this: CustomWorld) {
  await this.init();
});

After(async function(this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }
  await this.cleanup();
});

AfterAll(async function() {
  console.log('Test suite complete');
});
```

### 7. Package.json Scripts

```json
{
  "scripts": {
    "test": "cucumber-js",
    "test:tags": "cucumber-js --tags",
    "test:smoke": "cucumber-js --tags @smoke",
    "test:parallel": "cucumber-js --parallel 4",
    "report": "open reports/cucumber-report.html"
  }
}
```

### 8. First Feature File

```gherkin
# features/login.feature
Feature: User Login
  As a registered user
  I want to login to the application
  So that I can access my account

  Background:
    Given I am on the login page

  @smoke
  Scenario: Successful login with valid credentials
    When I enter email "user@example.com"
    And I enter password "password123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see welcome message "Welcome, User"

  @negative
  Scenario: Failed login with invalid credentials
    When I enter email "invalid@example.com"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see error message "Invalid credentials"
```

### 9. First Step Definitions

```typescript
// step-definitions/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the login page', async function(this: CustomWorld) {
  await this.page.goto('http://localhost:3000/login');
});

When('I enter email {string}', async function(this: CustomWorld, email: string) {
  await this.page.getByLabel('Email').fill(email);
});

When('I enter password {string}', async function(this: CustomWorld, password: string) {
  await this.page.getByLabel('Password').fill(password);
});

When('I click the login button', async function(this: CustomWorld) {
  await this.page.getByRole('button', { name: 'Login' }).click();
});

Then('I should be redirected to the dashboard', async function(this: CustomWorld) {
  await expect(this.page).toHaveURL(/dashboard/);
});

Then('I should see welcome message {string}', async function(this: CustomWorld, message: string) {
  await expect(this.page.locator('.welcome')).toContainText(message);
});

Then('I should see error message {string}', async function(this: CustomWorld, message: string) {
  await expect(this.page.locator('.error')).toContainText(message);
});
```

---

## 💻 Practice Exercises

1. Set up Cucumber project
2. Create custom world
3. Implement hooks
4. Write first feature
5. Create step definitions

---

## ✅ Best Practices

- ✅ Use TypeScript for type safety
- ✅ Implement custom world
- ✅ Add screenshot on failure
- ✅ Organize step definitions
- ❌ Don't mix step definitions
- ❌ Avoid hardcoded values

---

## 📝 Quick Reference

```bash
# Install
npm install -D @cucumber/cucumber @playwright/test typescript

# Run tests
npm test
npm run test:smoke
npm run test:parallel

# With tags
cucumber-js --tags "@smoke and not @wip"
```

