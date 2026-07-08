# Part 03: Step Definitions

## 📚 Overview
Step definitions connect Gherkin steps to executable code, bridging natural language and automation.

---

## 🎯 Key Concepts

### 1. Basic Step Definitions

```typescript
// step-definitions/basic.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('I am on the home page', async function(this: CustomWorld) {
  await this.page.goto('/');
});

When('I click the {string} button', async function(this: CustomWorld, buttonName: string) {
  await this.page.getByRole('button', { name: buttonName }).click();
});

Then('I should see {string}', async function(this: CustomWorld, text: string) {
  await this.page.getByText(text).waitFor();
});
```

### 2. Parameter Types

```typescript
// String parameter
When('I enter {string} in the search box', async function(this: CustomWorld, query: string) {
  await this.page.getByRole('searchbox').fill(query);
});

// Integer parameter
Then('I should see {int} results', async function(this: CustomWorld, count: number) {
  const results = this.page.locator('.result');
  await expect(results).toHaveCount(count);
});

// Float parameter
Then('the price should be {float}', async function(this: CustomWorld, price: number) {
  const priceText = await this.page.locator('.price').textContent();
  expect(parseFloat(priceText!.replace('$', ''))).toBe(price);
});

// Word parameter (no quotes needed)
Given('I am logged in as {word}', async function(this: CustomWorld, role: string) {
  // Login as role
});
```

### 3. Custom Parameter Types

```typescript
// support/parameters.ts
import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
  name: 'user',
  regexp: /admin|customer|guest/,
  transformer: (s) => s
});

defineParameterType({
  name: 'boolean',
  regexp: /true|false|enabled|disabled/,
  transformer: (s) => s === 'true' || s === 'enabled'
});

// Usage in steps
Given('I am logged in as {user}', async function(this: CustomWorld, userType: string) {
  // userType will be 'admin', 'customer', or 'guest'
});

When('notifications are {boolean}', async function(this: CustomWorld, enabled: boolean) {
  // enabled will be true or false
});
```

### 4. Data Tables

```typescript
// step-definitions/table.steps.ts
import { DataTable } from '@cucumber/cucumber';

When('I fill in the form:', async function(this: CustomWorld, dataTable: DataTable) {
  const data = dataTable.rowsHash();
  // data = { field1: 'value1', field2: 'value2' }
  
  for (const [field, value] of Object.entries(data)) {
    await this.page.getByLabel(field).fill(value);
  }
});

When('I add the following items:', async function(this: CustomWorld, dataTable: DataTable) {
  const items = dataTable.hashes();
  // items = [{ product: 'Laptop', quantity: '1' }, ...]
  
  for (const item of items) {
    await this.page.getByText(item.product).click();
    await this.page.getByLabel('Quantity').fill(item.quantity);
    await this.page.getByRole('button', { name: 'Add' }).click();
  }
});

Then('the table should contain:', async function(this: CustomWorld, dataTable: DataTable) {
  const expected = dataTable.raw();
  // expected = [['header1', 'header2'], ['row1col1', 'row1col2']]
  
  for (let i = 0; i < expected.length; i++) {
    for (let j = 0; j < expected[i].length; j++) {
      const cell = this.page.locator(`table tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
      await expect(cell).toHaveText(expected[i][j]);
    }
  }
});
```

### 5. Doc Strings

```typescript
When('I enter the following text:', async function(this: CustomWorld, docString: string) {
  await this.page.getByRole('textbox').fill(docString);
});

Then('the response should be:', async function(this: CustomWorld, docString: string) {
  const expected = JSON.parse(docString);
  const actual = await this.page.evaluate(() => {
    // Get response from page
  });
  expect(actual).toEqual(expected);
});
```

### 6. Reusable Steps

```typescript
// step-definitions/common.steps.ts
Given('I am on the {string} page', async function(this: CustomWorld, pageName: string) {
  const pages: Record<string, string> = {
    'login': '/login',
    'home': '/',
    'products': '/products',
    'cart': '/cart',
    'checkout': '/checkout'
  };
  await this.page.goto(pages[pageName] || `/${pageName}`);
});

When('I click on {string}', async function(this: CustomWorld, text: string) {
  await this.page.getByText(text).click();
});

When('I fill {string} with {string}', async function(this: CustomWorld, field: string, value: string) {
  await this.page.getByLabel(field).fill(value);
});

Then('I should be on the {string} page', async function(this: CustomWorld, pageName: string) {
  await expect(this.page).toHaveURL(new RegExp(pageName));
});

Then('the {string} should be visible', async function(this: CustomWorld, element: string) {
  await expect(this.page.getByText(element)).toBeVisible();
});
```

### 7. Step with Page Objects

```typescript
// step-definitions/login.steps.ts
import { LoginPage } from '../support/pages/LoginPage';

Given('I am on the login page', async function(this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto();
});

When('I login with {string} and {string}', async function(
  this: CustomWorld, 
  email: string, 
  password: string
) {
  await this.loginPage.login(email, password);
});

Then('I should be logged in', async function(this: CustomWorld) {
  await this.loginPage.expectLoggedIn();
});
```

### 8. Async/Await Patterns

```typescript
// Proper async handling
When('I wait for the page to load', async function(this: CustomWorld) {
  await this.page.waitForLoadState('networkidle');
});

When('I wait for {string} to appear', async function(this: CustomWorld, text: string) {
  await this.page.getByText(text).waitFor({ state: 'visible' });
});

Then('the API should return success', async function(this: CustomWorld) {
  const [response] = await Promise.all([
    this.page.waitForResponse('**/api/submit'),
    this.page.getByRole('button', { name: 'Submit' }).click()
  ]);
  expect(response.status()).toBe(200);
});
```

---

## 💻 Practice Exercises

1. Create basic step definitions
2. Use different parameter types
3. Handle data tables
4. Implement reusable steps
5. Integrate with page objects

---

## ✅ Best Practices

- ✅ Keep steps atomic
- ✅ Use meaningful parameter names
- ✅ Create reusable steps
- ✅ Integrate with page objects
- ❌ Don't duplicate step logic
- ❌ Avoid complex step definitions

---

## 📝 Quick Reference

```typescript
// Parameters
{string}  // "quoted string"
{int}     // 123
{float}   // 12.34
{word}    // unquoted word

// Data table
dataTable.rowsHash()  // { key: value }
dataTable.hashes()    // [{ col1: val1 }]
dataTable.raw()       // [[row1], [row2]]

// Custom parameter
defineParameterType({
  name: 'type',
  regexp: /pattern/,
  transformer: (s) => s
})
```

