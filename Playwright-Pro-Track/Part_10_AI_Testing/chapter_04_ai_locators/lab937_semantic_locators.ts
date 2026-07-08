/**
 * Lab 937: Semantic AI Locators
 *
 * CONCEPT:
 * Semantic locators find elements based on their meaning and purpose rather
 * than technical attributes. AI understands what an element does (login button,
 * search field) and finds it accordingly.
 *
 * BULLET POINTS:
 * - Find elements by purpose/meaning
 * - Natural language element descriptions
 * - Context-aware element identification
 * - Works across different implementations
 * - More intuitive test writing
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Example 1: Semantic locator implementation
type ElementPurpose =
  | 'login-button'
  | 'search-field'
  | 'submit-button'
  | 'email-input'
  | 'password-input'
  | 'navigation-menu'
  | 'shopping-cart'
  | 'user-profile';

class SemanticLocator {
  private purposeMap: Record<ElementPurpose, () => Locator>;

  constructor(private page: Page) {
    this.purposeMap = {
      'login-button': () =>
        this.page.getByRole('button', { name: /log\s*in|sign\s*in/i }),
      'search-field': () =>
        this.page.getByRole('searchbox').or(this.page.getByPlaceholder(/search/i)),
      'submit-button': () =>
        this.page.getByRole('button', { name: /submit|send|save/i }),
      'email-input': () =>
        this.page.getByLabel(/email/i).or(this.page.getByPlaceholder(/email/i)),
      'password-input': () =>
        this.page.getByLabel(/password/i).or(this.page.locator('input[type="password"]')),
      'navigation-menu': () =>
        this.page.getByRole('navigation').or(this.page.locator('nav')),
      'shopping-cart': () =>
        this.page.getByRole('button', { name: /cart|basket/i }),
      'user-profile': () =>
        this.page.getByRole('button', { name: /profile|account|user/i }),
    };
  }

  find(purpose: ElementPurpose): Locator {
    const locatorFn = this.purposeMap[purpose];
    if (!locatorFn) {
      throw new Error(`Unknown element purpose: ${purpose}`);
    }
    return locatorFn();
  }
}

// Example 2: Using semantic locators
test.describe('Semantic Locators', () => {
  test('login using semantic locators', async ({ page }) => {
    await page.goto('/login');

    const semantic = new SemanticLocator(page);

    await semantic.find('email-input').fill('user@example.com');
    await semantic.find('password-input').fill('password123');
    await semantic.find('login-button').click();

    await expect(page).toHaveURL('/dashboard');
  });

  test('search using semantic locators', async ({ page }) => {
    await page.goto('/');

    const semantic = new SemanticLocator(page);

    await semantic.find('search-field').fill('test query');
    await semantic.find('submit-button').click();
  });
});

// Example 3: Natural language locator
async function findByDescription(
  page: Page,
  description: string
): Promise<Locator> {
  const descLower = description.toLowerCase();

  // AI-like pattern matching for natural language
  if (descLower.includes('login') && descLower.includes('button')) {
    return page.getByRole('button', { name: /log\s*in|sign\s*in/i });
  }
  if (descLower.includes('email') && descLower.includes('field')) {
    return page.getByLabel(/email/i);
  }
  if (descLower.includes('search')) {
    return page.getByRole('searchbox');
  }
  if (descLower.includes('submit')) {
    return page.getByRole('button', { name: /submit/i });
  }

  // Fallback to text search
  return page.getByText(description);
}

test('natural language locators', async ({ page }) => {
  await page.goto('/login');

  const emailField = await findByDescription(page, 'email input field');
  const loginBtn = await findByDescription(page, 'login button');

  await emailField.fill('test@example.com');
  await loginBtn.click();
});

// Example 4: Context-aware locators
class ContextAwareLocator {
  constructor(
    private page: Page,
    private context: string
  ) {}

  async findInContext(elementType: string): Promise<Locator> {
    const contextLocator = this.page.locator(`[data-context="${this.context}"]`);

    switch (elementType) {
      case 'submit':
        return contextLocator.getByRole('button', { name: /submit|save/i });
      case 'cancel':
        return contextLocator.getByRole('button', { name: /cancel|close/i });
      case 'input':
        return contextLocator.locator('input').first();
      default:
        return contextLocator.getByText(elementType);
    }
  }
}

test('context-aware locators', async ({ page }) => {
  await page.goto('/forms');

  // Find submit button within shipping form context
  const shippingForm = new ContextAwareLocator(page, 'shipping-form');
  const submitBtn = await shippingForm.findInContext('submit');
  await submitBtn.click();
});

/**
 * EXERCISE:
 * 1. Create semantic locators for your app
 * 2. Map element purposes to locator strategies
 * 3. Implement natural language finding
 * 4. Add context awareness
 *
 * LEARNING:
 * - Semantic locators are more intuitive
 * - Map purposes to multiple strategies
 * - Natural language improves readability
 * - Context helps disambiguate elements
 *
 * ONE LINER:
 * "Semantic locators find the 'login button' - not just 'button.btn-primary.auth-submit'."
 */

export { SemanticLocator, findByDescription, ContextAwareLocator };

