# Part 06: Scenario Outline

## 📚 Overview
Scenario Outline allows running the same scenario with different data sets using Examples tables.

---

## 🎯 Key Concepts

### 1. Basic Scenario Outline

```gherkin
Feature: Login Validation

  Scenario Outline: Login with different credentials
    Given I am on the login page
    When I enter email "<email>"
    And I enter password "<password>"
    And I click login
    Then I should see "<result>"

    Examples:
      | email              | password    | result              |
      | valid@example.com  | correct123  | Welcome             |
      | valid@example.com  | wrong       | Invalid password    |
      | invalid@test.com   | any         | User not found      |
      |                    | password    | Email is required   |
```

### 2. Step Definition

```typescript
// Same step definitions work for all examples
Given('I am on the login page', async function(this: CustomWorld) {
  await this.page.goto('/login');
});

When('I enter email {string}', async function(this: CustomWorld, email: string) {
  await this.page.getByLabel('Email').fill(email);
});

When('I enter password {string}', async function(this: CustomWorld, password: string) {
  await this.page.getByLabel('Password').fill(password);
});

When('I click login', async function(this: CustomWorld) {
  await this.page.getByRole('button', { name: 'Login' }).click();
});

Then('I should see {string}', async function(this: CustomWorld, result: string) {
  await expect(this.page.locator('.message')).toContainText(result);
});
```

### 3. Multiple Examples Tables

```gherkin
Scenario Outline: User registration validation
  Given I am on the registration page
  When I fill in "<field>" with "<value>"
  And I submit the form
  Then I should see error "<error>"

  @email-validation
  Examples: Email validation
    | field | value           | error                    |
    | Email | invalid         | Invalid email format     |
    | Email | @nodomain.com   | Invalid email format     |
    | Email |                 | Email is required        |

  @password-validation
  Examples: Password validation
    | field    | value  | error                        |
    | Password | 123    | Password too short           |
    | Password | abc    | Password needs a number      |
    | Password |        | Password is required         |
```

### 4. Complex Data

```gherkin
Scenario Outline: Product search and filter
  Given I am on the products page
  When I search for "<search>"
  And I filter by category "<category>"
  And I set price range "<minPrice>" to "<maxPrice>"
  Then I should see <count> products
  And the first product should be "<firstProduct>"

  Examples:
    | search   | category    | minPrice | maxPrice | count | firstProduct    |
    | laptop   | Electronics | 500      | 1500     | 5     | MacBook Air     |
    | phone    | Electronics | 200      | 800      | 8     | iPhone SE       |
    | shirt    | Clothing    | 20       | 100      | 15    | Cotton T-Shirt  |
```

### 5. Boolean and Numeric Values

```gherkin
Scenario Outline: Cart calculations
  Given I have <quantity> items in my cart
  And each item costs $<price>
  When I apply discount code "<discount>"
  Then the subtotal should be $<subtotal>
  And the discount should be $<discountAmount>
  And the total should be $<total>

  Examples:
    | quantity | price | discount | subtotal | discountAmount | total  |
    | 2        | 50.00 | SAVE10   | 100.00   | 10.00          | 90.00  |
    | 3        | 25.00 | SAVE20   | 75.00    | 15.00          | 60.00  |
    | 1        | 100.00| NONE     | 100.00   | 0.00           | 100.00 |
```

```typescript
Given('I have {int} items in my cart', async function(this: CustomWorld, quantity: number) {
  for (let i = 0; i < quantity; i++) {
    await this.addItemToCart();
  }
});

Given('each item costs ${float}', async function(this: CustomWorld, price: number) {
  this.itemPrice = price;
});

Then('the total should be ${float}', async function(this: CustomWorld, total: number) {
  const actualTotal = await this.page.locator('.total').textContent();
  expect(parseFloat(actualTotal!.replace('$', ''))).toBe(total);
});
```

### 6. Tagged Examples

```gherkin
Scenario Outline: API response validation
  When I call the "<endpoint>" API
  Then the response status should be <status>
  And the response should contain "<field>"

  @smoke
  Examples: Critical endpoints
    | endpoint     | status | field   |
    | /api/users   | 200    | users   |
    | /api/health  | 200    | status  |

  @regression
  Examples: Secondary endpoints
    | endpoint       | status | field    |
    | /api/products  | 200    | products |
    | /api/orders    | 200    | orders   |
    | /api/settings  | 200    | config   |
```

### 7. Scenario Outline with Background

```gherkin
Feature: Shopping Cart

  Background:
    Given I am logged in as a customer
    And I am on the products page

  Scenario Outline: Add products to cart
    When I add "<product>" to my cart
    And I set quantity to <quantity>
    Then the cart should show <quantity> of "<product>"
    And the line total should be $<lineTotal>

    Examples:
      | product      | quantity | lineTotal |
      | Blue T-Shirt | 2        | 49.98     |
      | Black Jeans  | 1        | 79.99     |
      | White Shoes  | 3        | 269.97    |
```

### 8. Data-Driven Testing Pattern

```typescript
// Store example data for complex scenarios
interface TestCase {
  input: string;
  expected: string;
  shouldPass: boolean;
}

When('I test with input {string}', async function(this: CustomWorld, input: string) {
  this.testInput = input;
  await this.page.getByLabel('Input').fill(input);
  await this.page.getByRole('button', { name: 'Submit' }).click();
});

Then('the result should be {string}', async function(this: CustomWorld, expected: string) {
  if (expected === 'error') {
    await expect(this.page.locator('.error')).toBeVisible();
  } else {
    await expect(this.page.locator('.result')).toHaveText(expected);
  }
});
```

---

## 💻 Practice Exercises

1. Create login validation outline
2. Use multiple examples tables
3. Handle numeric data
4. Tag examples for filtering
5. Combine with background

---

## ✅ Best Practices

- ✅ Use meaningful column names
- ✅ Group related examples
- ✅ Tag examples for filtering
- ✅ Keep examples focused
- ❌ Don't create too many columns
- ❌ Avoid duplicate test cases

---

## 📝 Quick Reference

```gherkin
Scenario Outline: Description
  Given step with "<placeholder>"
  When action with <number>
  Then result is "<expected>"

  Examples:
    | placeholder | number | expected |
    | value1      | 10     | result1  |
    | value2      | 20     | result2  |

  @tag
  Examples: Named examples
    | placeholder | number | expected |
    | value3      | 30     | result3  |
```

```bash
# Run specific examples
cucumber-js --tags "@smoke"
cucumber-js --tags "@email-validation"
```

