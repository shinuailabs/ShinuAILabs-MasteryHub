# Part 08: Reports

## 📚 Overview
Cucumber reports provide visibility into test results with various formats for different audiences.

---

## 🎯 Key Concepts

### 1. Built-in Formatters

```javascript
// cucumber.js
module.exports = {
  default: {
    format: [
      'progress-bar',                           // Console progress
      'html:reports/cucumber-report.html',      // HTML report
      'json:reports/cucumber-report.json',      // JSON report
      'junit:reports/junit-report.xml',         // JUnit XML
      'message:reports/messages.ndjson'         // Cucumber messages
    ]
  }
};
```

### 2. Progress Formatters

```javascript
// cucumber.js
module.exports = {
  default: {
    format: [
      'progress',        // Dots: ...F..
      'progress-bar',    // Progress bar with percentage
      'summary'          // Summary at end
    ]
  }
};
```

### 3. HTML Report

```javascript
// cucumber.js
module.exports = {
  default: {
    format: [
      'html:reports/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
};
```

### 4. Multiple Cucumber HTML Reporter

```bash
npm install -D multiple-cucumber-html-reporter
```

```typescript
// generate-report.ts
import report from 'multiple-cucumber-html-reporter';

report.generate({
  jsonDir: './reports',
  reportPath: './reports/html',
  metadata: {
    browser: {
      name: 'chrome',
      version: '120'
    },
    device: 'Local Machine',
    platform: {
      name: 'macOS',
      version: '14.0'
    }
  },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'E-Commerce Tests' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Execution Date', value: new Date().toISOString() }
    ]
  }
});
```

### 5. Allure Report

```bash
npm install -D allure-cucumberjs allure-commandline
```

```javascript
// cucumber.js
module.exports = {
  default: {
    format: ['allure-cucumberjs/reporter'],
    formatOptions: {
      resultsDir: 'allure-results'
    }
  }
};
```

```bash
# Generate and open report
npx allure generate allure-results -o allure-report --clean
npx allure open allure-report
```

### 6. Attaching Screenshots

```typescript
// support/hooks.ts
import { After, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

After(async function(this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // Take screenshot
    const screenshot = await this.page.screenshot({
      fullPage: true
    });
    
    // Attach to report
    this.attach(screenshot, 'image/png');
  }
});

// Attach during step
When('I take a screenshot', async function(this: CustomWorld) {
  const screenshot = await this.page.screenshot();
  this.attach(screenshot, 'image/png');
});
```

### 7. Attaching Other Content

```typescript
// Attach text
this.attach('Debug information here', 'text/plain');

// Attach JSON
this.attach(JSON.stringify(data, null, 2), 'application/json');

// Attach HTML
this.attach('<h1>Custom HTML</h1>', 'text/html');

// Attach video
const videoBuffer = await fs.promises.readFile('video.webm');
this.attach(videoBuffer, 'video/webm');

// Attach with filename
this.attach(screenshot, {
  mediaType: 'image/png',
  fileName: 'failure-screenshot.png'
});
```

### 8. Custom Reporter

```typescript
// support/custom-reporter.ts
import { Formatter, IFormatterOptions } from '@cucumber/cucumber';

export default class CustomReporter extends Formatter {
  constructor(options: IFormatterOptions) {
    super(options);
    
    options.eventBroadcaster.on('envelope', (envelope) => {
      if (envelope.testCaseStarted) {
        this.log('Test started\n');
      }
      
      if (envelope.testCaseFinished) {
        this.log('Test finished\n');
      }
      
      if (envelope.testStepFinished) {
        const status = envelope.testStepFinished.testStepResult?.status;
        this.log(`Step: ${status}\n`);
      }
    });
  }
}
```

```javascript
// cucumber.js
module.exports = {
  default: {
    format: ['./support/custom-reporter.ts']
  }
};
```

### 9. JUnit Report for CI

```javascript
// cucumber.js
module.exports = {
  default: {
    format: [
      'junit:reports/junit.xml'
    ]
  }
};
```

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test

- name: Publish Test Results
  uses: EnricoMi/publish-unit-test-result-action@v2
  if: always()
  with:
    files: reports/junit.xml
```

### 10. Report Scripts

```json
{
  "scripts": {
    "test": "cucumber-js",
    "report:html": "node generate-report.js",
    "report:allure": "allure generate allure-results -o allure-report --clean",
    "report:open": "allure open allure-report",
    "test:report": "npm test && npm run report:html"
  }
}
```

---

## 💻 Practice Exercises

1. Configure HTML report
2. Set up Allure reporting
3. Attach screenshots on failure
4. Create JUnit report for CI
5. Build custom reporter

---

## ✅ Best Practices

- ✅ Use multiple report formats
- ✅ Attach screenshots on failure
- ✅ Include metadata in reports
- ✅ Archive reports in CI
- ❌ Don't skip report generation
- ❌ Avoid large attachments

---

## 📝 Quick Reference

```javascript
// cucumber.js formats
format: [
  'progress-bar',
  'html:reports/report.html',
  'json:reports/report.json',
  'junit:reports/junit.xml'
]

// Attachments
this.attach(screenshot, 'image/png');
this.attach(text, 'text/plain');
this.attach(json, 'application/json');
```

```bash
# Generate reports
npx cucumber-js
npx allure generate allure-results
npx allure open allure-report
```

