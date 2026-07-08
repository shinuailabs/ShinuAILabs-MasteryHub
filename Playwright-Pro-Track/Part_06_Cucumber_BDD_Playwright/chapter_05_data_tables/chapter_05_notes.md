# Part 05: Data Tables

## 📚 Overview
Data tables in Cucumber allow passing structured data to step definitions for complex test scenarios.

---

## 🎯 Key Concepts

### 1. Basic Data Table

```gherkin
Scenario: Fill registration form
  When I fill in the registration form:
    | field    | value            |
    | Name     | John Doe         |
    | Email    | john@example.com |
    | Password | SecurePass123    |
  Then the form should be submitted
```

```typescript
When('I fill in the registration form:', async function(this: CustomWorld, dataTable: DataTable) {
  const data = dataTable.rowsHash();
  // data = { Name: 'John Doe', Email: 'john@example.com', Password: 'SecurePass123' }
  
  for (const [field, value] of Object.entries(data)) {
    await this.page.getByLabel(field).fill(value);
  }
});
```

### 2. Table Methods

```typescript
import { DataTable } from '@cucumber/cucumber';

// rowsHash() - First column as keys, second as values
// { key1: value1, key2: value2 }
const hash = dataTable.rowsHash();

// hashes() - Array of objects with header row as keys
// [{ col1: val1, col2: val2 }, { col1: val3, col2: val4 }]
const hashes = dataTable.hashes();

// raw() - 2D array of all cells
// [['header1', 'header2'], ['row1col1', 'row1col2']]
const raw = dataTable.raw();

// rows() - 2D array without header row
// [['row1col1', 'row1col2'], ['row2col1', 'row2col2']]
const rows = dataTable.rows();
```

### 3. Multiple Items

```gherkin
Scenario: Add multiple products to cart
  When I add the following products:
    | product  | quantity | size   |
    | T-Shirt  | 2        | Medium |
    | Jeans    | 1        | Large  |
    | Sneakers | 1        | 10     |
  Then the cart should have 3 items
```

```typescript
When('I add the following products:', async function(this: CustomWorld, dataTable: DataTable) {
  const products = dataTable.hashes();
  
  for (const product of products) {
    await this.page.getByText(product.product).click();
    await this.page.getByLabel('Quantity').fill(product.quantity);
    await this.page.getByLabel('Size').selectOption(product.size);
    await this.page.getByRole('button', { name: 'Add to Cart' }).click();
  }
});
```

### 4. Verification Tables

```gherkin
Scenario: Verify order summary
  Then the order summary should show:
    | Item     | Quantity | Price  |
    | T-Shirt  | 2        | $39.98 |
    | Jeans    | 1        | $59.99 |
    | Sneakers | 1        | $89.99 |
```

```typescript
Then('the order summary should show:', async function(this: CustomWorld, dataTable: DataTable) {
  const expected = dataTable.hashes();
  
  for (const item of expected) {
    const row = this.page.locator('.order-item').filter({ hasText: item.Item });
    await expect(row.locator('.quantity')).toHaveText(item.Quantity);
    await expect(row.locator('.price')).toHaveText(item.Price);
  }
});
```

### 5. Vertical Tables

```gherkin
Scenario: Verify user profile
  Then the user profile should display:
    | Name     | John Doe           |
    | Email    | john@example.com   |
    | Role     | Administrator      |
    | Status   | Active             |
```

```typescript
Then('the user profile should display:', async function(this: CustomWorld, dataTable: DataTable) {
  const expected = dataTable.rowsHash();
  
  await expect(this.page.getByTestId('user-name')).toHaveText(expected.Name);
  await expect(this.page.getByTestId('user-email')).toHaveText(expected.Email);
  await expect(this.page.getByTestId('user-role')).toHaveText(expected.Role);
  await expect(this.page.getByTestId('user-status')).toHaveText(expected.Status);
});
```

### 6. Raw Table Access

```gherkin
Scenario: Verify table data
  Then the data table should contain:
    | Name  | Age | City     |
    | John  | 30  | New York |
    | Jane  | 25  | Boston   |
    | Bob   | 35  | Chicago  |
```

```typescript
Then('the data table should contain:', async function(this: CustomWorld, dataTable: DataTable) {
  const raw = dataTable.raw();
  const headers = raw[0];
  const rows = raw.slice(1);
  
  // Verify headers
  for (let i = 0; i < headers.length; i++) {
    const header = this.page.locator(`table th:nth-child(${i + 1})`);
    await expect(header).toHaveText(headers[i]);
  }
  
  // Verify rows
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      const cell = this.page.locator(`table tbody tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
      await expect(cell).toHaveText(rows[i][j]);
    }
  }
});
```

### 7. Dynamic Tables

```gherkin
Scenario: Create users with different roles
  Given the following users exist:
    | email              | password | role    |
    | admin@test.com     | admin123 | admin   |
    | user@test.com      | user123  | user    |
    | guest@test.com     | guest123 | guest   |
```

```typescript
Given('the following users exist:', async function(this: CustomWorld, dataTable: DataTable) {
  const users = dataTable.hashes();
  
  for (const user of users) {
    // Create user via API
    await this.apiClient.createUser({
      email: user.email,
      password: user.password,
      role: user.role
    });
    
    // Store for cleanup
    this.createdUsers.push(user.email);
  }
});
```

### 8. Table Transformations

```typescript
// Transform table data
When('I create products:', async function(this: CustomWorld, dataTable: DataTable) {
  const products = dataTable.hashes().map(row => ({
    name: row.name,
    price: parseFloat(row.price.replace('$', '')),
    quantity: parseInt(row.quantity),
    inStock: row.inStock === 'true'
  }));
  
  for (const product of products) {
    await this.createProduct(product);
  }
});

// With type conversion helper
function transformTableRow(row: Record<string, string>) {
  return {
    name: row.name,
    price: parseFloat(row.price),
    active: row.active === 'yes',
    count: parseInt(row.count) || 0
  };
}
```

---

## 💻 Practice Exercises

1. Use rowsHash for form data
2. Use hashes for multiple items
3. Verify table contents
4. Transform table data
5. Create dynamic test data

---

## ✅ Best Practices

- ✅ Use meaningful column names
- ✅ Keep tables readable
- ✅ Transform data types properly
- ✅ Use appropriate table method
- ❌ Don't create overly wide tables
- ❌ Avoid complex nested data

---

## 📝 Quick Reference

```typescript
// Methods
dataTable.rowsHash()  // { key: value }
dataTable.hashes()    // [{ col: val }]
dataTable.raw()       // [[all], [cells]]
dataTable.rows()      // [[no], [headers]]

// Usage
const data = dataTable.hashes();
for (const row of data) {
  await action(row.column1, row.column2);
}

// Transformation
const items = dataTable.hashes().map(row => ({
  name: row.name,
  price: parseFloat(row.price)
}));
```

