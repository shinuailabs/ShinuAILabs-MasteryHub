/**
 * Lab 1001: AI Test Generator CLI - Prompt Engineering
 *
 * CONCEPT:
 * Effective prompt engineering is crucial for generating high-quality tests.
 * This lab covers advanced prompting techniques specifically designed for
 * test generation, including few-shot learning and chain-of-thought prompting.
 *
 * BULLET POINTS:
 * - Few-shot prompting with test examples
 * - Chain-of-thought for complex test scenarios
 * - Context window optimization
 * - Prompt templates for different test types
 * - Dynamic prompt construction based on page analysis
 */

import { PageAnalysis, PageElement } from './lab999_page_analyzer';

interface PromptTemplate {
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  examples?: string[];
}

class PromptBuilder {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Login page template
    this.templates.set('login', {
      name: 'Login Page Tests',
      systemPrompt: `You are a security-focused test automation expert.
Generate tests that cover authentication flows including:
- Valid login scenarios
- Invalid credentials handling
- Password visibility toggle
- Remember me functionality
- Session management
- Security headers validation`,
      userPromptTemplate: `Generate Playwright tests for this login page:
{pageAnalysis}

Include tests for:
1. Successful login with valid credentials
2. Failed login with invalid email
3. Failed login with invalid password
4. Empty field validation
5. Password masking
6. Login button state management`,
      examples: [
        `test('should show error for invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('invalid@test.com');
  await page.getByLabel('Password').fill('wrongpassword');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid credentials');
});`
      ]
    });

    // E-commerce template
    this.templates.set('ecommerce', {
      name: 'E-commerce Tests',
      systemPrompt: `You are an e-commerce testing specialist.
Generate tests covering shopping flows:
- Product browsing and search
- Cart operations
- Checkout process
- Payment handling
- Order confirmation`,
      userPromptTemplate: `Generate Playwright tests for this e-commerce page:
{pageAnalysis}

Focus on user journey tests that verify the complete shopping experience.`,
      examples: []
    });

    // Form validation template
    this.templates.set('form', {
      name: 'Form Validation Tests',
      systemPrompt: `You are a form testing expert.
Generate comprehensive form validation tests:
- Required field validation
- Format validation (email, phone, etc.)
- Boundary testing
- Error message verification
- Success state handling`,
      userPromptTemplate: `Generate form validation tests:
{pageAnalysis}

Test all input fields with valid and invalid data.`,
      examples: []
    });
  }

  buildPrompt(analysis: PageAnalysis, templateName?: string): { system: string; user: string } {
    const template = this.selectTemplate(analysis, templateName);
    
    const userPrompt = template.userPromptTemplate
      .replace('{pageAnalysis}', this.formatAnalysis(analysis));

    // Add few-shot examples if available
    let fullUserPrompt = userPrompt;
    if (template.examples && template.examples.length > 0) {
      fullUserPrompt += '\n\nExample tests for reference:\n' + template.examples.join('\n\n');
    }

    return {
      system: template.systemPrompt,
      user: fullUserPrompt
    };
  }

  private selectTemplate(analysis: PageAnalysis, templateName?: string): PromptTemplate {
    if (templateName && this.templates.has(templateName)) {
      return this.templates.get(templateName)!;
    }

    // Auto-select based on page analysis
    if (analysis.metadata.hasLogin) return this.templates.get('login')!;
    if (analysis.metadata.hasCart) return this.templates.get('ecommerce')!;
    if (analysis.forms.length > 0) return this.templates.get('form')!;

    return this.templates.get('form')!; // Default
  }

  private formatAnalysis(analysis: PageAnalysis): string {
    return `
URL: ${analysis.url}
Title: ${analysis.title}
Page Type: ${analysis.metadata.pageType}

Interactive Elements (${analysis.elements.length}):
${this.formatElements(analysis.elements)}

Forms (${analysis.forms.length}):
${JSON.stringify(analysis.forms, null, 2)}
`;
  }

  private formatElements(elements: PageElement[]): string {
    return elements.slice(0, 30).map(el => 
      `- ${el.type}: ${el.selector} ${el.text ? `"${el.text}"` : ''} ${el.label ? `[label: ${el.label}]` : ''}`
    ).join('\n');
  }

  // Chain-of-thought prompting for complex scenarios
  buildChainOfThoughtPrompt(analysis: PageAnalysis): string {
    return `Analyze this page step by step:

1. First, identify the main purpose of this page
2. List all user interactions possible
3. Determine the expected outcomes for each interaction
4. Identify edge cases and error scenarios
5. Generate tests based on this analysis

Page Data:
${this.formatAnalysis(analysis)}

Think through each step before generating tests.`;
  }
}

/**
 * EXERCISE:
 * 1. Create a template for API documentation pages
 * 2. Implement dynamic example selection based on page type
 * 3. Add prompt optimization to stay within token limits
 * 4. Create a feedback loop to improve prompts based on test quality
 */

/**
 * LEARNING:
 * - Different page types need different prompting strategies
 * - Few-shot examples dramatically improve output quality
 * - Chain-of-thought helps with complex test scenarios
 * - Context formatting affects AI understanding
 *
 * ONE LINER:
 * "The quality of your prompt determines the quality of your tests."
 */

export { PromptBuilder, PromptTemplate };

