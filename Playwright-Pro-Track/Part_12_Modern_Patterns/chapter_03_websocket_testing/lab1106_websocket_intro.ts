/**
 * Lab 1106: WebSocket Testing with Playwright
 *
 * CONCEPT:
 * WebSockets enable real-time, bidirectional communication between client and
 * server. Testing WebSockets requires handling connections, messages, events,
 * and ensuring reliability under various conditions.
 *
 * BULLET POINTS:
 * - WebSocket vs HTTP: Persistent connection, bidirectional
 * - Events: open, message, close, error
 * - Playwright can intercept WebSocket traffic
 * - Test scenarios: connection, messaging, reconnection, errors
 * - Common use cases: chat, live updates, gaming, trading
 *
 * EXAMPLES:
 * - Chat applications (Slack, Discord)
 * - Live dashboards (stock prices, analytics)
 * - Collaborative tools (Google Docs, Figma)
 */

import { test, expect, Page, WebSocket } from '@playwright/test';

// ============================================
// WebSocket Test Helper
// ============================================

interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: number;
}

class WebSocketTester {
  private messages: WebSocketMessage[] = [];
  private ws: WebSocket | null = null;

  constructor(private page: Page) {}

  // Intercept WebSocket connections
  async interceptWebSocket(urlPattern: string | RegExp): Promise<void> {
    this.page.on('websocket', (ws) => {
      if (typeof urlPattern === 'string' ? ws.url().includes(urlPattern) : urlPattern.test(ws.url())) {
        this.ws = ws;
        console.log(`🔌 WebSocket connected: ${ws.url()}`);

        ws.on('framereceived', (frame) => {
          if (frame.payload) {
            try {
              const data = JSON.parse(frame.payload.toString());
              this.messages.push({
                type: 'received',
                data,
                timestamp: Date.now(),
              });
              console.log(`📥 Received:`, data);
            } catch {
              this.messages.push({
                type: 'received',
                data: frame.payload.toString(),
                timestamp: Date.now(),
              });
            }
          }
        });

        ws.on('framesent', (frame) => {
          if (frame.payload) {
            try {
              const data = JSON.parse(frame.payload.toString());
              this.messages.push({
                type: 'sent',
                data,
                timestamp: Date.now(),
              });
              console.log(`📤 Sent:`, data);
            } catch {
              this.messages.push({
                type: 'sent',
                data: frame.payload.toString(),
                timestamp: Date.now(),
              });
            }
          }
        });

        ws.on('close', () => {
          console.log(`🔌 WebSocket closed`);
        });
      }
    });
  }

  // Wait for specific message
  async waitForMessage(
    predicate: (msg: WebSocketMessage) => boolean,
    timeout: number = 10000
  ): Promise<WebSocketMessage> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const found = this.messages.find(predicate);
      if (found) return found;
      await this.page.waitForTimeout(100);
    }

    throw new Error('Timeout waiting for WebSocket message');
  }

  // Get all messages
  getMessages(): WebSocketMessage[] {
    return [...this.messages];
  }

  // Get messages by type
  getReceivedMessages(): WebSocketMessage[] {
    return this.messages.filter((m) => m.type === 'received');
  }

  getSentMessages(): WebSocketMessage[] {
    return this.messages.filter((m) => m.type === 'sent');
  }

  // Clear messages
  clearMessages(): void {
    this.messages = [];
  }

  // Check if connected
  isConnected(): boolean {
    return this.ws !== null && !this.ws.isClosed();
  }
}

// ============================================
// Playwright WebSocket Tests
// ============================================

test.describe('WebSocket Testing', () => {
  test('should connect to WebSocket and receive messages', async ({ page }) => {
    const wsTester = new WebSocketTester(page);

    // Start intercepting before navigation
    await wsTester.interceptWebSocket('wss://');

    // Navigate to page with WebSocket
    await page.goto('https://example.com/chat');

    // Wait for connection
    await page.waitForTimeout(1000);
    expect(wsTester.isConnected()).toBe(true);

    // Trigger action that sends WebSocket message
    await page.getByRole('textbox').fill('Hello World');
    await page.getByRole('button', { name: 'Send' }).click();

    // Verify message was sent
    const sentMsg = await wsTester.waitForMessage(
      (m) => m.type === 'sent' && JSON.stringify(m.data).includes('Hello World')
    );
    expect(sentMsg).toBeDefined();

    // Verify response received
    const receivedMsg = await wsTester.waitForMessage(
      (m) => m.type === 'received'
    );
    expect(receivedMsg).toBeDefined();
  });

  test('should handle WebSocket reconnection', async ({ page }) => {
    const wsTester = new WebSocketTester(page);
    await wsTester.interceptWebSocket('wss://');

    await page.goto('https://example.com/chat');

    // Simulate network disconnect
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);

    // Reconnect
    await page.context().setOffline(false);
    await page.waitForTimeout(2000);

    // Verify reconnection (app-specific)
    expect(wsTester.isConnected()).toBe(true);
  });
});

// ============================================
// Mock WebSocket Server (for unit tests)
// ============================================

class MockWebSocketServer {
  private handlers: Map<string, (data: unknown) => unknown> = new Map();

  on(event: string, handler: (data: unknown) => unknown): void {
    this.handlers.set(event, handler);
  }

  emit(event: string, data: unknown): unknown {
    const handler = this.handlers.get(event);
    return handler ? handler(data) : null;
  }

  // Simulate server response
  simulateMessage(data: unknown): void {
    const handler = this.handlers.get('message');
    if (handler) handler(data);
  }
}

/**
 * EXERCISE:
 * 1. Test a chat application with multiple users
 * 2. Verify message ordering in real-time updates
 * 3. Test WebSocket authentication
 * 4. Measure message latency
 * 5. Test graceful degradation when WebSocket fails
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: How do you test WebSocket connections in Playwright?
 * A1: Use page.on('websocket') to intercept connections, then
 *     listen to 'framereceived' and 'framesent' events.
 *
 * Q2: How do you handle WebSocket reconnection testing?
 * A2: Use page.context().setOffline() to simulate network issues,
 *     then verify the app reconnects properly.
 */

/**
 * LEARNING:
 * - Playwright can intercept and monitor WebSocket traffic
 * - Test both sent and received messages
 * - Handle connection lifecycle (open, close, error)
 * - Simulate network conditions for resilience testing
 *
 * ONE LINER:
 * "WebSocket testing: Real-time communication requires real-time verification."
 */

export { WebSocketTester, MockWebSocketServer };
