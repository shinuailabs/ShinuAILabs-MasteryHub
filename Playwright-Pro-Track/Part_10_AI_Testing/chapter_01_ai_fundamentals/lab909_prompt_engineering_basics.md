# Lab 909: Prompt Engineering Basics for QA

## Concept
Prompt Engineering is the art of crafting effective inputs to get desired outputs from AI models. For QA engineers, well-designed prompts can generate accurate tests, debug issues faster, and create comprehensive test documentation. The quality of your prompt directly determines the quality of AI-generated content.

## Bullet Points
- **Prompt**: The input text you provide to an AI model
- **System Prompt**: Sets the AI's role and behavior
- **User Prompt**: The specific request or question
- **Few-shot Learning**: Providing examples in the prompt
- **Zero-shot**: Asking without examples
- **Chain of Thought**: Asking AI to explain reasoning step-by-step
- **Temperature**: Controls creativity (lower = more focused)
- **Specificity**: More specific prompts yield better results

## Examples

### Example 1: Basic vs Effective Prompts
```typescript
// ❌ Bad Prompt (vague)
const badPrompt = "Write a test for login";

// ✅ Good Prompt (specific)
const goodPrompt = `
Write a Playwright test in TypeScript for the login functionality.

Context:
- URL: https://example.com/login
- Email field: input[name="email"]
- Password field: input[name="password"]
- Submit button: button[type="submit"]
- Success redirect: /dashboard

Requirements:
- Test valid login with credentials: test@example.com / Password123
- Test invalid login shows error message
- Use async/await syntax
- Include proper assertions with expect()
`;
```

### Example 2: Few-Shot Prompting
```typescript
// Providing examples helps AI understand the pattern
const fewShotPrompt = `
Generate Playwright tests following this pattern:

Example 1:
Input: "User can add item to cart"
Output:
test('User can add item to cart', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('.cart-count')).toHaveText('1');
});

Example 2:
Input: "User can remove item from cart"
Output:
test('User can remove item from cart', async ({ page }) => {
  await page.goto('/cart');
  await page.click('[data-testid="remove-item"]');
  await expect(page.locator('.cart-empty')).toBeVisible();
});

Now generate for:
Input: "User can update item quantity in cart"
Output:
`;
```

### Example 3: Chain of Thought for Debugging
```typescript
const cotPrompt = `
My test is failing. Let's debug step by step.

Error:
TimeoutError: locator.click: Timeout 30000ms exceeded

Test code:
await page.goto('/checkout');
await page.click('#pay-button');

Think through this step by step:
1. What could cause a timeout on click?
2. What should I check first?
3. What are possible solutions?
4. Provide the fixed code.
`;
```

## Exercise

### Task 1: Improve These Prompts
Transform these vague prompts into effective ones:
1. "Write API tests"
2. "Help me with Playwright"
3. "Generate test data"

### Task 2: Create a Prompt Template
Design a reusable prompt template for generating Page Object Models.

### Task 3: Few-Shot Practice
Create a few-shot prompt for generating test assertions.

## Coding Questions & Solutions

### Question 1: Build a prompt template system
```typescript
// Solution:
interface PromptTemplate {
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
}

class PromptBuilder {
  private templates: Map<string, PromptTemplate> = new Map();

  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.name, template);
  }

  build(templateName: string, variables: Record<string, string>): {
    system: string;
    user: string;
  } {
    const template = this.templates.get(templateName);
    if (!template) throw new Error(`Template ${templateName} not found`);

    let userPrompt = template.userPromptTemplate;
    for (const [key, value] of Object.entries(variables)) {
      userPrompt = userPrompt.replace(`{{${key}}}`, value);
    }

    return {
      system: template.systemPrompt,
      user: userPrompt
    };
  }
}

// Usage
const builder = new PromptBuilder();

builder.registerTemplate({
  name: 'test-generation',
  systemPrompt: 'You are a senior QA engineer expert in Playwright testing.',
  userPromptTemplate: `
Generate a Playwright test for: {{feature}}

URL: {{url}}
Framework: {{framework}}

Requirements:
{{requirements}}
`,
  variables: ['feature', 'url', 'framework', 'requirements']
});

const prompt = builder.build('test-generation', {
  feature: 'User Registration',
  url: 'https://example.com/register',
  framework: 'Playwright with TypeScript',
  requirements: '- Validate email format\n- Check password strength'
});
```

### Question 2: Prompt optimizer
```typescript
// Solution: Analyze and improve prompts
interface PromptAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  improvedPrompt: string;
}

function analyzePrompt(prompt: string): PromptAnalysis {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check for specificity
  if (prompt.length < 50) {
    issues.push('Prompt is too short');
    suggestions.push('Add more context and details');
    score -= 20;
  }

  // Check for examples
  if (!prompt.includes('example') && !prompt.includes('Example')) {
    suggestions.push('Consider adding examples (few-shot learning)');
    score -= 10;
  }

  // Check for clear structure
  if (!prompt.includes(':') && !prompt.includes('-')) {
    issues.push('Lacks clear structure');
    suggestions.push('Use bullet points or sections');
    score -= 15;
  }

  // Check for output format specification
  if (!prompt.toLowerCase().includes('format') && 
      !prompt.toLowerCase().includes('output')) {
    suggestions.push('Specify desired output format');
    score -= 10;
  }

  const improvedPrompt = `
${prompt}

Please provide:
- Clear, well-structured code
- Comments explaining key parts
- Error handling where appropriate
`.trim();

  return { score, issues, suggestions, improvedPrompt };
}

// Usage
const analysis = analyzePrompt("Write a login test");
console.log(analysis);
// { score: 45, issues: [...], suggestions: [...], improvedPrompt: "..." }
```

### Question 3: Context-aware prompt generator
```typescript
// Solution:
interface TestContext {
  pageUrl: string;
  elements: { name: string; selector: string }[];
  actions: string[];
  assertions: string[];
}

function generateContextualPrompt(context: TestContext): string {
  return `
You are a Playwright testing expert. Generate a comprehensive test.

## Page Information
- URL: ${context.pageUrl}

## Available Elements
${context.elements.map(e => `- ${e.name}: \`${e.selector}\``).join('\n')}

## Actions to Test
${context.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

## Expected Assertions
${context.assertions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

## Output Requirements
- Use TypeScript with Playwright Test
- Follow AAA pattern (Arrange, Act, Assert)
- Include descriptive test names
- Add comments for complex logic
- Handle potential race conditions
`.trim();
}

// Usage
const prompt = generateContextualPrompt({
  pageUrl: 'https://shop.example.com/cart',
  elements: [
    { name: 'Quantity Input', selector: '[data-testid="qty-input"]' },
    { name: 'Update Button', selector: '[data-testid="update-cart"]' },
    { name: 'Total Price', selector: '.cart-total' }
  ],
  actions: ['Change quantity to 3', 'Click update button'],
  assertions: ['Total price updates correctly', 'Success message appears']
});
```

## Learning
- Good prompts are specific, structured, and provide context
- Few-shot examples dramatically improve output quality
- Chain of thought helps with complex reasoning tasks
- Always specify the desired output format
- Iterate and refine prompts based on results
- Save effective prompts as templates for reuse

## One Liner
> "A well-crafted prompt is worth a thousand iterations - invest time in prompt engineering to save time in testing."

