/**
 * Lab 938: AI Locator Generation
 *
 * CONCEPT:
 * AI can analyze page structure and automatically generate optimal locators
 * for elements. This speeds up test creation and ensures best practices
 * are followed.
 *
 * BULLET POINTS:
 * - Automatically generate locators from page
 * - Rank locators by stability
 * - Suggest data-testid additions
 * - Generate Page Object scaffolds
 * - Identify unique element attributes
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Example 1: Locator generator
interface GeneratedLocator {
  selector: string;
  type: 'testid' | 'role' | 'label' | 'text' | 'css' | 'xpath';
  stability: number; // 0-100
  uniqueness: boolean;
  recommendation: string;
}

async function generateLocators(
  page: Page,
  element: Locator
): Promise<GeneratedLocator[]> {
  const locators: GeneratedLocator[] = [];

  const attrs = await element.evaluate((el) => ({
    id: el.id,
    className: el.className,
    tagName: el.tagName.toLowerCase(),
    text: el.textContent?.trim().substring(0, 50),
    type: el.getAttribute('type'),
    name: el.getAttribute('name'),
    placeholder: el.getAttribute('placeholder'),
    ariaLabel: el.getAttribute('aria-label'),
    dataTestId: el.getAttribute('data-testid'),
    role: el.getAttribute('role') || el.tagName.toLowerCase(),
  }));

  // data-testid (most stable)
  if (attrs.dataTestId) {
    locators.push({
      selector: `[data-testid="${attrs.dataTestId}"]`,
      type: 'testid',
      stability: 95,
      uniqueness: true,
      recommendation: 'Best choice - stable and unique',
    });
  }

  // Role-based
  if (attrs.ariaLabel) {
    locators.push({
      selector: `role=${attrs.role}[name="${attrs.ariaLabel}"]`,
      type: 'role',
      stability: 85,
      uniqueness: true,
      recommendation: 'Good for accessibility',
    });
  }

  // Label-based
  if (attrs.placeholder) {
    locators.push({
      selector: `[placeholder="${attrs.placeholder}"]`,
      type: 'label',
      stability: 70,
      uniqueness: false,
      recommendation: 'May change with i18n',
    });
  }

  // Text-based
  if (attrs.text && attrs.text.length < 30) {
    locators.push({
      selector: `${attrs.tagName}:has-text("${attrs.text}")`,
      type: 'text',
      stability: 60,
      uniqueness: false,
      recommendation: 'Text may change',
    });
  }

  // CSS (least stable)
  if (attrs.className) {
    locators.push({
      selector: `${attrs.tagName}.${attrs.className.split(' ')[0]}`,
      type: 'css',
      stability: 40,
      uniqueness: false,
      recommendation: 'Classes may change - avoid if possible',
    });
  }

  return locators.sort((a, b) => b.stability - a.stability);
}

// Example 2: Page Object generator
interface PageObjectField {
  name: string;
  locator: string;
  type: 'input' | 'button' | 'link' | 'text' | 'other';
}

async function generatePageObject(
  page: Page,
  pageName: string
): Promise<string> {
  const interactiveElements = await page
    .locator('button, input, a, select, textarea')
    .all();

  const fields: PageObjectField[] = [];

  for (const element of interactiveElements.slice(0, 20)) {
    const attrs = await element.evaluate((el) => ({
      tagName: el.tagName.toLowerCase(),
      id: el.id,
      name: el.getAttribute('name'),
      type: el.getAttribute('type'),
      text: el.textContent?.trim().substring(0, 20),
      testId: el.getAttribute('data-testid'),
    }));

    const fieldName = attrs.testId || attrs.id || attrs.name || `element${fields.length}`;
    const locator = attrs.testId
      ? `[data-testid="${attrs.testId}"]`
      : attrs.id
        ? `#${attrs.id}`
        : `${attrs.tagName}:nth-of-type(${fields.length + 1})`;

    fields.push({
      name: toCamelCase(fieldName),
      locator,
      type: getElementType(attrs.tagName, attrs.type),
    });
  }

  return generatePageObjectCode(pageName, fields);
}

function toCamelCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

function getElementType(tag: string, type?: string | null): PageObjectField['type'] {
  if (tag === 'button' || type === 'submit') return 'button';
  if (tag === 'input' || tag === 'textarea') return 'input';
  if (tag === 'a') return 'link';
  return 'other';
}

function generatePageObjectCode(name: string, fields: PageObjectField[]): string {
  const className = name.charAt(0).toUpperCase() + name.slice(1) + 'Page';

  let code = `import { Page, Locator } from '@playwright/test';\n\n`;
  code += `export class ${className} {\n`;
  code += `  constructor(private page: Page) {}\n\n`;

  for (const field of fields) {
    code += `  get ${field.name}(): Locator {\n`;
    code += `    return this.page.locator('${field.locator}');\n`;
    code += `  }\n\n`;
  }

  code += `}\n`;
  return code;
}

// Example 3: Using the generator
test('generate locators for login page', async ({ page }) => {
  await page.goto('/login');

  const emailInput = page.locator('input[type="email"]').first();
  const locators = await generateLocators(page, emailInput);

  console.log('Generated locators:');
  locators.forEach((l) => {
    console.log(`  ${l.type}: ${l.selector} (stability: ${l.stability})`);
  });

  // Use the most stable locator
  const bestLocator = locators[0];
  await page.locator(bestLocator.selector).fill('test@example.com');
});

/**
 * EXERCISE:
 * 1. Generate locators for your page elements
 * 2. Compare stability scores
 * 3. Generate a Page Object scaffold
 * 4. Add missing data-testid attributes
 *
 * LEARNING:
 * - AI can suggest optimal locators
 * - Stability scores guide choices
 * - Auto-generate Page Objects
 * - Identify missing test attributes
 *
 * ONE LINER:
 * "AI generates the locators - you choose the best ones for your tests."
 */

export { generateLocators, generatePageObject };

