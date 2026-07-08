/**
 * Lab 945: Plain English Test Writing
 *
 * CONCEPT:
 * Write tests in plain English that anyone can understand. AI translates
 * these into executable Playwright tests, making test automation accessible
 * to the entire team.
 *
 * BULLET POINTS:
 * - Tests readable by non-developers
 * - Self-documenting test cases
 * - Easy to review and maintain
 * - Bridge business and technical
 * - Reduce test creation time
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Plain English test DSL
class PlainEnglishTest {
  private steps: (() => Promise<void>)[] = [];

  constructor(private page: Page) {}

  iAmOnThe(pageName: string): this {
    this.steps.push(async () => {
      const urls: Record<string, string> = {
        'login page': '/login',
        'home page': '/',
        'dashboard': '/dashboard',
        'profile page': '/profile',
      };
      await this.page.goto(urls[pageName.toLowerCase()] || `/${pageName}`);
    });
    return this;
  }

  iEnter(value: string): { into: (field: string) => PlainEnglishTest } {
    return {
      into: (field: string) => {
        this.steps.push(async () => {
          await this.page.getByLabel(field).or(this.page.getByPlaceholder(field)).fill(value);
        });
        return this;
      },
    };
  }

  iClickOn(element: string): this {
    this.steps.push(async () => {
      await this.page.getByRole('button', { name: element })
        .or(this.page.getByRole('link', { name: element }))
        .or(this.page.getByText(element))
        .click();
    });
    return this;
  }

  iShouldSee(text: string): this {
    this.steps.push(async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
    return this;
  }

  iShouldBeOnThe(pageName: string): this {
    this.steps.push(async () => {
      const urls: Record<string, string> = {
        'dashboard': '/dashboard',
        'home page': '/',
        'login page': '/login',
      };
      await expect(this.page).toHaveURL(new RegExp(urls[pageName.toLowerCase()] || pageName));
    });
    return this;
  }

  async run(): Promise<void> {
    for (const step of this.steps) {
      await step();
    }
  }
}

// Example 2: Using plain English tests
test.describe('Plain English Tests', () => {
  test('user can login successfully', async ({ page }) => {
    const testCase = new PlainEnglishTest(page);

    await testCase
      .iAmOnThe('login page')
      .iEnter('user@example.com').into('Email')
      .iEnter('password123').into('Password')
      .iClickOn('Log in')
      .iShouldBeOnThe('dashboard')
      .iShouldSee('Welcome')
      .run();
  });

  test('user sees error for invalid login', async ({ page }) => {
    const testCase = new PlainEnglishTest(page);

    await testCase
      .iAmOnThe('login page')
      .iEnter('wrong@example.com').into('Email')
      .iEnter('wrongpassword').into('Password')
      .iClickOn('Log in')
      .iShouldSee('Invalid credentials')
      .run();
  });
});

// Example 3: Test case from plain text
function parseTestCase(description: string): string[] {
  return description
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

const loginTestDescription = `
  I am on the login page
  I enter "user@example.com" into Email
  I enter "password123" into Password
  I click on Log in
  I should be on the dashboard
  I should see Welcome
`;

// Example 4: Test template for business users
const testTemplate = `
Test: {{testName}}
Description: {{description}}

Steps:
1. I am on the {{startPage}}
2. I {{action1}}
3. I {{action2}}
4. I should see {{expectedResult}}

Test Data:
- {{dataField1}}: {{dataValue1}}
- {{dataField2}}: {{dataValue2}}
`;

// Example 5: Convert template to executable test
function templateToTest(template: string, data: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

/**
 * EXERCISE:
 * 1. Write a test in plain English
 * 2. Use the PlainEnglishTest class
 * 3. Create templates for common scenarios
 * 4. Share with non-technical team members
 *
 * LEARNING:
 * - Plain English improves collaboration
 * - DSLs make tests readable
 * - Templates standardize test writing
 * - Anyone can write tests
 *
 * ONE LINER:
 * "If you can describe it in English, you can test it - AI handles the code."
 */

export { PlainEnglishTest, parseTestCase, templateToTest };

