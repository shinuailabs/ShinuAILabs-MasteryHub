# Part 09: LLM Integration

## 📚 Overview
Integrating Large Language Models (LLMs) into test automation enables intelligent test generation and analysis.

---

## 🎯 Key Concepts

### 1. OpenAI API Integration

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTest(requirement: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a Playwright test automation expert. Generate TypeScript tests.',
      },
      {
        role: 'user',
        content: `Generate a Playwright test for: ${requirement}`,
      },
    ],
    temperature: 0.7,
  });
  
  return response.choices[0].message.content || '';
}

// Usage
const test = await generateTest('User login with valid credentials');
console.log(test);
```

### 2. Anthropic Claude Integration

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeFailure(error: string, code: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this test failure and suggest a fix:
        
Error: ${error}

Test Code:
${code}

Provide:
1. Root cause
2. Suggested fix
3. Prevention strategy`,
      },
    ],
  });
  
  return response.content[0].type === 'text' ? response.content[0].text : '';
}
```

### 3. Local LLM with Ollama

```typescript
// Using Ollama for local LLM
async function queryOllama(prompt: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'codellama',
      prompt: prompt,
      stream: false,
    }),
  });
  
  const data = await response.json();
  return data.response;
}

// Usage
const suggestion = await queryOllama(`
  Suggest improvements for this Playwright test:
  ${testCode}
`);
```

### 4. Test Generation Service

```typescript
// LLM-powered test generation service
class AITestGenerator {
  constructor(private llm: LLMClient) {}
  
  async generateFromRequirement(requirement: string): Promise<string> {
    const prompt = `
Generate a Playwright TypeScript test for:
${requirement}

Requirements:
- Use Page Object Model
- Include proper assertions
- Add meaningful test names
- Handle errors gracefully
`;
    
    return this.llm.complete(prompt);
  }
  
  async generateTestData(schema: object): Promise<object[]> {
    const prompt = `
Generate 5 test data objects matching this schema:
${JSON.stringify(schema, null, 2)}

Include:
- Valid data
- Edge cases
- Invalid data for negative tests
`;
    
    const response = await this.llm.complete(prompt);
    return JSON.parse(response);
  }
  
  async suggestAssertions(pageContent: string): Promise<string[]> {
    const prompt = `
Given this page content, suggest Playwright assertions:
${pageContent}

Return as JSON array of assertion strings.
`;
    
    const response = await this.llm.complete(prompt);
    return JSON.parse(response);
  }
}
```

### 5. Failure Analysis with LLM

```typescript
// AI-powered failure analysis
class AIFailureAnalyzer {
  constructor(private llm: LLMClient) {}
  
  async analyze(failure: TestFailure): Promise<FailureAnalysis> {
    const prompt = `
Analyze this test failure:

Test Name: ${failure.name}
Error: ${failure.error}
Stack Trace: ${failure.stackTrace}
Test Code: ${failure.code}

Provide JSON response:
{
  "rootCause": "string",
  "category": "locator|timeout|assertion|network|other",
  "suggestedFix": "string",
  "codeChange": "string",
  "confidence": 0.0-1.0
}
`;
    
    const response = await this.llm.complete(prompt);
    return JSON.parse(response);
  }
}
```

### 6. Prompt Templates

```typescript
// Reusable prompt templates
const prompts = {
  generateTest: (feature: string) => `
Generate a Playwright test for: ${feature}
Use TypeScript, include assertions, follow best practices.
`,
  
  fixTest: (error: string, code: string) => `
Fix this failing test:
Error: ${error}
Code: ${code}
Return only the fixed code.
`,
  
  reviewTest: (code: string) => `
Review this Playwright test and suggest improvements:
${code}
Focus on: reliability, maintainability, coverage.
`,
  
  generateLocators: (html: string) => `
Generate robust Playwright locators for this HTML:
${html}
Prefer role-based and test-id locators.
`,
};
```

### 7. Streaming Responses

```typescript
// Stream LLM responses for long outputs
async function* streamTestGeneration(requirement: string): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: `Generate test for: ${requirement}` },
    ],
    stream: true,
  });
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}

// Usage
for await (const chunk of streamTestGeneration('login flow')) {
  process.stdout.write(chunk);
}
```

### 8. Cost Optimization

```typescript
// Optimize LLM usage
class OptimizedLLMClient {
  private cache = new Map<string, string>();
  
  async complete(prompt: string): Promise<string> {
    // Check cache
    const cacheKey = this.hashPrompt(prompt);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    // Use smaller model for simple tasks
    const model = this.selectModel(prompt);
    
    const response = await this.llm.complete(prompt, { model });
    
    // Cache response
    this.cache.set(cacheKey, response);
    
    return response;
  }
  
  private selectModel(prompt: string): string {
    // Use GPT-3.5 for simple tasks, GPT-4 for complex
    return prompt.length < 500 ? 'gpt-3.5-turbo' : 'gpt-4';
  }
  
  private hashPrompt(prompt: string): string {
    // Simple hash for caching
    return Buffer.from(prompt).toString('base64').slice(0, 32);
  }
}
```

---

## 💻 Practice Exercises

1. Integrate OpenAI API
2. Set up local Ollama
3. Build test generator
4. Create failure analyzer
5. Implement caching

---

## ✅ Best Practices

- ✅ Use appropriate models
- ✅ Cache responses
- ✅ Handle rate limits
- ✅ Validate LLM output
- ❌ Don't share API keys
- ❌ Avoid excessive API calls

---

## 📝 Quick Reference

```typescript
// OpenAI
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }],
});

// Anthropic
const response = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  messages: [{ role: 'user', content: prompt }],
});

// Ollama (local)
fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({ model: 'codellama', prompt }),
});
```

