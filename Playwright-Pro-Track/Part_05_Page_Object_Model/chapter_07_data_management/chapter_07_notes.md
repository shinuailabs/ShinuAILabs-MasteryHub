# Part 07: Data Management

## 📚 Overview
Effective test data management ensures tests are reliable, maintainable, and independent.

---

## 🎯 Key Concepts

### 1. Test Data Objects

```typescript
// data/users.ts
export interface User {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

export const testUsers: Record<string, User> = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  standard: {
    email: 'user@example.com',
    password: 'user123',
    name: 'Standard User',
    role: 'user',
  },
  guest: {
    email: 'guest@example.com',
    password: 'guest123',
    name: 'Guest User',
    role: 'guest',
  },
};
```

### 2. Using Test Data

```typescript
// tests/login.spec.ts
import { testUsers } from '../data/users';

test('admin login', async ({ loginPage }) => {
  const admin = testUsers.admin;
  await loginPage.login(admin.email, admin.password);
  await expect(loginPage.page).toHaveURL('/admin/dashboard');
});

test('user login', async ({ loginPage }) => {
  const user = testUsers.standard;
  await loginPage.login(user.email, user.password);
  await expect(loginPage.page).toHaveURL('/dashboard');
});
```

### 3. Data Factories

```typescript
// data/factories.ts
import { faker } from '@faker-js/faker';

export function createUser(overrides: Partial<User> = {}): User {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    role: 'user',
    ...overrides,
  };
}

export function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    ...overrides,
  };
}

// Usage
test('create user', async ({ page }) => {
  const user = createUser({ role: 'admin' });
  // Use unique user data
});
```

### 4. Environment-Based Data

```typescript
// data/config.ts
interface TestConfig {
  baseUrl: string;
  apiUrl: string;
  users: Record<string, User>;
}

const configs: Record<string, TestConfig> = {
  development: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:4000/api',
    users: {
      admin: { email: 'dev-admin@test.com', password: 'devpass' },
    },
  },
  staging: {
    baseUrl: 'https://staging.example.com',
    apiUrl: 'https://staging-api.example.com',
    users: {
      admin: { email: 'staging-admin@test.com', password: 'stagingpass' },
    },
  },
};

export const config = configs[process.env.TEST_ENV || 'development'];
```

### 5. JSON Data Files

```typescript
// data/products.json
{
  "products": [
    { "id": 1, "name": "Product A", "price": 29.99 },
    { "id": 2, "name": "Product B", "price": 49.99 }
  ]
}

// data/loader.ts
import productsData from './products.json';

export const products = productsData.products;

// Usage
test('product list', async ({ productPage }) => {
  for (const product of products) {
    await productPage.verifyProduct(product);
  }
});
```

### 6. API Data Setup

```typescript
// data/api-setup.ts
import { APIRequestContext } from '@playwright/test';

export class TestDataAPI {
  constructor(private request: APIRequestContext) {}

  async createUser(data: Partial<User>): Promise<User> {
    const response = await this.request.post('/api/users', { data });
    return response.json();
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await this.request.post('/api/products', { data });
    return response.json();
  }

  async deleteUser(id: string): Promise<void> {
    await this.request.delete(`/api/users/${id}`);
  }

  async cleanup(userId: string): Promise<void> {
    await this.deleteUser(userId);
  }
}

// Usage in fixture
export const test = base.extend({
  testData: async ({ request }, use) => {
    const api = new TestDataAPI(request);
    const user = await api.createUser(createUser());
    await use({ user, api });
    await api.cleanup(user.id);
  },
});
```

### 7. Data Builders

```typescript
// data/builders.ts
export class UserBuilder {
  private user: Partial<User> = {};

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  withRole(role: User['role']): this {
    this.user.role = role;
    return this;
  }

  asAdmin(): this {
    return this.withRole('admin');
  }

  build(): User {
    return {
      email: this.user.email || faker.internet.email(),
      password: this.user.password || faker.internet.password(),
      name: this.user.name || faker.person.fullName(),
      role: this.user.role || 'user',
    };
  }
}

// Usage
const adminUser = new UserBuilder()
  .withEmail('admin@test.com')
  .asAdmin()
  .build();
```

### 8. Data in Page Objects

```typescript
// pages/CheckoutPage.ts
export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillShippingForm(address: ShippingAddress) {
    await this.page.getByLabel('Street').fill(address.street);
    await this.page.getByLabel('City').fill(address.city);
    await this.page.getByLabel('State').selectOption(address.state);
    await this.page.getByLabel('ZIP').fill(address.zip);
  }

  async fillPaymentForm(payment: PaymentInfo) {
    await this.page.getByLabel('Card Number').fill(payment.cardNumber);
    await this.page.getByLabel('Expiry').fill(payment.expiry);
    await this.page.getByLabel('CVV').fill(payment.cvv);
  }
}

// data/checkout.ts
export const validShippingAddress: ShippingAddress = {
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  zip: '10001',
};

export const validPayment: PaymentInfo = {
  cardNumber: '4242424242424242',
  expiry: '12/25',
  cvv: '123',
};
```

---

## 💻 Practice Exercises

1. Create test data objects
2. Implement data factories
3. Build data builders
4. Set up API data creation
5. Use environment-based data

---

## ✅ Best Practices

- ✅ Use factories for unique data
- ✅ Clean up test data after tests
- ✅ Separate data from tests
- ✅ Use builders for complex objects
- ❌ Don't hardcode data in tests
- ❌ Avoid sharing data between tests

---

## 📝 Quick Reference

```typescript
// Test data object
export const testData = { user: { email: 'test@test.com' } };

// Factory
export function createUser(): User {
  return { email: faker.internet.email() };
}

// Builder
const user = new UserBuilder().withEmail('test@test.com').build();

// API setup
const user = await api.createUser(data);
await api.cleanup(user.id);

// Environment config
const config = configs[process.env.TEST_ENV];
```

