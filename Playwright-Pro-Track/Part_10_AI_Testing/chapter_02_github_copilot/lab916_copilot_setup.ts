/**
 * Lab 916: GitHub Copilot Setup for Playwright Testing
 *
 * CONCEPT:
 * GitHub Copilot is an AI pair programmer that provides real-time code suggestions.
 * For QA engineers, it accelerates test writing by suggesting complete test blocks,
 * assertions, and locator strategies based on context.
 *
 * BULLET POINTS:
 * - Install Copilot extension in VS Code or JetBrains
 * - Requires GitHub Copilot subscription ($10/month individual, $19/month business)
 * - Works with TypeScript, JavaScript, and other languages
 * - Learns from your codebase context
 * - Provides inline suggestions and chat interface
 * - Integrates with Playwright seamlessly
 *
 * EXAMPLES:
 */

// Example 1: Copilot suggests test structure when you type
import { test, expect } from '@playwright/test';

// Type: "test user login" and Copilot suggests:
test('user login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
});

// Example 2: Copilot completes assertions
test('product page displays correctly', async ({ page }) => {
  await page.goto('/products/123');

  // Type: "expect product" and Copilot suggests:
  await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
  await expect(page.locator('[data-testid="product-price"]')).toContainText('$');
  await expect(page.locator('[data-testid="add-to-cart"]')).toBeEnabled();
});

// Example 3: Copilot generates Page Object methods
class LoginPage {
  constructor(private page: any) {}

  // Type: "async login" and Copilot suggests:
  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  // Type: "async verify" and Copilot suggests:
  async verifyLoginError(message: string) {
    await expect(this.page.locator('.error-message')).toContainText(message);
  }
}

/**
 * EXERCISE:
 * 1. Install GitHub Copilot extension in VS Code
 * 2. Sign in with your GitHub account
 * 3. Create a new test file and observe Copilot suggestions
 * 4. Practice accepting (Tab), rejecting (Esc), and cycling (Alt+]) suggestions
 *
 * CODING QUESTIONS & SOLUTIONS:
 */

// Question 1: Setup Copilot configuration
// Solution: Create .vscode/settings.json
const copilotSettings = {
  'github.copilot.enable': {
    '*': true,
    typescript: true,
    javascript: true,
    markdown: false, // Disable for docs if needed
  },
  'github.copilot.advanced': {
    inlineSuggestCount: 3, // Number of suggestions to show
  },
  'editor.inlineSuggest.enabled': true,
  'editor.tabCompletion': 'on',
};

// Question 2: Copilot keyboard shortcuts reference
const copilotShortcuts = {
  acceptSuggestion: 'Tab',
  rejectSuggestion: 'Escape',
  nextSuggestion: 'Alt + ]',
  previousSuggestion: 'Alt + [',
  triggerSuggestion: 'Alt + \\',
  openCopilotPanel: 'Ctrl + Enter',
  openCopilotChat: 'Ctrl + Shift + I',
};

// Question 3: Verify Copilot is working
test('verify copilot setup', async ({ page }) => {
  // If Copilot is working, it will suggest completions as you type
  // Type slowly and watch for ghost text suggestions

  await page.goto('/');
  // Type: "await expect(page" and wait for suggestions
  await expect(page).toHaveTitle(/Home/);
});

/**
 * LEARNING:
 * - Copilot learns from your project's patterns and conventions
 * - Better comments lead to better suggestions
 * - Use descriptive function/test names for context
 * - Copilot works best with consistent coding style
 * - Review all suggestions before accepting
 *
 * ONE LINER:
 * "GitHub Copilot is your AI pair programmer - it writes the code, you make the decisions."
 */

export { LoginPage, copilotSettings, copilotShortcuts };

