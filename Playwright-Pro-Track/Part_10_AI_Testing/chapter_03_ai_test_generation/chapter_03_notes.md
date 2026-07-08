# Part 03: AI-Powered Test Generation

## 📚 Overview
AI can generate comprehensive test cases from requirements, specifications, and user stories.

---

## 🎯 Key Concepts

### 1. Test Generation from Requirements

```typescript
// Prompt for ChatGPT/Claude:
const prompt = `
Generate Playwright tests for this requirement:

Feature: User Registration
- User enters email, password, confirm password
- Email must be valid format
- Password must be 8+ chars with number and special char
- Passwords must match
- Show inline validation errors
- Successful registration redirects to /welcome

Generate tests covering:
1. Happy path
2. Validation errors
3. Edge cases
`;

// AI generates:
test.describe('User Registration', () => {
  test('successful registration', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#email', 'newuser@example.com');
    await page.fill('#password', 'SecurePass123!');
    await page.fill('#confirmPassword', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/welcome');
  });

  test('invalid email format', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#email', 'invalid-email');
    await page.fill('#password', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('.email-error')).toContainText('valid email');
  });
});
```

### 2. Test Generation from User Stories

```typescript
// User Story:
// As a customer, I want to filter products by price range
// So that I can find products within my budget

// AI-generated tests:
test.describe('Product Price Filter', () => {
  test('filter by minimum price', async ({ page }) => {
    await page.goto('/products');
    await page.fill('#min-price', '50');
    await page.click('#apply-filter');
    const prices = await page.locator('.product-price').allTextContents();
    prices.forEach(price => {
      expect(parseFloat(price.replace('$', ''))).toBeGreaterThanOrEqual(50);
    });
  });

  test('filter by price range', async ({ page }) => {
    await page.goto('/products');
    await page.fill('#min-price', '25');
    await page.fill('#max-price', '100');
    await page.click('#apply-filter');
    // Verify all products are within range
  });

  test('no products in range shows empty state', async ({ page }) => {
    await page.goto('/products');
    await page.fill('#min-price', '10000');
    await page.click('#apply-filter');
    await expect(page.locator('.no-products')).toBeVisible();
  });
});
```

### 3. API Test Generation

```typescript
// Prompt: Generate API tests for this endpoint
// POST /api/users - Create user
// Request: { email, password, name }
// Response: { id, email, name, createdAt }

// AI generates:
test.describe('POST /api/users', () => {
  test('create user successfully', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.email).toBe('test@example.com');
  });

  test('reject duplicate email', async ({ request }) => {
    // Create first user
    await request.post('/api/users', {
      data: { email: 'dup@example.com', password: 'Pass123!', name: 'User 1' }
    });
    // Try duplicate
    const response = await request.post('/api/users', {
      data: { email: 'dup@example.com', password: 'Pass123!', name: 'User 2' }
    });
    expect(response.status()).toBe(409);
  });
});
```

### 4. Test Data Generation

```typescript
// Prompt: Generate test data for e-commerce checkout

// AI generates:
export const checkoutTestData = {
  validCards: [
    { number: '4111111111111111', expiry: '12/25', cvv: '123', type: 'visa' },
    { number: '5500000000000004', expiry: '12/25', cvv: '123', type: 'mastercard' },
  ],
  invalidCards: [
    { number: '4111111111111112', expiry: '12/25', cvv: '123', error: 'Invalid card' },
    { number: '4111111111111111', expiry: '01/20', cvv: '123', error: 'Expired card' },
  ],
  addresses: [
    { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' },
    { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip: '90001' },
  ],
};
```

### 5. Edge Case Generation

```typescript
// Prompt: Generate edge cases for search functionality

// AI generates edge cases:
const searchEdgeCases = [
  { input: '', expected: 'show all results' },
  { input: '   ', expected: 'trim and show all' },
  { input: 'a', expected: 'minimum character warning' },
  { input: '<script>alert("xss")</script>', expected: 'sanitize input' },
  { input: "O'Brien", expected: 'handle apostrophe' },
  { input: '日本語', expected: 'handle unicode' },
  { input: 'a'.repeat(1000), expected: 'handle long input' },
  { input: 'product123', expected: 'alphanumeric search' },
];
```

### 6. BDD Scenario Generation

```typescript
// Prompt: Generate Gherkin scenarios for shopping cart

// AI generates:
/*
Feature: Shopping Cart

  Scenario: Add single item to cart
    Given I am on the product page for "Blue T-Shirt"
    When I click "Add to Cart"
    Then the cart count should be "1"
    And I should see "Blue T-Shirt" in the cart

  Scenario: Update item quantity
    Given I have "Blue T-Shirt" in my cart
    When I change the quantity to "3"
    Then the cart total should update
    And the quantity should show "3"

  Scenario: Remove item from cart
    Given I have items in my cart
    When I click remove on "Blue T-Shirt"
    Then "Blue T-Shirt" should not be in the cart
*/
```

---

## 💻 Practice Exercises

1. Generate tests from requirements
2. Create API test suites with AI
3. Generate edge case tests
4. Create BDD scenarios
5. Build test data sets

---

## ✅ Best Practices

- ✅ Provide detailed requirements
- ✅ Review and customize generated tests
- ✅ Add project-specific assertions
- ✅ Verify test coverage
- ❌ Don't use without review
- ❌ Avoid generic prompts

---

## 📝 Quick Reference

```
Prompt Structure:
1. Feature description
2. Acceptance criteria
3. Test types needed
4. Output format

Test Types to Request:
- Happy path
- Validation errors
- Edge cases
- Security tests
- Performance tests
```

