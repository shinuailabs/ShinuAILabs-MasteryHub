# 📝 Quiz 03: Playwright Fundamentals

**Section:** 03_Playwright_Fundamentals | **Labs:** 251-350 | **Time:** 20 minutes

---

## Instructions
- Answer all 20 questions
- Each question is worth 5 points (100 total)
- 80+ = Pass | 90+ = Excellent

---

## Questions

### Setup & Basics (Q1-4)

**Q1.** Which command installs Playwright?
- A) `npm install playwright`
- B) `npm install -D @playwright/test`
- C) `npm install pw`
- D) `npm install test-playwright`

**Q2.** What is the default test file extension?
- A) `.test.ts`
- B) `.spec.ts`
- C) `.playwright.ts`
- D) Both A and B

**Q3.** Which browsers does Playwright support?
- A) Chrome only
- B) Chrome and Firefox
- C) Chromium, Firefox, and WebKit
- D) All browsers

**Q4.** What does `npx playwright codegen` do?
- A) Generates test code by recording
- B) Compiles TypeScript
- C) Runs all tests
- D) Creates a new project

### Locators (Q5-10)

**Q5.** Which is the RECOMMENDED locator strategy?
- A) `page.locator('#id')`
- B) `page.locator('.class')`
- C) `page.getByRole('button')`
- D) `page.locator('div > span')`

**Q6.** How to locate by test ID?
- A) `page.locator('[data-testid="login"]')`
- B) `page.getByTestId('login')`
- C) Both A and B
- D) `page.testId('login')`

**Q7.** What does `page.getByRole('button', { name: 'Submit' })` find?
- A) Any element with text "Submit"
- B) A button with accessible name "Submit"
- C) An input with value "Submit"
- D) A div with class "Submit"

**Q8.** How to locate by exact text?
- A) `page.getByText('Hello')`
- B) `page.getByText('Hello', { exact: true })`
- C) `page.locator('text=Hello')`
- D) All of the above

**Q9.** What does `.first()` do on a locator?
- A) Returns the first matching element
- B) Clicks the first element
- C) Checks if first exists
- D) Waits for first element

**Q10.** How to chain locators?
- A) `page.locator('.parent').locator('.child')`
- B) `page.locator('.parent > .child')`
- C) `page.locator('.parent').filter({ has: page.locator('.child') })`
- D) All of the above

### Actions (Q11-14)

**Q11.** Which fills an input field?
- A) `page.type('input', 'text')`
- B) `page.fill('input', 'text')`
- C) `locator.fill('text')`
- D) Both B and C

**Q12.** How to select a dropdown option?
- A) `locator.click('option')`
- B) `locator.selectOption('value')`
- C) `locator.choose('value')`
- D) `locator.pick('value')`

**Q13.** What does `await` do in Playwright tests?
- A) Optional, can be skipped
- B) Required for async operations
- C) Only needed for assertions
- D) Only needed for navigation

**Q14.** How to upload a file?
- A) `locator.upload('file.pdf')`
- B) `locator.setInputFiles('file.pdf')`
- C) `page.uploadFile('file.pdf')`
- D) `locator.attach('file.pdf')`

### Assertions (Q15-18)

**Q15.** Which assertion checks visibility?
- A) `expect(locator).toBeVisible()`
- B) `expect(locator).isVisible()`
- C) `expect(locator).visible()`
- D) `expect(locator).toShow()`

**Q16.** How to check page title?
- A) `expect(page.title()).toBe('Title')`
- B) `expect(page).toHaveTitle('Title')`
- C) `expect(await page.title()).toBe('Title')`
- D) Both B and C

**Q17.** What is a soft assertion?
- A) An assertion that always passes
- B) An assertion that doesn't stop the test on failure
- C) An assertion for soft elements
- D) An optional assertion

**Q18.** How to assert element count?
- A) `expect(locator).toHaveCount(5)`
- B) `expect(await locator.count()).toBe(5)`
- C) Both A and B
- D) `expect(locator.length).toBe(5)`

### Configuration (Q19-20)

**Q19.** Where is Playwright configured?
- A) `package.json`
- B) `playwright.config.ts`
- C) `.playwrightrc`
- D) `test.config.js`

**Q20.** How to run tests in headed mode?
- A) `npx playwright test --headed`
- B) `npx playwright test --show`
- C) `npx playwright test --browser`
- D) `npx playwright test --visible`

---

## Answer Key

| Q | Answer | Q | Answer |
|---|--------|---|--------|
| 1 | B | 11 | D |
| 2 | D | 12 | B |
| 3 | C | 13 | B |
| 4 | A | 14 | B |
| 5 | C | 15 | A |
| 6 | C | 16 | D |
| 7 | B | 17 | B |
| 8 | B | 18 | C |
| 9 | A | 19 | B |
| 10 | D | 20 | A |

---

## Score Interpretation

| Score | Level | Recommendation |
|-------|-------|----------------|
| 90-100 | Expert | Move to Section 04 |
| 80-89 | Proficient | Review weak areas |
| 70-79 | Developing | Review chapters 2-6 |
| Below 70 | Needs Practice | Redo Section 03 labs |

