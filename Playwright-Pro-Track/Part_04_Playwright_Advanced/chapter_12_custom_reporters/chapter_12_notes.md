# Part 12: Custom Reporters

## 📚 Overview
Playwright reporters output test results in various formats. You can use built-in reporters or create custom ones.

---

## 🎯 Key Concepts

### 1. Built-in Reporters

```typescript
// playwright.config.ts
export default defineConfig({
  // Single reporter
  reporter: 'html',
  
  // Multiple reporters
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
});
```

### 2. Reporter Options

```typescript
// HTML Reporter
reporter: [['html', {
  open: 'never',  // 'always', 'never', 'on-failure'
  outputFolder: 'playwright-report',
}]],

// JSON Reporter
reporter: [['json', {
  outputFile: 'test-results.json',
}]],

// JUnit Reporter
reporter: [['junit', {
  outputFile: 'junit-results.xml',
  embedAnnotationsAsProperties: true,
}]],

// Line Reporter (minimal)
reporter: 'line',

// Dot Reporter (CI friendly)
reporter: 'dot',
```

### 3. Custom Reporter Class

```typescript
// my-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onBegin(config, suite) {
    console.log(`Starting ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase) {
    console.log(`Starting: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished: ${test.title} - ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`Finished with status: ${result.status}`);
  }
}

export default MyReporter;
```

### 4. Using Custom Reporter

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['./my-reporter.ts'],
    ['html'],
  ],
});

// Or with options
reporter: [
  ['./my-reporter.ts', { verbose: true }],
],
```

### 5. Reporter Interface

```typescript
interface Reporter {
  onBegin?(config: FullConfig, suite: Suite): void;
  onTestBegin?(test: TestCase, result: TestResult): void;
  onTestEnd?(test: TestCase, result: TestResult): void;
  onStepBegin?(test: TestCase, result: TestResult, step: TestStep): void;
  onStepEnd?(test: TestCase, result: TestResult, step: TestStep): void;
  onError?(error: TestError): void;
  onEnd?(result: FullResult): Promise<void> | void;
  onExit?(): Promise<void> | void;
}
```

### 6. Slack Reporter Example

```typescript
// slack-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class SlackReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') this.passed++;
    else if (result.status === 'failed') this.failed++;
    else if (result.status === 'skipped') this.skipped++;
  }

  async onEnd(result: FullResult) {
    const message = {
      text: `Test Results: ${result.status}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Test Run Complete*\n✅ Passed: ${this.passed}\n❌ Failed: ${this.failed}\n⏭️ Skipped: ${this.skipped}`
          }
        }
      ]
    };

    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default SlackReporter;
```

### 7. Test Attachments

```typescript
// Access attachments in reporter
class AttachmentReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    for (const attachment of result.attachments) {
      console.log(`Attachment: ${attachment.name}`);
      console.log(`Path: ${attachment.path}`);
      console.log(`Content Type: ${attachment.contentType}`);
    }
  }
}

// Add attachments in test
test('with attachment', async ({ page }, testInfo) => {
  await page.goto('/');
  
  const screenshot = await page.screenshot();
  await testInfo.attach('screenshot', {
    body: screenshot,
    contentType: 'image/png'
  });
});
```

### 8. Database Reporter

```typescript
// db-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class DatabaseReporter implements Reporter {
  private runId: string;

  async onBegin() {
    this.runId = `run-${Date.now()}`;
    await db.insert('test_runs', { id: this.runId, startTime: new Date() });
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    await db.insert('test_results', {
      runId: this.runId,
      testName: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message
    });
  }

  async onEnd(result: FullResult) {
    await db.update('test_runs', this.runId, {
      endTime: new Date(),
      status: result.status
    });
  }
}

export default DatabaseReporter;
```

### 9. Conditional Reporters

```typescript
// playwright.config.ts
const reporters: any[] = [['list']];

if (process.env.CI) {
  reporters.push(['junit', { outputFile: 'results.xml' }]);
  reporters.push(['./slack-reporter.ts']);
}

if (!process.env.CI) {
  reporters.push(['html', { open: 'on-failure' }]);
}

export default defineConfig({
  reporter: reporters,
});
```

---

## 💻 Practice Exercises

1. Configure multiple reporters
2. Create custom reporter
3. Send results to Slack
4. Store results in database
5. Generate custom HTML report

---

## ✅ Best Practices

- ✅ Use multiple reporters
- ✅ Include JUnit for CI
- ✅ Send notifications on failure
- ✅ Store historical results
- ❌ Don't block on slow reporters
- ❌ Avoid sensitive data in reports

---

## 📝 Quick Reference

```typescript
// Built-in reporters
reporter: 'html'
reporter: 'json'
reporter: 'junit'
reporter: 'list'
reporter: 'dot'

// Multiple reporters
reporter: [
  ['list'],
  ['html'],
  ['json', { outputFile: 'results.json' }]
]

// Custom reporter
reporter: [['./my-reporter.ts', { option: value }]]

// Reporter interface
onBegin(config, suite)
onTestBegin(test)
onTestEnd(test, result)
onEnd(result)
```

