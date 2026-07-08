# Part 05: Iframes & Windows

## 📚 Overview
Playwright provides robust support for working with iframes, popups, and multiple browser windows.

---

## 🎯 Key Concepts

### 1. Frame Locator

```typescript
// Recommended approach - frameLocator
const frame = page.frameLocator('#my-iframe');
await frame.getByRole('button', { name: 'Submit' }).click();

// Chain with regular locators
await page.frameLocator('#iframe').locator('.content').click();

// By name attribute
const frame = page.frameLocator('iframe[name="content"]');

// By URL
const frame = page.frameLocator('iframe[src*="widget"]');
```

### 2. Nested Frames

```typescript
// Access nested iframe
const outer = page.frameLocator('#outer-frame');
const inner = outer.frameLocator('#inner-frame');
await inner.getByText('Click me').click();

// Multiple levels
await page
  .frameLocator('#level1')
  .frameLocator('#level2')
  .frameLocator('#level3')
  .locator('button')
  .click();
```

### 3. Frame Object

```typescript
// Get frame by name
const frame = page.frame('frame-name');

// Get frame by URL
const frame = page.frame({ url: /widget/ });

// Get all frames
const frames = page.frames();
for (const frame of frames) {
  console.log(frame.url());
}

// Wait for frame
await page.waitForSelector('iframe');
const frame = page.frame({ url: /content/ });
```

### 4. Frame Actions

```typescript
// Interact within frame
const frame = page.frameLocator('#iframe');

// Click
await frame.getByRole('button').click();

// Fill form
await frame.getByLabel('Email').fill('user@example.com');

// Assert
await expect(frame.getByText('Success')).toBeVisible();

// Get text
const text = await frame.locator('.message').textContent();
```

### 5. New Windows/Tabs

```typescript
// Handle popup window
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open' }).click()
]);

// Wait for popup to load
await popup.waitForLoadState();

// Interact with popup
await popup.getByRole('button').click();
await expect(popup).toHaveTitle('Popup Title');

// Close popup
await popup.close();
```

### 6. Multiple Pages

```typescript
// Get all pages in context
const pages = context.pages();

// Switch between pages
for (const p of pages) {
  console.log(await p.title());
}

// Bring page to front
await page.bringToFront();

// Close specific page
await pages[1].close();
```

### 7. Window Features

```typescript
// Handle window.open with features
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.evaluate(() => {
    window.open('https://example.com', '_blank', 'width=400,height=300');
  })
]);

// Get popup URL
console.log(popup.url());

// Handle target="_blank" links
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]')
]);
await newPage.waitForLoadState();
```

### 8. Dialog Handling

```typescript
// Handle alert
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});

// Handle confirm
page.on('dialog', async dialog => {
  if (dialog.type() === 'confirm') {
    await dialog.accept();  // or dialog.dismiss()
  }
});

// Handle prompt
page.on('dialog', async dialog => {
  if (dialog.type() === 'prompt') {
    await dialog.accept('User input');
  }
});

// One-time handler
page.once('dialog', dialog => dialog.accept());
await page.click('.trigger-alert');
```

### 9. Cross-Origin Frames

```typescript
// Cross-origin iframes work the same way
const frame = page.frameLocator('iframe[src*="external-domain.com"]');
await frame.getByRole('button').click();

// Note: Some actions may be restricted by browser security
// Playwright handles most cross-origin scenarios automatically
```

---

## 💻 Practice Exercises

1. Interact with iframe content
2. Handle nested iframes
3. Work with popup windows
4. Handle browser dialogs
5. Manage multiple tabs

---

## ✅ Best Practices

- ✅ Use frameLocator for iframes
- ✅ Wait for popups before interacting
- ✅ Handle dialogs with event listeners
- ✅ Close popups after use
- ❌ Don't assume frame order
- ❌ Avoid hardcoding frame indices

---

## 📝 Quick Reference

```typescript
// Frame locator
page.frameLocator('#iframe')
page.frameLocator('iframe[name="name"]')

// Nested frames
page.frameLocator('#outer').frameLocator('#inner')

// Popup
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('a')
])

// New page
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]')
])

// Dialog
page.on('dialog', dialog => dialog.accept())

// All pages
context.pages()
```

