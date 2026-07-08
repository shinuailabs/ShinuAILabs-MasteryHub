/**
 * Lab 1268: AI Agents Fundamentals for Test Automation
 *
 * CONCEPT:
 * AI Agents are autonomous systems that can perceive, reason, and act to achieve goals.
 * In test automation, agents can analyze requirements, generate tests, execute them,
 * and even fix failing tests - all with minimal human intervention.
 *
 * BULLET POINTS:
 * - Agents have: Perception (input), Reasoning (LLM), Action (tools)
 * - ReAct pattern: Reason → Act → Observe → Repeat
 * - Tools extend agent capabilities (browser, file system, APIs)
 * - Memory enables learning from past interactions
 * - Agents can be specialized (planning, execution, maintenance)
 *
 * EXAMPLES:
 * - Test Generation Agent: Analyzes UI and generates Playwright tests
 * - Self-Healing Agent: Detects and fixes broken locators
 * - Test Planning Agent: Creates test strategies from requirements
 */

import OpenAI from 'openai';

// Agent Configuration
interface AgentConfig {
  name: string;
  role: string;
  tools: Tool[];
  model: string;
  temperature: number;
}

// Tool Definition
interface Tool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<string>;
}

// Agent Memory
interface Memory {
  shortTerm: string[];  // Current conversation
  longTerm: Map<string, string>;  // Persistent knowledge
}

// Basic AI Agent Class
class TestAutomationAgent {
  private openai: OpenAI;
  private memory: Memory;
  private tools: Map<string, Tool>;

  constructor(private config: AgentConfig) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.memory = { shortTerm: [], longTerm: new Map() };
    this.tools = new Map(config.tools.map(t => [t.name, t]));
  }

  // Main agent loop (ReAct pattern)
  async run(task: string): Promise<string> {
    this.memory.shortTerm.push(`Task: ${task}`);

    let iterations = 0;
    const maxIterations = 10;

    while (iterations < maxIterations) {
      // 1. REASON: Decide what to do
      const thought = await this.think();
      console.log(`🤔 Thought: ${thought.reasoning}`);

      if (thought.action === 'FINISH') {
        return thought.answer || 'Task completed';
      }

      // 2. ACT: Execute the chosen tool
      const result = await this.act(thought.action, thought.actionInput);
      console.log(`🔧 Action: ${thought.action} → ${result.substring(0, 100)}...`);

      // 3. OBSERVE: Store the result
      this.memory.shortTerm.push(`Observation: ${result}`);

      iterations++;
    }

    return 'Max iterations reached';
  }

  // Reasoning step using LLM
  private async think(): Promise<{
    reasoning: string;
    action: string;
    actionInput: Record<string, unknown>;
    answer?: string;
  }> {
    const toolDescriptions = Array.from(this.tools.values())
      .map(t => `- ${t.name}: ${t.description}`)
      .join('\n');

    const prompt = `You are ${this.config.name}, a ${this.config.role}.

Available tools:
${toolDescriptions}
- FINISH: Use when task is complete

Conversation history:
${this.memory.shortTerm.join('\n')}

Respond in JSON format:
{
  "reasoning": "your thought process",
  "action": "tool name or FINISH",
  "actionInput": { "param": "value" },
  "answer": "final answer if FINISH"
}`;

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: this.config.temperature,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  // Action step: Execute tool
  private async act(toolName: string, input: Record<string, unknown>): Promise<string> {
    const tool = this.tools.get(toolName);
    if (!tool) return `Error: Tool ${toolName} not found`;

    try {
      return await tool.execute(input);
    } catch (error) {
      return `Error executing ${toolName}: ${error}`;
    }
  }
}

// Example Tools for Test Automation
const browserTool: Tool = {
  name: 'browser',
  description: 'Navigate to URL and get page content',
  parameters: { url: 'string' },
  execute: async (params) => {
    // In real implementation, use Playwright
    return `Page content from ${params.url}: <html>...</html>`;
  },
};

const generateTestTool: Tool = {
  name: 'generateTest',
  description: 'Generate Playwright test code',
  parameters: { description: 'string', selectors: 'object' },
  execute: async (params) => {
    return `test('${params.description}', async ({ page }) => { ... });`;
  },
};

/**
 * EXERCISE:
 * 1. Create a TestGenerationAgent with browser and generateTest tools
 * 2. Add a "runTest" tool that executes generated tests
 * 3. Implement memory persistence using a JSON file
 * 4. Add error recovery when tools fail
 * 5. Create a multi-step workflow: analyze → generate → validate
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: What is the ReAct pattern in AI agents?
 * A1: ReAct = Reasoning + Acting. The agent thinks about what to do,
 *     takes an action, observes the result, and repeats until done.
 *
 * Q2: How do tools extend agent capabilities?
 * A2: Tools give agents abilities beyond text generation - they can
 *     browse the web, execute code, interact with APIs, etc.
 */

/**
 * LEARNING:
 * - AI Agents combine LLMs with tools for autonomous task completion
 * - The ReAct pattern enables step-by-step reasoning and action
 * - Memory allows agents to learn and maintain context
 * - Specialized agents can handle different testing phases
 *
 * ONE LINER:
 * "AI Agents: Autonomous systems that think, act, and learn to automate testing."
 */

export { TestAutomationAgent, AgentConfig, Tool, browserTool, generateTestTool };
