# Part 05: Natural Language Testing

## 📚 Overview
Natural Language Processing (NLP) enables writing tests in plain English that AI converts to executable code.

---

## 🎯 Key Concepts

### 1. Plain English Test Writing

```typescript
// Natural language test description
const testDescription = `
  Go to the login page
  Enter "user@example.com" in the email field
  Enter "password123" in the password field
  Click the login button
  Verify the dashboard is displayed
`;

// AI converts to Playwright:
test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### 2. NLP Test Framework

```typescript
// Simple NLP test interpreter
class NLPTestRunner {
  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async execute(instruction: string): Promise<void> {
    const normalized = instruction.toLowerCase().trim();
    
    if (normalized.startsWith('go to')) {
      const url = instruction.match(/go to (.+)/i)?.[1];
      await this.page.goto(url!);
    }
    else if (normalized.startsWith('click')) {
      const target = instruction.match(/click (?:on )?(?:the )?(.+)/i)?.[1];
      await this.page.getByRole('button', { name: new RegExp(target!, 'i') }).click();
    }
    else if (normalized.startsWith('enter') || normalized.startsWith('type')) {
      const match = instruction.match(/(?:enter|type) "(.+)" in (?:the )?(.+)/i);
      const [, value, field] = match!;
      await this.page.getByLabel(new RegExp(field, 'i')).fill(value);
    }
    else if (normalized.startsWith('verify') || normalized.startsWith('check')) {
      const target = instruction.match(/(?:verify|check) (?:that )?(?:the )?(.+) is (?:visible|displayed)/i)?.[1];
      await expect(this.page.getByText(new RegExp(target!, 'i'))).toBeVisible();
    }
  }
  
  async run(instructions: string[]): Promise<void> {
    for (const instruction of instructions) {
      await this.execute(instruction);
    }
  }
}

// Usage
test('NLP test', async ({ page }) => {
  const runner = new NLPTestRunner(page);
  await runner.run([
    'Go to /login',
    'Enter "test@example.com" in the email field',
    'Enter "password" in the password field',
    'Click the Sign In button',
    'Verify that the Dashboard is visible',
  ]);
});
```

### 3. Gherkin to Playwright

```typescript
// Gherkin scenario
const gherkin = `
  Given I am on the products page
  When I search for "laptop"
  And I filter by price range $500 to $1000
  Then I should see products matching "laptop"
  And all prices should be between $500 and $1000
`;

// AI-generated step definitions
Given('I am on the products page', async ({ page }) => {
  await page.goto('/products');
});

When('I search for {string}', async ({ page }, searchTerm: string) => {
  await page.getByPlaceholder('Search').fill(searchTerm);
  await page.getByRole('button', { name: 'Search' }).click();
});

When('I filter by price range ${int} to ${int}', async ({ page }, min: number, max: number) => {
  await page.getByLabel('Min Price').fill(min.toString());
  await page.getByLabel('Max Price').fill(max.toString());
  await page.getByRole('button', { name: 'Apply' }).click();
});

Then('I should see products matching {string}', async ({ page }, term: string) => {
  const products = page.locator('.product-title');
  await expect(products.first()).toContainText(term);
});
```

### 4. AI-Powered Test Description

```typescript
// Describe test in natural language, AI generates code
const testCases = [
  {
    description: 'User adds item to cart and proceeds to checkout',
    steps: [
      'Navigate to product catalog',
      'Click on first available product',
      'Select size Medium',
      'Click Add to Cart',
      'Go to shopping cart',
      'Click Proceed to Checkout',
      'Verify checkout page is displayed',
    ],
  },
  {
    description: 'User applies discount code at checkout',
    steps: [
      'Add any product to cart',
      'Go to checkout',
      'Enter discount code "SAVE20"',
      'Click Apply',
      'Verify 20% discount is applied',
    ],
  },
];

// AI generates executable tests from descriptions
```

### 5. Voice-to-Test

```typescript
// Concept: Voice commands to test actions
// "Click the login button"
// "Fill email with test@example.com"
// "Assert page title is Dashboard"

// Voice command parser
function parseVoiceCommand(command: string): TestAction {
  const patterns = [
    { regex: /click (?:the )?(.+)/i, action: 'click' },
    { regex: /fill (.+) with (.+)/i, action: 'fill' },
    { regex: /assert (.+) is (.+)/i, action: 'assert' },
    { regex: /navigate to (.+)/i, action: 'navigate' },
  ];
  
  for (const { regex, action } of patterns) {
    const match = command.match(regex);
    if (match) {
      return { action, params: match.slice(1) };
    }
  }
  
  throw new Error(`Unknown command: ${command}`);
}
```

### 6. Test Intent Recognition

```typescript
// AI recognizes test intent from description
const intents = {
  'verify user can log in': {
    type: 'authentication',
    actions: ['navigate', 'fill', 'click', 'assert'],
    elements: ['email', 'password', 'submit', 'dashboard'],
  },
  'check product search works': {
    type: 'search',
    actions: ['navigate', 'fill', 'click', 'assert'],
    elements: ['search-input', 'search-button', 'results'],
  },
};

// AI generates appropriate test based on intent
```

### 7. Assertion Generation

```typescript
// Natural language assertions
const assertions = [
  'The page title should be "Welcome"',
  'The error message should contain "Invalid"',
  'The cart should have 3 items',
  'The button should be disabled',
  'The form should be submitted successfully',
];

// AI converts to Playwright assertions
const playwrightAssertions = [
  `await expect(page).toHaveTitle('Welcome')`,
  `await expect(page.locator('.error')).toContainText('Invalid')`,
  `await expect(page.locator('.cart-count')).toHaveText('3')`,
  `await expect(page.getByRole('button')).toBeDisabled()`,
  `await expect(page.locator('.success')).toBeVisible()`,
];
```

---

## 💻 Practice Exercises

1. Write tests in plain English
2. Create NLP test interpreter
3. Convert Gherkin to Playwright
4. Build assertion generator
5. Implement voice commands

---

## ✅ Best Practices

- ✅ Use clear, specific language
- ✅ Define consistent vocabulary
- ✅ Map actions to Playwright methods
- ✅ Handle ambiguity gracefully
- ❌ Don't use vague descriptions
- ❌ Avoid complex nested conditions

---

## 📝 Quick Reference

```
NLP Patterns:
- "Go to [url]" → page.goto()
- "Click [element]" → locator.click()
- "Enter [value] in [field]" → locator.fill()
- "Verify [element] is visible" → expect().toBeVisible()
- "Check [element] contains [text]" → expect().toContainText()
```

