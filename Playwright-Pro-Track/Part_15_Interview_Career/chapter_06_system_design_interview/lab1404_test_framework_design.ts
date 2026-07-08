/**
 * Lab 1404: System Design Interview - Test Framework Architecture
 *
 * CONCEPT:
 * System design interviews for SDET roles often ask you to design a test
 * automation framework. This lab covers the key components, patterns, and
 * considerations for designing scalable test infrastructure.
 *
 * BULLET POINTS:
 * - Framework layers: Core, Page Objects, Tests, Utilities
 * - Design patterns: Factory, Builder, Strategy, Observer
 * - Scalability: Parallel execution, distributed testing
 * - Maintainability: DRY, SOLID principles
 * - Reporting: Real-time, historical, analytics
 *
 * INTERVIEW FREQUENCY: ⭐⭐⭐⭐⭐ (Common in Senior SDET interviews)
 */

// ============================================
// SYSTEM DESIGN: Test Framework Architecture
// ============================================

/**
 * INTERVIEW QUESTION:
 * "Design a scalable test automation framework for a large e-commerce platform."
 *
 * APPROACH (Use this structure in interviews):
 * 1. Clarify requirements
 * 2. Define high-level architecture
 * 3. Deep dive into components
 * 4. Discuss trade-offs
 * 5. Address scalability & maintenance
 */

// ============================================
// 1. FRAMEWORK LAYERS
// ============================================

/**
 * Layer 1: Core Framework
 * - Browser management
 * - Configuration
 * - Logging
 * - Reporting
 */

interface FrameworkConfig {
  baseUrl: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  timeout: number;
  retries: number;
  parallel: number;
  reportDir: string;
}

class TestFramework {
  private config: FrameworkConfig;
  private logger: Logger;
  private reporter: Reporter;

  constructor(config: FrameworkConfig) {
    this.config = config;
    this.logger = new Logger(config);
    this.reporter = new Reporter(config);
  }

  async initialize(): Promise<void> {
    await this.logger.init();
    await this.reporter.init();
  }

  getConfig(): FrameworkConfig {
    return this.config;
  }
}

/**
 * Layer 2: Page Object Layer
 * - Encapsulates page elements
 * - Provides reusable actions
 * - Abstracts implementation details
 */

abstract class BasePage {
  constructor(protected page: any) {}

  abstract get url(): string;

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}

class LoginPage extends BasePage {
  get url() { return '/login'; }

  // Locators (private)
  private get emailInput() { return this.page.getByLabel('Email'); }
  private get passwordInput() { return this.page.getByLabel('Password'); }
  private get submitButton() { return this.page.getByRole('button', { name: 'Sign In' }); }

  // Actions (public)
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

/**
 * Layer 3: Test Data Management
 * - Factories for test data
 * - Builders for complex objects
 * - Data providers for data-driven tests
 */

interface User {
  email: string;
  password: string;
  name: string;
}

class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      email: `user_${Date.now()}@test.com`,
      password: 'Test123!',
      name: 'Test User',
      ...overrides,
    };
  }

  static createAdmin(): User {
    return this.create({ email: 'admin@test.com', name: 'Admin User' });
  }
}

// Builder pattern for complex objects
class OrderBuilder {
  private order: any = { items: [], shipping: {}, payment: {} };

  addItem(item: { id: string; quantity: number }): this {
    this.order.items.push(item);
    return this;
  }

  withShipping(address: any): this {
    this.order.shipping = address;
    return this;
  }

  withPayment(method: string): this {
    this.order.payment = { method };
    return this;
  }

  build(): any {
    return { ...this.order };
  }
}

/**
 * Layer 4: Utilities
 * - API helpers
 * - Database utilities
 * - File operations
 * - Custom assertions
 */

class ApiHelper {
  constructor(private baseUrl: string, private token?: string) {}

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  }
}

// ============================================
// 2. DESIGN PATTERNS
// ============================================

/**
 * Strategy Pattern: Different test execution strategies
 */

interface ExecutionStrategy {
  execute(tests: string[]): Promise<void>;
}

class SequentialStrategy implements ExecutionStrategy {
  async execute(tests: string[]): Promise<void> {
    for (const test of tests) {
      await this.runTest(test);
    }
  }
  private async runTest(test: string): Promise<void> { /* ... */ }
}

class ParallelStrategy implements ExecutionStrategy {
  constructor(private workers: number) {}

  async execute(tests: string[]): Promise<void> {
    const chunks = this.chunkArray(tests, this.workers);
    await Promise.all(chunks.map(chunk => this.runChunk(chunk)));
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  private async runChunk(tests: string[]): Promise<void> { /* ... */ }
}

/**
 * Observer Pattern: Test event notifications
 */

interface TestObserver {
  onTestStart(testName: string): void;
  onTestEnd(testName: string, status: 'pass' | 'fail'): void;
}

class SlackNotifier implements TestObserver {
  onTestStart(testName: string): void {
    // Send Slack notification
  }
  onTestEnd(testName: string, status: 'pass' | 'fail'): void {
    if (status === 'fail') {
      // Send failure alert
    }
  }
}

// ============================================
// 3. SCALABILITY CONSIDERATIONS
// ============================================

/**
 * Q: How would you scale this framework for 10,000 tests?
 *
 * A:
 * 1. Parallel execution across multiple machines
 * 2. Test sharding by feature/priority
 * 3. Selective test execution (changed files only)
 * 4. Caching (browser state, test data)
 * 5. Cloud-based execution (AWS, Azure, GCP)
 */

// ============================================
// 4. LOGGING & REPORTING
// ============================================

class Logger {
  constructor(private config: FrameworkConfig) {}
  async init(): Promise<void> {}
  info(message: string): void { console.log(`[INFO] ${message}`); }
  error(message: string): void { console.error(`[ERROR] ${message}`); }
}

class Reporter {
  constructor(private config: FrameworkConfig) {}
  async init(): Promise<void> {}
  addResult(test: string, status: string): void {}
  generateReport(): void {}
}

/**
 * EXERCISE:
 * 1. Design a framework for mobile app testing
 * 2. Add support for visual regression testing
 * 3. Implement a custom retry mechanism
 * 4. Design a test data management system
 */

/**
 * INTERVIEW TIPS:
 * - Start with requirements clarification
 * - Draw diagrams (boxes and arrows)
 * - Discuss trade-offs explicitly
 * - Mention real-world experience
 * - Address maintenance and scalability
 *
 * ONE LINER:
 * "Good framework design: Layers, patterns, and scalability."
 */

export { TestFramework, BasePage, LoginPage, UserFactory, OrderBuilder, ApiHelper };
