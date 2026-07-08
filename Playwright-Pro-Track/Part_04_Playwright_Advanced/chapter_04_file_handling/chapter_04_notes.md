# Part 04: File Handling

## 📚 Overview
Playwright supports file uploads, downloads, and file system operations for comprehensive testing.

---

## 🎯 Key Concepts

### 1. File Upload

```typescript
// Single file upload
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');

// Multiple files
await page.setInputFiles('input[type="file"]', [
  'path/to/file1.pdf',
  'path/to/file2.pdf'
]);

// Clear file input
await page.setInputFiles('input[type="file"]', []);

// Using locator
await page.getByLabel('Upload').setInputFiles('file.pdf');
```

### 2. File Chooser

```typescript
// Handle file chooser dialog
const [fileChooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByRole('button', { name: 'Upload' }).click()
]);

await fileChooser.setFiles('path/to/file.pdf');

// Multiple files
await fileChooser.setFiles(['file1.pdf', 'file2.pdf']);

// Check if multiple allowed
console.log(fileChooser.isMultiple());
```

### 3. Upload from Buffer

```typescript
// Create file from buffer
await page.setInputFiles('input[type="file"]', {
  name: 'test.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('Hello World')
});

// Upload generated content
const csvContent = 'name,email\nJohn,john@example.com';
await page.setInputFiles('input[type="file"]', {
  name: 'data.csv',
  mimeType: 'text/csv',
  buffer: Buffer.from(csvContent)
});
```

### 4. File Download

```typescript
// Wait for download
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('link', { name: 'Download' }).click()
]);

// Get download info
console.log('Filename:', download.suggestedFilename());
console.log('URL:', download.url());

// Save to specific path
await download.saveAs('downloads/myfile.pdf');

// Get download path
const path = await download.path();

// Cancel download
await download.cancel();
```

### 5. Download Verification

```typescript
import fs from 'fs';
import path from 'path';

test('verify download', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('.download-btn')
  ]);
  
  // Save file
  const filePath = path.join('downloads', download.suggestedFilename());
  await download.saveAs(filePath);
  
  // Verify file exists
  expect(fs.existsSync(filePath)).toBeTruthy();
  
  // Verify file content
  const content = fs.readFileSync(filePath, 'utf-8');
  expect(content).toContain('expected content');
  
  // Verify file size
  const stats = fs.statSync(filePath);
  expect(stats.size).toBeGreaterThan(0);
  
  // Cleanup
  fs.unlinkSync(filePath);
});
```

### 6. Download Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Accept downloads
    acceptDownloads: true,
  },
});

// Custom download path
const browser = await chromium.launch();
const context = await browser.newContext({
  acceptDownloads: true,
});
```

### 7. Drag and Drop Upload

```typescript
// Simulate drag and drop file upload
test('drag and drop upload', async ({ page }) => {
  await page.goto('/upload');
  
  // Create a file buffer
  const buffer = Buffer.from('file content');
  
  // Create DataTransfer with file
  const dataTransfer = await page.evaluateHandle((data) => {
    const dt = new DataTransfer();
    const file = new File([data], 'test.txt', { type: 'text/plain' });
    dt.items.add(file);
    return dt;
  }, buffer.toString());
  
  // Dispatch drop event
  await page.locator('.drop-zone').dispatchEvent('drop', { dataTransfer });
});
```

### 8. File System Operations

```typescript
import fs from 'fs';
import path from 'path';

test.beforeAll(async () => {
  // Create test directory
  if (!fs.existsSync('test-files')) {
    fs.mkdirSync('test-files');
  }
  
  // Create test file
  fs.writeFileSync('test-files/test.txt', 'Test content');
});

test.afterAll(async () => {
  // Cleanup
  fs.rmSync('test-files', { recursive: true, force: true });
});

test('use test files', async ({ page }) => {
  await page.setInputFiles('input', 'test-files/test.txt');
});
```

### 9. PDF and Image Handling

```typescript
// Generate PDF
test('download PDF', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('.export-pdf')
  ]);
  
  await download.saveAs('report.pdf');
  
  // Verify PDF (basic check)
  const content = fs.readFileSync('report.pdf');
  expect(content.slice(0, 4).toString()).toBe('%PDF');
});

// Screenshot comparison
test('image upload preview', async ({ page }) => {
  await page.setInputFiles('input[type="file"]', 'test-image.png');
  
  // Verify preview
  const preview = page.locator('.image-preview');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveScreenshot('preview.png');
});
```

---

## 💻 Practice Exercises

1. Upload single and multiple files
2. Handle file downloads
3. Verify downloaded content
4. Implement drag-drop upload
5. Test file type validation

---

## ✅ Best Practices

- ✅ Use test fixtures for files
- ✅ Clean up downloaded files
- ✅ Verify file content
- ✅ Test file size limits
- ❌ Don't commit test files to repo
- ❌ Avoid large file uploads in tests

---

## 📝 Quick Reference

```typescript
// Upload
await page.setInputFiles('input', 'file.pdf')
await page.setInputFiles('input', ['file1.pdf', 'file2.pdf'])

// File chooser
const [chooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.click('button')
])
await chooser.setFiles('file.pdf')

// Download
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('a.download')
])
await download.saveAs('path/file.pdf')

// From buffer
await page.setInputFiles('input', {
  name: 'file.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('content')
})
```

