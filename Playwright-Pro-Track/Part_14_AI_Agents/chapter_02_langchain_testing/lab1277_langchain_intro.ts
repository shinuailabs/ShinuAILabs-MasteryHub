/**
 * Lab 1277: LangChain for Test Automation
 *
 * CONCEPT:
 * LangChain is a framework for building applications with LLMs. It provides
 * abstractions for chains, agents, memory, and tools - perfect for building
 * intelligent test automation systems.
 *
 * BULLET POINTS:
 * - LLMs: Language models (GPT-4, Claude, etc.)
 * - Chains: Sequences of LLM calls
 * - Agents: LLMs that decide which tools to use
 * - Tools: Functions the agent can call
 * - Memory: Conversation history management
 *
 * EXAMPLES:
 * - Test generation from requirements
 * - Intelligent test data creation
 * - Automated bug analysis
 */

// Note: Install with: npm install langchain @langchain/openai

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

// ============================================
// 1. Basic LLM Usage
// ============================================

async function basicLLMUsage() {
  const model = new ChatOpenAI({
    modelName: 'gpt-4',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const response = await model.invoke(
    'Generate a Playwright test for a login form with email and password fields.'
  );

  console.log(response.content);
}

// ============================================
// 2. Prompt Templates
// ============================================

const testGeneratorPrompt = PromptTemplate.fromTemplate(`
You are a Playwright test automation expert.

Generate a test for the following scenario:
Feature: {feature}
Steps: {steps}

Requirements:
- Use TypeScript
- Use role-based locators
- Include assertions
- Follow best practices

Output only the test code.
`);

async function generateTestWithTemplate() {
  const model = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0 });
  const outputParser = new StringOutputParser();

  const chain = RunnableSequence.from([
    testGeneratorPrompt,
    model,
    outputParser,
  ]);

  const result = await chain.invoke({
    feature: 'User Login',
    steps: '1. Navigate to login page\n2. Enter email\n3. Enter password\n4. Click submit\n5. Verify dashboard',
  });

  console.log(result);
}

// ============================================
// 3. Test Generation Chain
// ============================================

class TestGenerationChain {
  private model: ChatOpenAI;
  private analyzePrompt: PromptTemplate;
  private generatePrompt: PromptTemplate;

  constructor() {
    this.model = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0 });

    this.analyzePrompt = PromptTemplate.fromTemplate(`
      Analyze this HTML and identify testable elements:
      {html}

      Return a JSON list of elements with: selector, type, purpose
    `);

    this.generatePrompt = PromptTemplate.fromTemplate(`
      Generate Playwright tests for these elements:
      {elements}

      Page URL: {url}

      Create comprehensive tests with assertions.
    `);
  }

  async generateTests(html: string, url: string): Promise<string> {
    // Step 1: Analyze HTML
    const analyzeChain = RunnableSequence.from([
      this.analyzePrompt,
      this.model,
      new StringOutputParser(),
    ]);

    const elements = await analyzeChain.invoke({ html });

    // Step 2: Generate tests
    const generateChain = RunnableSequence.from([
      this.generatePrompt,
      this.model,
      new StringOutputParser(),
    ]);

    const tests = await generateChain.invoke({ elements, url });

    return tests;
  }
}

// ============================================
// 4. Custom Tools for Testing
// ============================================

interface Tool {
  name: string;
  description: string;
  func: (input: string) => Promise<string>;
}

const playwrightTools: Tool[] = [
  {
    name: 'navigate',
    description: 'Navigate to a URL. Input: URL string',
    func: async (url: string) => {
      // In real implementation, use Playwright
      return `Navigated to ${url}`;
    },
  },
  {
    name: 'click',
    description: 'Click an element. Input: selector string',
    func: async (selector: string) => {
      return `Clicked element: ${selector}`;
    },
  },
  {
    name: 'fill',
    description: 'Fill input field. Input: JSON {selector, value}',
    func: async (input: string) => {
      const { selector, value } = JSON.parse(input);
      return `Filled ${selector} with ${value}`;
    },
  },
  {
    name: 'assert',
    description: 'Assert element state. Input: JSON {selector, state}',
    func: async (input: string) => {
      const { selector, state } = JSON.parse(input);
      return `Asserted ${selector} is ${state}`;
    },
  },
];

/**
 * EXERCISE:
 * 1. Install LangChain: npm install langchain @langchain/openai
 * 2. Create a chain that generates tests from user stories
 * 3. Build an agent that can execute Playwright commands
 * 4. Add memory to remember previous test generations
 * 5. Create a tool that validates generated tests
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: What is the difference between chains and agents?
 * A1: Chains are fixed sequences of steps. Agents dynamically
 *     decide which tools to use based on the input.
 *
 * Q2: How do you handle LLM errors in test automation?
 * A2: Use try-catch, implement retries, validate outputs,
 *     and have fallback strategies for critical tests.
 */

/**
 * LEARNING:
 * - LangChain simplifies building LLM-powered applications
 * - Chains enable multi-step test generation workflows
 * - Tools extend LLM capabilities with real actions
 * - Prompt engineering is crucial for quality outputs
 *
 * ONE LINER:
 * "LangChain: Build intelligent test automation with LLMs."
 */

export { TestGenerationChain, playwrightTools, basicLLMUsage, generateTestWithTemplate };
