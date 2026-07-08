# Part 10: Component Testing

## 📚 Overview
Playwright Component Testing allows testing UI components in isolation without a full application.

---

## 🎯 Key Concepts

### 1. Setup Component Testing

```bash
# Install component testing
npm init playwright@latest -- --ct

# This creates:
# - playwright-ct.config.ts
# - playwright/index.html
# - playwright/index.ts
```

### 2. Configuration

```typescript
// playwright-ct.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './tests',
  use: {
    ctPort: 3100,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### 3. Basic Component Test

```typescript
// Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('renders button', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  
  await expect(component).toContainText('Click me');
});

test('handles click', async ({ mount }) => {
  let clicked = false;
  
  const component = await mount(
    <Button onClick={() => clicked = true}>Click me</Button>
  );
  
  await component.click();
  expect(clicked).toBe(true);
});
```

### 4. Component with Props

```typescript
// Card.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Card } from './Card';

test('renders with props', async ({ mount }) => {
  const component = await mount(
    <Card 
      title="Test Title"
      description="Test description"
      image="/test.jpg"
    />
  );
  
  await expect(component.locator('.title')).toHaveText('Test Title');
  await expect(component.locator('.description')).toHaveText('Test description');
  await expect(component.locator('img')).toHaveAttribute('src', '/test.jpg');
});
```

### 5. Testing Events

```typescript
// Form.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { LoginForm } from './LoginForm';

test('submits form', async ({ mount }) => {
  const submissions: any[] = [];
  
  const component = await mount(
    <LoginForm onSubmit={(data) => submissions.push(data)} />
  );
  
  await component.locator('input[name="email"]').fill('user@example.com');
  await component.locator('input[name="password"]').fill('password123');
  await component.locator('button[type="submit"]').click();
  
  expect(submissions).toHaveLength(1);
  expect(submissions[0]).toEqual({
    email: 'user@example.com',
    password: 'password123'
  });
});
```

### 6. Testing State Changes

```typescript
// Counter.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Counter } from './Counter';

test('increments counter', async ({ mount }) => {
  const component = await mount(<Counter initialValue={0} />);
  
  await expect(component.locator('.count')).toHaveText('0');
  
  await component.locator('button.increment').click();
  await expect(component.locator('.count')).toHaveText('1');
  
  await component.locator('button.increment').click();
  await expect(component.locator('.count')).toHaveText('2');
});

test('decrements counter', async ({ mount }) => {
  const component = await mount(<Counter initialValue={5} />);
  
  await component.locator('button.decrement').click();
  await expect(component.locator('.count')).toHaveText('4');
});
```

### 7. Testing with Context

```typescript
// ThemedButton.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { ThemeProvider } from './ThemeContext';
import { ThemedButton } from './ThemedButton';

test('uses theme', async ({ mount }) => {
  const component = await mount(
    <ThemeProvider theme="dark">
      <ThemedButton>Dark Button</ThemedButton>
    </ThemeProvider>
  );
  
  await expect(component.locator('button')).toHaveClass(/dark-theme/);
});
```

### 8. Slots and Children

```typescript
// Modal.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Modal } from './Modal';

test('renders children', async ({ mount }) => {
  const component = await mount(
    <Modal isOpen={true}>
      <h2>Modal Title</h2>
      <p>Modal content goes here</p>
    </Modal>
  );
  
  await expect(component.locator('h2')).toHaveText('Modal Title');
  await expect(component.locator('p')).toHaveText('Modal content goes here');
});
```

### 9. Visual Testing Components

```typescript
// Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('button variants', async ({ mount }) => {
  // Primary button
  const primary = await mount(<Button variant="primary">Primary</Button>);
  await expect(primary).toHaveScreenshot('button-primary.png');
  
  // Secondary button
  const secondary = await mount(<Button variant="secondary">Secondary</Button>);
  await expect(secondary).toHaveScreenshot('button-secondary.png');
  
  // Disabled button
  const disabled = await mount(<Button disabled>Disabled</Button>);
  await expect(disabled).toHaveScreenshot('button-disabled.png');
});

test('button states', async ({ mount }) => {
  const component = await mount(<Button>Hover me</Button>);
  
  // Normal state
  await expect(component).toHaveScreenshot('button-normal.png');
  
  // Hover state
  await component.hover();
  await expect(component).toHaveScreenshot('button-hover.png');
  
  // Focus state
  await component.focus();
  await expect(component).toHaveScreenshot('button-focus.png');
});
```

---

## 💻 Practice Exercises

1. Set up component testing
2. Test component props
3. Test event handlers
4. Test state changes
5. Visual test components

---

## ✅ Best Practices

- ✅ Test components in isolation
- ✅ Test all prop variations
- ✅ Test user interactions
- ✅ Use visual snapshots
- ❌ Don't test implementation details
- ❌ Avoid testing third-party components

---

## 📝 Quick Reference

```typescript
// Mount component
const component = await mount(<Button>Click</Button>)

// With props
await mount(<Card title="Title" />)

// With events
await mount(<Form onSubmit={handler} />)

// Interact
await component.click()
await component.locator('input').fill('text')

// Assert
await expect(component).toContainText('text')
await expect(component).toHaveScreenshot('name.png')

// Run tests
npx playwright test -c playwright-ct.config.ts
```

