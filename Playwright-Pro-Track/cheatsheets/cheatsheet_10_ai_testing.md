# 🎯 AI Testing Cheat Sheet

## Quick Reference Card

---

## 🤖 AI Fundamentals

```
LLM = Large Language Model
- GPT-4, Claude, Gemini, Llama
- Input: Prompt (text)
- Output: Completion (text)

Token = Unit of text (~4 chars)
- Affects cost and context limit
- GPT-4: 128K tokens context

Temperature = Creativity (0-2)
- 0 = Deterministic
- 1 = Balanced
- 2 = Creative/Random
```

---

## 💬 Prompt Engineering

```
# Structure
[Role] + [Context] + [Task] + [Format]

# Example
"You are a Playwright test expert.
Given this HTML form: {html}
Generate a test that:
1. Fills all fields
2. Submits the form
3. Verifies success message
Output as TypeScript code."

# Tips
✅ Be specific
✅ Provide examples
✅ Specify output format
✅ Use step-by-step instructions
❌ Avoid ambiguity
```

---

## 🔌 OpenAI API

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a test automation expert.' },
    { role: 'user', content: 'Generate a login test for...' }
  ],
  temperature: 0.7,
  max_tokens: 2000
});

const generatedTest = response.choices[0].message.content;
```

---

## 🔧 GitHub Copilot

```typescript
// Copilot triggers on comments
// Type a comment, then Tab to accept

// Test login with valid credentials
// Copilot will suggest the full test

// Verify error message for invalid email
// Copilot suggests assertion code

// Tips:
// - Write descriptive comments
// - Accept with Tab
// - Reject with Esc
// - Cycle suggestions with Alt+]
```

---

## 👁️ Visual AI Testing

```typescript
// Applitools
import Eyes from '@applitools/eyes-playwright';

const eyes = new Eyes();
await eyes.open(page, 'App', 'Test Name');
await eyes.check('Homepage', Target.window());
await eyes.close();

// Playwright Visual
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixels: 100,
  threshold: 0.2
});
```

---

## 🔄 Self-Healing Locators

```typescript
// Concept: Multiple fallback locators
class SelfHealingLocator {
  private strategies = [
    () => this.page.getByTestId('submit'),
    () => this.page.getByRole('button', { name: 'Submit' }),
    () => this.page.locator('#submit-btn'),
    () => this.page.locator('button[type="submit"]')
  ];

  async find() {
    for (const strategy of this.strategies) {
      const locator = strategy();
      if (await locator.isVisible()) {
        return locator;
      }
    }
    throw new Error('Element not found');
  }
}
```

---

## 📊 AI Test Analysis

```typescript
// Analyze test failures with AI
async function analyzeFailure(error: string, screenshot: Buffer) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: `Analyze this test failure: ${error}` },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${screenshot.toString('base64')}` } }
      ]
    }]
  });
  return response.choices[0].message.content;
}
```

---

## 🛠️ AI Tools

| Tool | Use Case |
|------|----------|
| GitHub Copilot | Code completion |
| ChatGPT/Claude | Test generation |
| Applitools | Visual testing |
| Healenium | Self-healing |
| testRigor | NLP testing |
| mabl | AI test automation |

---

## ✅ Best Practices

```
✅ DO:
- Review AI-generated code
- Use AI for boilerplate
- Combine AI with human review
- Version control AI prompts
- Monitor AI costs

❌ DON'T:
- Trust AI blindly
- Skip code review
- Use AI for security tests
- Ignore hallucinations
- Hardcode API keys
```

---

*Keep this handy while coding!* 🚀
