# Part 09: Advanced POM Patterns

## 📚 Overview
Advanced patterns enhance Page Object Model with better organization, flexibility, and maintainability.

---

## 🎯 Key Concepts

### 1. Fluent Interface Pattern

```typescript
// pages/FormPage.ts
export class FormPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillName(name: string): Promise<this> {
    await this.page.getByLabel('Name').fill(name);
    return this;
  }

  async fillEmail(email: string): Promise<this> {
    await this.page.getByLabel('Email').fill(email);
    return this;
  }

  async selectCountry(country: string): Promise<this> {
    await this.page.getByLabel('Country').selectOption(country);
    return this;
  }

  async submit(): Promise<ConfirmationPage> {
    await this.page.getByRole('button', { name: 'Submit' }).click();
    return new ConfirmationPage(this.page);
  }
}

// Usage - method chaining
const confirmation = await formPage
  .fillName('John Doe')
  .then(p => p.fillEmail('john@example.com'))
  .then(p => p.selectCountry('US'))
  .then(p => p.submit());
```

### 2. Page Factory Pattern

```typescript
// pages/PageFactory.ts
import { Page } from '@playwright/test';

export class PageFactory {
  constructor(private page: Page) {}

  getLoginPage(): LoginPage {
    return new LoginPage(this.page);
  }

  getDashboardPage(): DashboardPage {
    return new DashboardPage(this.page);
  }

  getProductPage(): ProductPage {
    return new ProductPage(this.page);
  }

  getCheckoutPage(): CheckoutPage {
    return new CheckoutPage(this.page);
  }
}

// Usage
test('with page factory', async ({ page }) => {
  const factory = new PageFactory(page);
  
  const loginPage = factory.getLoginPage();
  await loginPage.login('user@example.com', 'password');
  
  const dashboard = factory.getDashboardPage();
  await dashboard.expectWelcomeMessage('John');
});
```

### 3. Screenplay Pattern

```typescript
// tasks/Login.ts
export class Login {
  constructor(
    private email: string,
    private password: string
  ) {}

  async performAs(actor: Actor) {
    const page = actor.page;
    await page.goto('/login');
    await page.getByLabel('Email').fill(this.email);
    await page.getByLabel('Password').fill(this.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
  }
}

// actors/Actor.ts
export class Actor {
  constructor(readonly page: Page) {}

  async attemptsTo(...tasks: Task[]) {
    for (const task of tasks) {
      await task.performAs(this);
    }
  }
}

// Usage
test('screenplay pattern', async ({ page }) => {
  const user = new Actor(page);
  await user.attemptsTo(
    new Login('user@example.com', 'password'),
    new NavigateTo('/dashboard'),
    new VerifyText('.welcome', 'Welcome')
  );
});
```

### 4. State Machine Pattern

```typescript
// pages/CheckoutFlow.ts
type CheckoutState = 'cart' | 'shipping' | 'payment' | 'confirmation';

export class CheckoutFlow {
  private state: CheckoutState = 'cart';
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async proceedToShipping(): Promise<this> {
    if (this.state !== 'cart') throw new Error('Invalid state');
    await this.page.getByRole('button', { name: 'Checkout' }).click();
    this.state = 'shipping';
    return this;
  }

  async proceedToPayment(): Promise<this> {
    if (this.state !== 'shipping') throw new Error('Invalid state');
    await this.page.getByRole('button', { name: 'Continue' }).click();
    this.state = 'payment';
    return this;
  }

  async completeOrder(): Promise<this> {
    if (this.state !== 'payment') throw new Error('Invalid state');
    await this.page.getByRole('button', { name: 'Place Order' }).click();
    this.state = 'confirmation';
    return this;
  }

  getState(): CheckoutState {
    return this.state;
  }
}
```

### 5. Decorator Pattern

```typescript
// decorators/logging.ts
function logAction(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    console.log(`Executing: ${key} with args:`, args);
    const result = await original.apply(this, args);
    console.log(`Completed: ${key}`);
    return result;
  };
  
  return descriptor;
}

// pages/LoginPage.ts
export class LoginPage {
  @logAction
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### 6. Strategy Pattern

```typescript
// strategies/LoginStrategy.ts
interface LoginStrategy {
  login(page: Page): Promise<void>;
}

class EmailPasswordLogin implements LoginStrategy {
  constructor(private email: string, private password: string) {}
  
  async login(page: Page) {
    await page.getByLabel('Email').fill(this.email);
    await page.getByLabel('Password').fill(this.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
  }
}

class SSOLogin implements LoginStrategy {
  constructor(private provider: string) {}
  
  async login(page: Page) {
    await page.getByRole('button', { name: `Login with ${this.provider}` }).click();
  }
}

// pages/LoginPage.ts
export class LoginPage {
  async loginWith(strategy: LoginStrategy) {
    await strategy.login(this.page);
  }
}

// Usage
await loginPage.loginWith(new EmailPasswordLogin('user@example.com', 'pass'));
await loginPage.loginWith(new SSOLogin('Google'));
```

### 7. Repository Pattern

```typescript
// repositories/UserRepository.ts
export class UserRepository {
  constructor(private request: APIRequestContext) {}

  async create(user: Partial<User>): Promise<User> {
    const response = await this.request.post('/api/users', { data: user });
    return response.json();
  }

  async findById(id: string): Promise<User> {
    const response = await this.request.get(`/api/users/${id}`);
    return response.json();
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const response = await this.request.put(`/api/users/${id}`, { data });
    return response.json();
  }

  async delete(id: string): Promise<void> {
    await this.request.delete(`/api/users/${id}`);
  }
}

// Usage in tests
test('with repository', async ({ request }) => {
  const userRepo = new UserRepository(request);
  const user = await userRepo.create({ name: 'Test User' });
  // ... test
  await userRepo.delete(user.id);
});
```

### 8. Lazy Loading Pattern

```typescript
// pages/DashboardPage.ts
export class DashboardPage {
  readonly page: Page;
  private _statsWidget?: StatsWidget;
  private _chartWidget?: ChartWidget;

  constructor(page: Page) {
    this.page = page;
  }

  // Lazy load components
  get statsWidget(): StatsWidget {
    if (!this._statsWidget) {
      this._statsWidget = new StatsWidget(this.page);
    }
    return this._statsWidget;
  }

  get chartWidget(): ChartWidget {
    if (!this._chartWidget) {
      this._chartWidget = new ChartWidget(this.page);
    }
    return this._chartWidget;
  }
}
```

---

## 💻 Practice Exercises

1. Implement fluent interface
2. Create page factory
3. Use strategy pattern
4. Build repository pattern
5. Apply decorator pattern

---

## ✅ Best Practices

- ✅ Choose patterns based on needs
- ✅ Keep patterns simple
- ✅ Document pattern usage
- ✅ Be consistent across codebase
- ❌ Don't over-engineer
- ❌ Avoid mixing too many patterns

---

## 📝 Quick Reference

```typescript
// Fluent Interface
async fillName(name: string): Promise<this> {
  await this.input.fill(name);
  return this;
}

// Page Factory
class PageFactory {
  getPage(): PageObject { return new PageObject(this.page); }
}

// Strategy
interface Strategy { execute(): Promise<void>; }
await page.executeWith(new ConcreteStrategy());

// Repository
const user = await userRepo.create(data);
await userRepo.delete(user.id);
```

