# 📝 Quiz 04: Playwright Advanced

**Section:** 04_Playwright_Advanced | **Labs:** 351-446 | **Time:** 20 minutes

---

## Questions (20 total)

**Q1.** How to make API requests in Playwright?
- A) `page.fetch()`
- B) `request.get()`
- C) `page.request.get()`
- D) Both B and C

**Q2.** How to mock a network request?
- A) `page.route('**/api/**', route => route.fulfill({...}))`
- B) `page.mock('**/api/**')`
- C) `page.intercept('**/api/**')`
- D) `page.fake('**/api/**')`

**Q3.** What is storage state used for?
- A) Storing test data
- B) Saving authentication state
- C) Caching responses
- D) Storing screenshots

**Q4.** How to handle file uploads?
- A) `locator.setInputFiles(['file.pdf'])`
- B) `locator.upload('file.pdf')`
- C) `page.uploadFile('file.pdf')`
- D) `locator.attach('file.pdf')`

**Q5.** How to work with iframes?
- A) `page.frame('name')`
- B) `page.frameLocator('#iframe')`
- C) `page.iframe('#iframe')`
- D) Both A and B

**Q6.** How to emulate mobile devices?
- A) `{ ...devices['iPhone 12'] }`
- B) `page.setMobile(true)`
- C) `page.emulate('iPhone')`
- D) `browser.mobile()`

**Q7.** What is visual comparison testing?
- A) Comparing code
- B) Comparing screenshots
- C) Comparing URLs
- D) Comparing text

**Q8.** How to measure performance?
- A) `page.metrics()`
- B) `page.evaluate(() => performance.now())`
- C) `page.performance()`
- D) `page.timing()`

**Q9.** What is accessibility testing in Playwright?
- A) Testing keyboard navigation
- B) Using axe-core for WCAG compliance
- C) Testing screen readers
- D) All of the above

**Q10.** How to test React components?
- A) `@playwright/experimental-ct-react`
- B) `@playwright/react`
- C) `playwright-react`
- D) `react-playwright`

**Q11-20.** [Additional questions on parallel execution, custom reporters, browser contexts, etc.]

---

## Answer Key
| Q | Answer | Q | Answer |
|---|--------|---|--------|
| 1 | D | 6 | A |
| 2 | A | 7 | B |
| 3 | B | 8 | B |
| 4 | A | 9 | D |
| 5 | D | 10 | A |
