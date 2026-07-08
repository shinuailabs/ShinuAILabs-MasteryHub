# 🎯 Playwright Cheat Sheet

## Quick Reference Card

---

## 🔧 Setup

```bash
# Install
npm init playwright@latest

# Run tests
npx playwright test
npx playwright test --headed
npx playwright test --debug
npx playwright test --ui

# Generate tests
npx playwright codegen https://example.com

# Show report
npx playwright show-report
```

---

## 📍 Locators (Best → Worst)

```typescript
// ✅ BEST: Role-based (accessible)
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'Home' })
page.getByRole('textbox', { name: 'Email' })

// ✅ GOOD: Label/Placeholder
page.getByLabel('Email')
page.getByPlaceholder('Enter email')
page.getByText('Welcome')

// ✅ GOOD: Test ID
page.getByTestId('submit-btn')

// ⚠️ OK: CSS/XPath
page.locator('#id')
page.locator('.class')
page.locator('[data-attr="value"]')

// ❌ AVOID: Fragile selectors
page.locator('div > div > span')
```

---

## 🖱️ Actions

```typescript
// Click
await locator.click()
await locator.dblclick()
await locator.click({ button: 'right' })

// Type
await locator.fill('text')        // Clear + type
await locator.type('text')        // Type char by char
await locator.press('Enter')
await locator.clear()

// Select
await locator.selectOption('value')
await locator.selectOption({ label: 'Option' })

// Check
await locator.check()
await locator.uncheck()
await locator.setChecked(true)

// Hover & Focus
await locator.hover()
await locator.focus()

// File Upload
await locator.setInputFiles('file.pdf')
await locator.setInputFiles(['file1.pdf', 'file2.pdf'])
```

---

## ✅ Assertions

```typescript
// Visibility
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toBeEnabled()
await expect(locator).toBeDisabled()

// Text
await expect(locator).toHaveText('exact text')
await expect(locator).toContainText('partial')
await expect(locator).toHaveValue('input value')

// Count
await expect(locator).toHaveCount(5)

// Page
await expect(page).toHaveTitle('Title')
await expect(page).toHaveURL(/pattern/)

// Soft assertions (don't stop test)
await expect.soft(locator).toBeVisible()
```

---

## 🌐 Navigation

```typescript
await page.goto('https://example.com')
await page.goBack()
await page.goForward()
await page.reload()

// Wait for navigation
await page.waitForURL('**/dashboard')
await page.waitForLoadState('networkidle')
```

---

## ⏱️ Waits

```typescript
// Auto-wait (built-in)
await locator.click()  // Waits automatically

// Explicit waits
await locator.waitFor()
await locator.waitFor({ state: 'visible' })
await page.waitForSelector('#element')
await page.waitForTimeout(1000)  // Avoid!

// Wait for response
await page.waitForResponse('**/api/data')
```

---

## 📸 Screenshots & Videos

```typescript
// Screenshot
await page.screenshot({ path: 'screenshot.png' })
await page.screenshot({ fullPage: true })
await locator.screenshot({ path: 'element.png' })

// Config for videos
// playwright.config.ts
use: {
  video: 'on-first-retry',
  screenshot: 'only-on-failure',
  trace: 'on-first-retry'
}
```

---

## 🔌 API Testing

```typescript
// GET
const response = await request.get('/api/users')
expect(response.ok()).toBeTruthy()
const data = await response.json()

// POST
const response = await request.post('/api/users', {
  data: { name: 'John' }
})

// With page context
const response = await page.request.get('/api/data')
```

---

## 🎭 Network Mocking

```typescript
// Mock response
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, name: 'Mock' }])
  })
})

// Abort request
await page.route('**/ads/**', route => route.abort())

// Modify request
await page.route('**/api/**', route => {
  route.continue({ headers: { ...route.request().headers(), 'X-Custom': 'value' } })
})
```

---

## �� Authentication

```typescript
// Save state
await page.context().storageState({ path: 'auth.json' })

// Use saved state
const context = await browser.newContext({
  storageState: 'auth.json'
})
```

---

## ⚙️ Config Essentials

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 4,
  
  use: {
    baseURL: 'https://example.com',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],
})
```

---

## 🏃 CLI Commands

| Command | Description |
|---------|-------------|
| `npx playwright test` | Run all tests |
| `npx playwright test file.spec.ts` | Run specific file |
| `npx playwright test -g "test name"` | Run by name |
| `npx playwright test --project=chromium` | Run specific project |
| `npx playwright test --headed` | Show browser |
| `npx playwright test --debug` | Debug mode |
| `npx playwright test --ui` | UI mode |
| `npx playwright codegen` | Record tests |
| `npx playwright show-report` | View report |

---

*Keep this handy while coding!* 🚀
