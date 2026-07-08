/**
 * Lab 1313: MCP (Model Context Protocol) for Test Automation
 *
 * CONCEPT:
 * MCP is an open protocol by Anthropic that standardizes how AI applications
 * connect to external tools and data sources. For test automation, MCP enables
 * AI assistants to directly interact with your test framework.
 *
 * BULLET POINTS:
 * - MCP: Standardized protocol for AI tool integration
 * - Server: Exposes tools and resources to AI clients
 * - Client: AI application that uses MCP servers
 * - Tools: Functions the AI can call (run tests, generate code)
 * - Resources: Data the AI can access (test results, logs)
 *
 * EXAMPLES:
 * - AI assistant that runs Playwright tests
 * - Test generation tool integrated with Claude
 * - Automated test debugging assistant
 */

// Note: Install MCP SDK: npm install @modelcontextprotocol/sdk

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// ============================================
// 1. MCP Server for Playwright
// ============================================

class PlaywrightMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'playwright-test-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'run_test',
          description: 'Run a Playwright test file',
          inputSchema: {
            type: 'object',
            properties: {
              testFile: {
                type: 'string',
                description: 'Path to the test file',
              },
              headed: {
                type: 'boolean',
                description: 'Run in headed mode',
                default: false,
              },
            },
            required: ['testFile'],
          },
        },
        {
          name: 'generate_test',
          description: 'Generate a Playwright test from a description',
          inputSchema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Description of the test to generate',
              },
              pageUrl: {
                type: 'string',
                description: 'URL of the page to test',
              },
            },
            required: ['description', 'pageUrl'],
          },
        },
        {
          name: 'analyze_failure',
          description: 'Analyze a test failure and suggest fixes',
          inputSchema: {
            type: 'object',
            properties: {
              errorMessage: {
                type: 'string',
                description: 'The error message from the failed test',
              },
              testCode: {
                type: 'string',
                description: 'The test code that failed',
              },
            },
            required: ['errorMessage'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'run_test':
          return this.runTest(args as { testFile: string; headed?: boolean });
        case 'generate_test':
          return this.generateTest(args as { description: string; pageUrl: string });
        case 'analyze_failure':
          return this.analyzeFailure(args as { errorMessage: string; testCode?: string });
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private setupResourceHandlers(): void {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'playwright://test-results/latest',
          name: 'Latest Test Results',
          description: 'Results from the most recent test run',
          mimeType: 'application/json',
        },
        {
          uri: 'playwright://config',
          name: 'Playwright Configuration',
          description: 'Current Playwright configuration',
          mimeType: 'application/json',
        },
      ],
    }));

    // Read resources
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === 'playwright://test-results/latest') {
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(await this.getLatestResults()),
          }],
        };
      }

      if (uri === 'playwright://config') {
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(await this.getConfig()),
          }],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  // Tool implementations
  private async runTest(args: { testFile: string; headed?: boolean }) {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    const headedFlag = args.headed ? '--headed' : '';
    const command = `npx playwright test ${args.testFile} ${headedFlag}`;

    try {
      const { stdout, stderr } = await execAsync(command);
      return {
        content: [{
          type: 'text',
          text: `Test completed:\n${stdout}\n${stderr}`,
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: `Test failed:\n${error.stdout}\n${error.stderr}`,
        }],
        isError: true,
      };
    }
  }

  private async generateTest(args: { description: string; pageUrl: string }) {
    // In real implementation, use LLM to generate test
    const testCode = `
import { test, expect } from '@playwright/test';

test('${args.description}', async ({ page }) => {
  await page.goto('${args.pageUrl}');
  // TODO: Add test steps based on description
  // ${args.description}
});
`;
    return {
      content: [{
        type: 'text',
        text: testCode,
      }],
    };
  }

  private async analyzeFailure(args: { errorMessage: string; testCode?: string }) {
    // In real implementation, use LLM to analyze
    const analysis = `
## Failure Analysis

**Error:** ${args.errorMessage}

**Possible Causes:**
1. Element not found - selector may have changed
2. Timing issue - element not loaded yet
3. Network error - API call failed

**Suggested Fixes:**
1. Update the selector to match current DOM
2. Add explicit wait for element
3. Check network conditions and mock if needed
`;
    return {
      content: [{
        type: 'text',
        text: analysis,
      }],
    };
  }

  private async getLatestResults() {
    // Read from test-results directory
    return {
      passed: 10,
      failed: 2,
      skipped: 1,
      duration: '45s',
    };
  }

  private async getConfig() {
    return {
      testDir: './tests',
      timeout: 30000,
      retries: 2,
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Playwright MCP Server running on stdio');
  }
}

// ============================================
// 2. Start the Server
// ============================================

async function main() {
  const server = new PlaywrightMCPServer();
  await server.start();
}

// Uncomment to run: main().catch(console.error);

/**
 * EXERCISE:
 * 1. Create an MCP server for your test framework
 * 2. Add tools for test generation and execution
 * 3. Expose test results as resources
 * 4. Connect to Claude Desktop or other MCP clients
 * 5. Build a test debugging assistant
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: What is MCP and how does it help test automation?
 * A1: MCP standardizes AI-tool integration. It allows AI assistants
 *     like Claude to directly run tests, generate code, and analyze
 *     failures through a consistent protocol.
 *
 * Q2: What's the difference between tools and resources in MCP?
 * A2: Tools are functions the AI can call (actions).
 *     Resources are data the AI can read (information).
 */

/**
 * LEARNING:
 * - MCP enables AI assistants to interact with test frameworks
 * - Tools define actions (run test, generate code)
 * - Resources provide data (results, config)
 * - Standardized protocol works with multiple AI clients
 *
 * ONE LINER:
 * "MCP: Connect your test framework to AI assistants."
 */

export { PlaywrightMCPServer };
