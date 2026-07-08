/**
 * Lab 994: Building Your AI Testing Toolkit
 *
 * CONCEPT:
 * Assemble a comprehensive toolkit of AI tools, templates, and resources
 * for effective AI-assisted test automation.
 *
 * BULLET POINTS:
 * - Essential tools
 * - Templates and prompts
 * - Integration patterns
 * - Resource library
 * - Continuous updates
 */

// Example 1: Recommended tools
interface ToolRecommendation {
  category: string;
  tools: {
    name: string;
    purpose: string;
    cost: 'free' | 'freemium' | 'paid';
    link: string;
  }[];
}

const recommendedTools: ToolRecommendation[] = [
  {
    category: 'Code Generation',
    tools: [
      { name: 'GitHub Copilot', purpose: 'Inline code suggestions', cost: 'paid', link: 'https://github.com/features/copilot' },
      { name: 'Codeium', purpose: 'Free code completion', cost: 'free', link: 'https://codeium.com' },
      { name: 'TabNine', purpose: 'AI code completion', cost: 'freemium', link: 'https://tabnine.com' },
    ],
  },
  {
    category: 'Test Analysis',
    tools: [
      { name: 'Applitools', purpose: 'Visual AI testing', cost: 'freemium', link: 'https://applitools.com' },
      { name: 'Percy', purpose: 'Visual regression', cost: 'freemium', link: 'https://percy.io' },
      { name: 'Testim', purpose: 'AI test maintenance', cost: 'paid', link: 'https://testim.io' },
    ],
  },
  {
    category: 'LLM APIs',
    tools: [
      { name: 'OpenAI API', purpose: 'GPT models', cost: 'paid', link: 'https://openai.com/api' },
      { name: 'Anthropic API', purpose: 'Claude models', cost: 'paid', link: 'https://anthropic.com' },
      { name: 'Ollama', purpose: 'Local LLMs', cost: 'free', link: 'https://ollama.ai' },
    ],
  },
];

// Example 2: Prompt templates library
const promptTemplates = {
  testGeneration: `Generate a Playwright test for: {requirement}
Use data-testid selectors. Include assertions.`,

  failureAnalysis: `Analyze this test failure:
Error: {error}
Suggest root cause and fix.`,

  codeReview: `Review this test code for:
1. Locator quality
2. Assertion completeness
3. Best practices
{code}`,

  testData: `Generate test data for:
Schema: {schema}
Return JSON array with 5 items including edge cases.`,
};

// Example 3: Integration patterns
interface IntegrationPattern {
  pattern: string;
  description: string;
  implementation: string;
}

const integrationPatterns: IntegrationPattern[] = [
  {
    pattern: 'Pre-commit AI Review',
    description: 'AI reviews tests before commit',
    implementation: 'Git hook calls AI API for code review',
  },
  {
    pattern: 'CI Failure Analysis',
    description: 'Automatic failure analysis in CI',
    implementation: 'CI pipeline sends failures to AI for analysis',
  },
  {
    pattern: 'IDE Integration',
    description: 'AI assistance in IDE',
    implementation: 'VSCode extension for test generation',
  },
  {
    pattern: 'Chat-based Testing',
    description: 'Conversational test creation',
    implementation: 'Slack/Teams bot for test requests',
  },
];

// Example 4: Resource library
const resourceLibrary = {
  documentation: [
    { name: 'Playwright Docs', url: 'https://playwright.dev/docs' },
    { name: 'OpenAI API Docs', url: 'https://platform.openai.com/docs' },
    { name: 'Anthropic Docs', url: 'https://docs.anthropic.com' },
  ],
  learning: [
    { name: 'Prompt Engineering Guide', type: 'guide' },
    { name: 'AI Testing Best Practices', type: 'course' },
    { name: 'LLM Integration Patterns', type: 'article' },
  ],
  communities: [
    { name: 'AI Testing Discord', platform: 'Discord' },
    { name: 'Testing Twitter/X', platform: 'Twitter' },
    { name: 'Reddit r/QualityAssurance', platform: 'Reddit' },
  ],
};

// Example 5: Toolkit setup script
const toolkitSetupScript = `#!/bin/bash
# AI Testing Toolkit Setup

# Install Playwright
npm init playwright@latest

# Install AI helpers
npm install openai @anthropic-ai/sdk

# Set up Ollama (local LLM)
curl -fsSL https://ollama.com/install.sh | sh
ollama pull codellama:7b

# Create config
cat > ai-testing.config.ts << EOF
export const aiConfig = {
  openai: { apiKey: process.env.OPENAI_API_KEY },
  local: { url: 'http://localhost:11434' }
};
EOF

echo "AI Testing Toolkit ready!"
`;

// Example 6: Toolkit maintenance
interface ToolkitMaintenance {
  task: string;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  action: string;
}

const maintenanceTasks: ToolkitMaintenance[] = [
  { task: 'Update dependencies', frequency: 'weekly', action: 'npm update' },
  { task: 'Review new AI tools', frequency: 'monthly', action: 'Check Product Hunt, GitHub' },
  { task: 'Update prompts', frequency: 'monthly', action: 'Refine based on results' },
  { task: 'Audit costs', frequency: 'monthly', action: 'Review API spending' },
  { task: 'Evaluate toolkit', frequency: 'quarterly', action: 'Full assessment' },
];

/**
 * EXERCISE:
 * 1. Assemble your toolkit
 * 2. Create prompt templates
 * 3. Set up integrations
 * 4. Build resource library
 *
 * LEARNING:
 * - Right tools increase productivity
 * - Templates save time
 * - Integrations automate workflows
 * - Maintenance keeps toolkit effective
 *
 * ONE LINER:
 * "A well-stocked AI toolkit makes testing efficient - invest time in setup."
 */

export { recommendedTools, promptTemplates, integrationPatterns, resourceLibrary };

