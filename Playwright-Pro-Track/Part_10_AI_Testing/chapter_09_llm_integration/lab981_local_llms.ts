/**
 * Lab 981: Local LLM Integration (Ollama/LLaMA)
 *
 * CONCEPT:
 * Run LLMs locally for test automation without sending data to external
 * services. Ideal for privacy-sensitive environments and cost control.
 *
 * BULLET POINTS:
 * - Local LLM setup with Ollama
 * - Privacy and security benefits
 * - Cost-free inference
 * - Offline capabilities
 * - Model selection
 */

// Example 1: Ollama client
interface OllamaConfig {
  baseUrl: string;
  model: string;
}

class OllamaTestingClient {
  private config: OllamaConfig;

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:11434',
      model: config.model || 'codellama:13b',
    };
  }

  async generateTest(prompt: string): Promise<string> {
    return this.callAPI(`Generate a Playwright test:\n${prompt}`);
  }

  async analyzeCode(code: string): Promise<string> {
    return this.callAPI(`Analyze this test code:\n${code}`);
  }

  async suggestFix(error: string): Promise<string> {
    return this.callAPI(`Suggest a fix for this error:\n${error}`);
  }

  private async callAPI(prompt: string): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.response || '';
  }

  async listModels(): Promise<string[]> {
    const response = await fetch(`${this.config.baseUrl}/api/tags`);
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  }
}

// Example 2: Model recommendations for testing
const recommendedModels = {
  codeGeneration: {
    model: 'codellama:13b',
    reason: 'Optimized for code generation and understanding',
  },
  analysis: {
    model: 'llama2:13b',
    reason: 'Good balance of reasoning and speed',
  },
  documentation: {
    model: 'mistral:7b',
    reason: 'Fast and good at text generation',
  },
  lightweight: {
    model: 'phi:latest',
    reason: 'Small model, runs on limited hardware',
  },
};

// Example 3: Setup script
const ollamaSetupCommands = `
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull recommended models
ollama pull codellama:13b
ollama pull llama2:13b
ollama pull mistral:7b

# Start Ollama server
ollama serve

# Verify installation
curl http://localhost:11434/api/tags
`;

// Example 4: Privacy-focused testing
class PrivateTestingClient {
  private client: OllamaTestingClient;

  constructor() {
    this.client = new OllamaTestingClient();
  }

  async analyzeWithoutLeakage(code: string): Promise<string> {
    // Sanitize sensitive data before analysis
    const sanitized = this.sanitizeCode(code);
    return this.client.analyzeCode(sanitized);
  }

  private sanitizeCode(code: string): string {
    // Remove sensitive patterns
    return code
      .replace(/api[_-]?key['":\s]*['"][^'"]+['"]/gi, 'API_KEY="[REDACTED]"')
      .replace(/password['":\s]*['"][^'"]+['"]/gi, 'password="[REDACTED]"')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 'email@example.com');
  }
}

// Example 5: Performance comparison
interface ModelBenchmark {
  model: string;
  responseTime: number;
  quality: number;
  memoryUsage: number;
}

async function benchmarkModels(
  client: OllamaTestingClient,
  prompt: string
): Promise<ModelBenchmark[]> {
  const models = await client.listModels();
  const benchmarks: ModelBenchmark[] = [];

  for (const model of models.slice(0, 3)) {
    const localClient = new OllamaTestingClient({ model });
    const start = Date.now();
    await localClient.generateTest(prompt);
    const responseTime = Date.now() - start;

    benchmarks.push({
      model,
      responseTime,
      quality: 0.8, // Simplified
      memoryUsage: 4096, // Simplified
    });
  }

  return benchmarks;
}

/**
 * EXERCISE:
 * 1. Install Ollama locally
 * 2. Pull recommended models
 * 3. Generate tests locally
 * 4. Compare model performance
 *
 * CODING QUESTION:
 * Create a fallback system that tries local LLM first, then cloud.
 *
 * SOLUTION:
 */
async function callWithFallback(
  localClient: OllamaTestingClient,
  cloudClient: { generateTest: (p: string) => Promise<string> },
  prompt: string
): Promise<string> {
  try {
    return await localClient.generateTest(prompt);
  } catch (error) {
    console.log('Local LLM unavailable, falling back to cloud...');
    return cloudClient.generateTest(prompt);
  }
}

/**
 * LEARNING:
 * - Local LLMs protect privacy
 * - No API costs for inference
 * - Works offline
 * - Choose model based on hardware
 *
 * ONE LINER:
 * "Local LLMs keep your code private - AI power without data leaving your machine."
 */

export { OllamaTestingClient, PrivateTestingClient, recommendedModels, callWithFallback };

