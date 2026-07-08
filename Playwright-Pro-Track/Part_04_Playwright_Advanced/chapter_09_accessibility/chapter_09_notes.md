# Part 09: Accessibility Testing

## 📚 Overview
Accessibility testing ensures your application is usable by people with disabilities, following WCAG guidelines.

---

## 🎯 Key Concepts

### 1. Axe Integration

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('accessibility scan', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page }).analyze();
  
  expect(results.violations).toEqual([]);
});
```

### 2. Scan Options

```typescript
test('accessibility with options', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .exclude('.third-party-widget')
    .include('.main-content')
    .analyze();
  
  expect(results.violations).toHaveLength(0);
});
```

### 3. Specific Rules

```typescript
test('check specific rules', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast', 'label', 'image-alt'])
    .analyze();
  
  // Log violations
  for (const violation of results.violations) {
    console.log(`Rule: ${violation.id}`);
    console.log(`Impact: ${violation.impact}`);
    console.log(`Description: ${violation.description}`);
    for (const node of violation.nodes) {
      console.log(`  Element: ${node.html}`);
    }
  }
  
  expect(results.violations).toHaveLength(0);
});
```

### 4. ARIA Attributes

```typescript
test('ARIA attributes', async ({ page }) => {
  await page.goto('/');
  
  // Check aria-label
  const button = page.getByRole('button', { name: 'Submit' });
  await expect(button).toHaveAttribute('aria-label', 'Submit form');
  
  // Check aria-expanded
  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  
  // Check aria-hidden
  const icon = page.locator('.decorative-icon');
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
});
```

### 5. Keyboard Navigation

```typescript
test('keyboard navigation', async ({ page }) => {
  await page.goto('/');
  
  // Tab through elements
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '/home');
  
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '/about');
  
  // Enter to activate
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/about');
  
  // Escape to close modal
  await page.click('.open-modal');
  await page.keyboard.press('Escape');
  await expect(page.locator('.modal')).toBeHidden();
});
```

### 6. Focus Management

```typescript
test('focus management', async ({ page }) => {
  await page.goto('/');
  
  // Check focus visible
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toBeVisible();
  
  // Check focus trap in modal
  await page.click('.open-modal');
  const modal = page.locator('.modal');
  
  // Tab should stay within modal
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.closest('.modal'));
    expect(focusedElement).not.toBeNull();
  }
});
```

### 7. Color Contrast

```typescript
test('color contrast', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast'])
    .analyze();
  
  // Check specific elements
  const text = page.locator('.important-text');
  const styles = await text.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      color: computed.color,
      backgroundColor: computed.backgroundColor
    };
  });
  
  console.log('Text color:', styles.color);
  console.log('Background:', styles.backgroundColor);
  
  expect(results.violations).toHaveLength(0);
});
```

### 8. Screen Reader Testing

```typescript
test('screen reader content', async ({ page }) => {
  await page.goto('/');
  
  // Check alt text
  const images = page.locator('img');
  for (const img of await images.all()) {
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt).not.toBe('image');  // Not generic
  }
  
  // Check heading hierarchy
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .map(h => ({ tag: h.tagName, text: h.textContent }));
  });
  
  // Should have exactly one h1
  const h1s = headings.filter(h => h.tag === 'H1');
  expect(h1s).toHaveLength(1);
  
  // Check form labels
  const inputs = page.locator('input:not([type="hidden"])');
  for (const input of await inputs.all()) {
    const id = await input.getAttribute('id');
    const label = page.locator(`label[for="${id}"]`);
    await expect(label).toBeVisible();
  }
});
```

### 9. Accessibility Report

```typescript
test('generate accessibility report', async ({ page }, testInfo) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page }).analyze();
  
  // Attach report to test
  await testInfo.attach('accessibility-report', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json'
  });
  
  // Summary
  console.log('Violations:', results.violations.length);
  console.log('Passes:', results.passes.length);
  console.log('Incomplete:', results.incomplete.length);
  
  expect(results.violations).toHaveLength(0);
});
```

---

## 💻 Practice Exercises

1. Run axe accessibility scans
2. Test keyboard navigation
3. Verify ARIA attributes
4. Check color contrast
5. Test focus management

---

## ✅ Best Practices

- ✅ Test with axe-core
- ✅ Verify keyboard navigation
- ✅ Check ARIA attributes
- ✅ Test with screen readers
- ❌ Don't ignore violations
- ❌ Avoid decorative alt text

---

## 📝 Quick Reference

```typescript
// Axe scan
const results = await new AxeBuilder({ page }).analyze()
expect(results.violations).toHaveLength(0)

// With options
new AxeBuilder({ page })
  .withTags(['wcag2aa'])
  .exclude('.skip')
  .analyze()

// Keyboard
await page.keyboard.press('Tab')
await expect(page.locator(':focus')).toBeVisible()

// ARIA
await expect(el).toHaveAttribute('aria-label', 'text')
await expect(el).toHaveAttribute('aria-expanded', 'true')

// Role-based locators
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'Home' })
```

