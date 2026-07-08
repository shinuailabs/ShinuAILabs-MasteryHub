/**
 * Lab 985: LLM Context Management
 *
 * CONCEPT:
 * Effective context management is crucial for LLM performance. Learn to
 * optimize context windows, manage conversation history, and provide
 * relevant information for accurate responses.
 *
 * BULLET POINTS:
 * - Context window limits
 * - Relevant context selection
 * - Conversation history
 * - Context compression
 * - Memory management
 */

// Example 1: Context manager
interface ContextItem {
  type: 'code' | 'error' | 'requirement' | 'history' | 'metadata';
  content: string;
  priority: number;
  tokens: number;
}

class ContextManager {
  private maxTokens: number;
  private items: ContextItem[] = [];

  constructor(maxTokens: number = 4000) {
    this.maxTokens = maxTokens;
  }

  addContext(item: Omit<ContextItem, 'tokens'>): void {
    const tokens = this.estimateTokens(item.content);
    this.items.push({ ...item, tokens });
  }

  buildContext(): string {
    // Sort by priority (higher first)
    const sorted = [...this.items].sort((a, b) => b.priority - a.priority);

    let context = '';
    let usedTokens = 0;

    for (const item of sorted) {
      if (usedTokens + item.tokens <= this.maxTokens) {
        context += this.formatItem(item);
        usedTokens += item.tokens;
      }
    }

    return context;
  }

  private estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  private formatItem(item: ContextItem): string {
    const labels: Record<ContextItem['type'], string> = {
      code: 'CODE',
      error: 'ERROR',
      requirement: 'REQUIREMENT',
      history: 'HISTORY',
      metadata: 'METADATA',
    };

    return `[${labels[item.type]}]\n${item.content}\n\n`;
  }

  getStats(): { totalItems: number; totalTokens: number; usedTokens: number } {
    const totalTokens = this.items.reduce((sum, i) => sum + i.tokens, 0);
    return {
      totalItems: this.items.length,
      totalTokens,
      usedTokens: Math.min(totalTokens, this.maxTokens),
    };
  }

  clear(): void {
    this.items = [];
  }
}

// Example 2: Conversation memory
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

class ConversationMemory {
  private messages: Message[] = [];
  private maxMessages: number;

  constructor(maxMessages: number = 10) {
    this.maxMessages = maxMessages;
  }

  addMessage(role: Message['role'], content: string): void {
    this.messages.push({ role, content, timestamp: new Date() });

    // Keep only recent messages
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }

  getHistory(): Message[] {
    return [...this.messages];
  }

  getFormattedHistory(): string {
    return this.messages.map((m) => `${m.role}: ${m.content}`).join('\n\n');
  }

  summarize(): string {
    // Create a summary of the conversation
    const topics = new Set<string>();
    this.messages.forEach((m) => {
      if (m.content.toLowerCase().includes('test')) topics.add('testing');
      if (m.content.toLowerCase().includes('error')) topics.add('debugging');
      if (m.content.toLowerCase().includes('generate')) topics.add('code generation');
    });

    return `Conversation about: ${Array.from(topics).join(', ')}`;
  }

  clear(): void {
    this.messages = [];
  }
}

// Example 3: Context compression
function compressCode(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
}

function extractRelevantCode(code: string, errorLine?: number): string {
  const lines = code.split('\n');

  if (errorLine && errorLine > 0) {
    // Get context around error line
    const start = Math.max(0, errorLine - 5);
    const end = Math.min(lines.length, errorLine + 5);
    return lines.slice(start, end).join('\n');
  }

  return code;
}

// Example 4: Using context management
function buildTestAnalysisContext(
  testCode: string,
  error: string,
  previousAttempts: string[]
): string {
  const ctx = new ContextManager(3000);

  // High priority: the error
  ctx.addContext({ type: 'error', content: error, priority: 10 });

  // High priority: relevant test code
  ctx.addContext({
    type: 'code',
    content: compressCode(testCode),
    priority: 9,
  });

  // Medium priority: previous attempts
  previousAttempts.forEach((attempt, i) => {
    ctx.addContext({
      type: 'history',
      content: `Attempt ${i + 1}: ${attempt}`,
      priority: 5 - i,
    });
  });

  return ctx.buildContext();
}

// Example 5: Sliding window for long conversations
class SlidingWindowMemory {
  private buffer: Message[] = [];
  private windowSize: number;

  constructor(windowSize: number = 5) {
    this.windowSize = windowSize;
  }

  add(message: Message): void {
    this.buffer.push(message);
    if (this.buffer.length > this.windowSize * 2) {
      // Keep system message + recent messages
      const systemMsg = this.buffer.find((m) => m.role === 'system');
      this.buffer = systemMsg
        ? [systemMsg, ...this.buffer.slice(-this.windowSize)]
        : this.buffer.slice(-this.windowSize);
    }
  }

  getWindow(): Message[] {
    return this.buffer.slice(-this.windowSize);
  }
}

/**
 * EXERCISE:
 * 1. Implement context manager
 * 2. Manage conversation memory
 * 3. Compress large contexts
 * 4. Optimize token usage
 *
 * LEARNING:
 * - Context limits require prioritization
 * - Compression preserves meaning
 * - History enables continuity
 * - Smart selection improves results
 *
 * ONE LINER:
 * "Manage context wisely - what you include shapes what AI understands."
 */

export { ContextManager, ConversationMemory, compressCode, SlidingWindowMemory };

