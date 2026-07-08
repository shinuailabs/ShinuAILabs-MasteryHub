# Part 04: AI-Powered Locator Strategies

## 📚 Overview
AI can help create robust, maintainable locators and implement self-healing test strategies.

---

## 🎯 Key Concepts

### 1. AI-Generated Locators

```typescript
// Prompt: Generate robust locators for login form
// AI suggests multiple strategies:

// Role-based (most robust)
const emailInput = page.getByRole('textbox', { name: 'Email' });
const passwordInput = page.getByRole('textbox', { name: 'Password' });
const submitButton = page.getByRole('button', { name: 'Sign In' });

// Test ID (recommended for custom elements)
const emailInput = page.getByTestId('login-email');
const passwordInput = page.getByTestId('login-password');

// Label-based
const emailInput = page.getByLabel('Email address');
const passwordInput = page.getByLabel('Password');

// Placeholder-based
const emailInput = page.getByPlaceholder('Enter your email');
```

### 2. Self-Healing Locators

```typescript
// Self-healing locator strategy
class SelfHealingLocator {
  private strategies: (() => Locator)[];
  
  constructor(private page: Page, strategies: (() => Locator)[]) {
    this.strategies = strategies;
  }
  
  async find(): Promise<Locator> {
    for (const strategy of this.strategies) {
      const locator = strategy();
      if (await locator.count() > 0) {
        return locator;
      }
    }
    throw new Error('Element not found with any strategy');
  }
}

// Usage
const loginButton = new SelfHealingLocator(page, [
  () => page.getByRole('button', { name: 'Login' }),
  () => page.getByTestId('login-btn'),
  () => page.locator('#login-button'),
  () => page.locator('button[type="submit"]'),
]);

await (await loginButton.find()).click();
```

### 3. AI Locator Analysis

```typescript
// Prompt: Analyze this HTML and suggest best locators
const html = `
<form class="login-form" data-testid="login-form">
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" 
           placeholder="Enter email" aria-label="Email">
  </div>
  <button type="submit" class="btn btn-primary">Sign In</button>
</form>
`;

// AI suggests (ranked by robustness):
// 1. page.getByRole('textbox', { name: 'Email Address' })
// 2. page.getByLabel('Email Address')
// 3. page.getByTestId('login-form').locator('input[type="email"]')
// 4. page.locator('#email')
```

### 4. Visual AI Locators

```typescript
// Using Applitools for visual element location
import { Eyes, Target } from '@applitools/eyes-playwright';

test('visual locator test', async ({ page }) => {
  const eyes = new Eyes();
  await eyes.open(page, 'App', 'Visual Test');
  
  // Visual AI finds elements even if DOM changes
  await eyes.check('Login Page', Target.window().fully());
  
  await eyes.close();
});
```

### 5. Dynamic Locator Generation

```typescript
// AI-assisted dynamic locator builder
class LocatorBuilder {
  static forElement(page: Page, description: string): Locator {
    // AI would analyze description and return best locator
    const strategies: Record<string, () => Locator> = {
      'email input': () => page.getByRole('textbox', { name: /email/i }),
      'password input': () => page.getByRole('textbox', { name: /password/i }),
      'submit button': () => page.getByRole('button', { name: /submit|sign in|login/i }),
      'error message': () => page.getByRole('alert'),
    };
    
    const key = Object.keys(strategies).find(k => 
      description.toLowerCase().includes(k)
    );
    
    return key ? strategies[key]() : page.locator(`[data-testid="${description}"]`);
  }
}

// Usage
const email = LocatorBuilder.forElement(page, 'email input');
const submit = LocatorBuilder.forElement(page, 'submit button');
```

### 6. Locator Validation

```typescript
// AI-powered locator validation
async function validateLocator(page: Page, locator: Locator): Promise<{
  isValid: boolean;
  uniqueness: 'unique' | 'multiple' | 'none';
  suggestions: string[];
}> {
  const count = await locator.count();
  
  return {
    isValid: count === 1,
    uniqueness: count === 0 ? 'none' : count === 1 ? 'unique' : 'multiple',
    suggestions: count !== 1 ? [
      'Try using getByRole with name',
      'Add data-testid attribute',
      'Use more specific selector',
    ] : [],
  };
}

// Usage
const result = await validateLocator(page, page.locator('.btn'));
if (!result.isValid) {
  console.log('Suggestions:', result.suggestions);
}
```

### 7. Locator Migration

```typescript
// AI helps migrate old locators to modern patterns
// Old CSS/XPath locators:
const oldLocators = {
  email: '#login-form > div:nth-child(1) > input',
  password: '//input[@type="password"]',
  submit: '.login-form .btn-primary',
};

// AI-suggested modern locators:
const modernLocators = {
  email: page.getByRole('textbox', { name: 'Email' }),
  password: page.getByRole('textbox', { name: 'Password' }),
  submit: page.getByRole('button', { name: 'Sign In' }),
};
```

### 8. Locator Best Practices

```typescript
// ✅ Preferred locator strategies (in order)
const bestPractices = {
  // 1. Role-based (accessibility)
  button: page.getByRole('button', { name: 'Submit' }),
  
  // 2. Label-based
  input: page.getByLabel('Email'),
  
  // 3. Placeholder
  search: page.getByPlaceholder('Search...'),
  
  // 4. Test ID
  custom: page.getByTestId('custom-component'),
  
  // 5. Text content
  link: page.getByText('Learn more'),
};

// ❌ Avoid
const avoid = {
  fragile: page.locator('div > div > span:nth-child(2)'),
  classDependent: page.locator('.MuiButton-root-123'),
  indexBased: page.locator('button').nth(3),
};
```

---

## 💻 Practice Exercises

1. Generate locators with AI
2. Implement self-healing strategy
3. Migrate legacy locators
4. Validate locator uniqueness
5. Use visual AI tools

---

## ✅ Best Practices

- ✅ Use role-based locators first
- ✅ Add data-testid for custom elements
- ✅ Implement fallback strategies
- ✅ Validate locator uniqueness
- ❌ Avoid brittle CSS paths
- ❌ Don't rely on auto-generated classes

---

## 📝 Quick Reference

```typescript
// Locator priority
1. getByRole()      // Accessibility
2. getByLabel()     // Form elements
3. getByPlaceholder() // Inputs
4. getByTestId()    // Custom elements
5. getByText()      // Static text

// Self-healing pattern
const locator = await tryStrategies([
  () => page.getByRole('button', { name: 'Submit' }),
  () => page.getByTestId('submit-btn'),
  () => page.locator('button[type="submit"]'),
]);
```

