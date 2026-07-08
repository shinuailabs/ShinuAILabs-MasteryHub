# Part 03: Actions

## 📚 Overview
Actions are methods to interact with page elements - clicking, typing, selecting, and more.

---

## 🎯 Key Concepts

### 1. Click Actions

```typescript
// Basic click
await page.getByRole('button').click();

// Double click
await page.getByRole('button').dblclick();

// Right click
await page.getByRole('button').click({ button: 'right' });

// Click with modifiers
await page.getByRole('link').click({ modifiers: ['Control'] }); // Ctrl+Click
await page.getByRole('link').click({ modifiers: ['Shift'] });

// Click at position
await page.locator('.canvas').click({ position: { x: 100, y: 200 } });

// Force click (skip actionability checks)
await page.locator('.hidden-btn').click({ force: true });

// Click with timeout
await page.getByRole('button').click({ timeout: 5000 });
```

### 2. Text Input

```typescript
// Fill (clears and types)
await page.getByLabel('Email').fill('user@example.com');

// Type (character by character)
await page.getByLabel('Search').type('playwright');

// Press and type with delay
await page.getByLabel('Search').type('hello', { delay: 100 });

// Clear input
await page.getByLabel('Email').clear();

// Fill with empty string
await page.getByLabel('Email').fill('');
```

### 3. Keyboard Actions

```typescript
// Press single key
await page.keyboard.press('Enter');
await page.keyboard.press('Tab');
await page.keyboard.press('Escape');

// Key combinations
await page.keyboard.press('Control+A');
await page.keyboard.press('Control+C');
await page.keyboard.press('Control+V');
await page.keyboard.press('Shift+Tab');

// Press on element
await page.getByLabel('Search').press('Enter');

// Type and press
await page.getByLabel('Search').fill('query');
await page.getByLabel('Search').press('Enter');
```

### 4. Select and Dropdown

```typescript
// Select by value
await page.getByLabel('Country').selectOption('us');

// Select by label
await page.getByLabel('Country').selectOption({ label: 'United States' });

// Select by index
await page.getByLabel('Country').selectOption({ index: 2 });

// Multiple selection
await page.getByLabel('Colors').selectOption(['red', 'blue']);

// Get selected value
const value = await page.getByLabel('Country').inputValue();
```

### 5. Checkbox and Radio

```typescript
// Check checkbox
await page.getByLabel('Remember me').check();

// Uncheck checkbox
await page.getByLabel('Remember me').uncheck();

// Set checkbox state
await page.getByLabel('Remember me').setChecked(true);
await page.getByLabel('Remember me').setChecked(false);

// Check radio button
await page.getByLabel('Option A').check();

// Verify checked state
await expect(page.getByLabel('Remember me')).toBeChecked();
await expect(page.getByLabel('Remember me')).not.toBeChecked();
```

### 6. Hover and Focus

```typescript
// Hover over element
await page.getByRole('button').hover();

// Focus element
await page.getByLabel('Email').focus();

// Blur element
await page.getByLabel('Email').blur();

// Hover to reveal dropdown
await page.getByRole('button', { name: 'Menu' }).hover();
await page.getByRole('menuitem', { name: 'Settings' }).click();
```

### 7. Drag and Drop

```typescript
// Drag and drop
await page.locator('#source').dragTo(page.locator('#target'));

// Manual drag and drop
await page.locator('#source').hover();
await page.mouse.down();
await page.locator('#target').hover();
await page.mouse.up();

// Drag with steps
await page.locator('#slider').dragTo(page.locator('#slider'), {
  targetPosition: { x: 100, y: 0 }
});
```

### 8. File Upload

```typescript
// Single file
await page.getByLabel('Upload').setInputFiles('file.pdf');

// Multiple files
await page.getByLabel('Upload').setInputFiles(['file1.pdf', 'file2.pdf']);

// Clear files
await page.getByLabel('Upload').setInputFiles([]);

// With file chooser
const [fileChooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByRole('button', { name: 'Upload' }).click()
]);
await fileChooser.setFiles('file.pdf');
```

### 9. Scroll Actions

```typescript
// Scroll element into view
await page.getByText('Footer').scrollIntoViewIfNeeded();

// Scroll by amount
await page.mouse.wheel(0, 500);  // Scroll down

// Scroll to specific position
await page.evaluate(() => window.scrollTo(0, 1000));

// Scroll within element
await page.locator('.scrollable').evaluate(el => el.scrollTop = 500);
```

---

## 💻 Practice Exercises

1. Fill out a complete form
2. Handle dropdowns and checkboxes
3. Implement drag and drop
4. Upload files
5. Use keyboard shortcuts

---

## ✅ Best Practices

- ✅ Use `fill()` instead of `type()` for speed
- ✅ Wait for elements before actions
- ✅ Use `force: true` sparingly
- ✅ Clear inputs before filling
- ❌ Don't use arbitrary waits
- ❌ Avoid clicking by coordinates

---

## 📝 Quick Reference

```typescript
// Click
await locator.click()
await locator.dblclick()

// Input
await locator.fill('text')
await locator.clear()
await locator.press('Enter')

// Select
await locator.selectOption('value')

// Checkbox
await locator.check()
await locator.uncheck()

// Hover/Focus
await locator.hover()
await locator.focus()

// File
await locator.setInputFiles('path')

// Drag
await source.dragTo(target)
```

