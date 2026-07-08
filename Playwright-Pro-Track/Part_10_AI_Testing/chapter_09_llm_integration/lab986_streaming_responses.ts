/**
 * Lab 986: LLM Streaming Responses
 *
 * CONCEPT:
 * Stream LLM responses for better user experience when generating tests
 * or analyzing failures. See results as they're generated rather than
 * waiting for the complete response.
 *
 * BULLET POINTS:
 * - Server-sent events (SSE)
 * - Chunked response handling
 * - Real-time UI updates
 * - Error handling in streams
 * - Progress indication
 */

// Example 1: Streaming client
interface StreamingOptions {
  onChunk: (chunk: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

class StreamingLLMClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async streamGeneration(prompt: string, options: StreamingOptions): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

          for (const line of lines) {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                options.onChunk(content);
              }
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }

      options.onComplete(fullResponse);
    } catch (error) {
      options.onError(error as Error);
    }
  }
}

// Example 2: Progress tracker
class GenerationProgress {
  private startTime: number = 0;
  private chunks: string[] = [];
  private onUpdate: (progress: ProgressUpdate) => void;

  constructor(onUpdate: (progress: ProgressUpdate) => void) {
    this.onUpdate = onUpdate;
  }

  start(): void {
    this.startTime = Date.now();
    this.chunks = [];
    this.onUpdate({ status: 'started', elapsed: 0, chunks: 0 });
  }

  addChunk(chunk: string): void {
    this.chunks.push(chunk);
    this.onUpdate({
      status: 'generating',
      elapsed: Date.now() - this.startTime,
      chunks: this.chunks.length,
      latestChunk: chunk,
    });
  }

  complete(): void {
    this.onUpdate({
      status: 'complete',
      elapsed: Date.now() - this.startTime,
      chunks: this.chunks.length,
      totalLength: this.chunks.join('').length,
    });
  }

  error(err: Error): void {
    this.onUpdate({
      status: 'error',
      elapsed: Date.now() - this.startTime,
      chunks: this.chunks.length,
      error: err.message,
    });
  }
}

interface ProgressUpdate {
  status: 'started' | 'generating' | 'complete' | 'error';
  elapsed: number;
  chunks: number;
  latestChunk?: string;
  totalLength?: number;
  error?: string;
}

// Example 3: Streaming test generator
async function streamTestGeneration(
  client: StreamingLLMClient,
  requirement: string,
  outputElement: { innerHTML: string }
): Promise<string> {
  return new Promise((resolve, reject) => {
    let generatedCode = '';

    client.streamGeneration(`Generate a Playwright test for: ${requirement}`, {
      onChunk: (chunk) => {
        generatedCode += chunk;
        outputElement.innerHTML = `<pre>${generatedCode}</pre>`;
      },
      onComplete: (fullResponse) => {
        outputElement.innerHTML = `<pre>${fullResponse}</pre><p>✅ Complete</p>`;
        resolve(fullResponse);
      },
      onError: (error) => {
        outputElement.innerHTML = `<p>❌ Error: ${error.message}</p>`;
        reject(error);
      },
    });
  });
}

// Example 4: CLI streaming output
async function cliStreamingDemo(): Promise<void> {
  const client = new StreamingLLMClient('https://api.openai.com', process.env.OPENAI_API_KEY || '');

  const progress = new GenerationProgress((update) => {
    if (update.status === 'generating') {
      process.stdout.write(update.latestChunk || '');
    } else {
      console.log(`\n[${update.status}] ${update.elapsed}ms, ${update.chunks} chunks`);
    }
  });

  progress.start();

  await client.streamGeneration('Generate a simple login test', {
    onChunk: (chunk) => progress.addChunk(chunk),
    onComplete: () => progress.complete(),
    onError: (err) => progress.error(err),
  });
}

// Example 5: Abort controller for cancellation
async function streamWithCancellation(
  client: StreamingLLMClient,
  prompt: string,
  timeoutMs: number
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let result = '';
    await client.streamGeneration(prompt, {
      onChunk: (chunk) => (result += chunk),
      onComplete: () => {},
      onError: (err) => {
        throw err;
      },
    });
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * EXERCISE:
 * 1. Implement streaming client
 * 2. Add progress tracking
 * 3. Handle errors gracefully
 * 4. Add cancellation support
 *
 * LEARNING:
 * - Streaming improves UX
 * - Progress keeps users informed
 * - Error handling is crucial
 * - Cancellation prevents waste
 *
 * ONE LINER:
 * "Stream AI responses for instant feedback - don't make users wait for magic."
 */

export { StreamingLLMClient, GenerationProgress, streamTestGeneration };

