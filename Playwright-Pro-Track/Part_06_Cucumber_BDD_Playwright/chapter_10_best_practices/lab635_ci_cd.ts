/**
 * Lab 635: CI/CD Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * CI/CD integration best practices:
 * 
 * - Pipeline configuration
 * - Environment setup
 * - Artifact management
 * - Failure handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure CI pipeline
 * 2. Handle artifacts
 * 3. Manage failures
 *
 * =====================
 * SOLUTION:
 * =====================
 */

/*
 * Best Practice 1: GitHub Actions Workflow
 */
const githubActionsWorkflow = `
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM

env:
  CI: true
  BASE_URL: \${{ secrets.TEST_BASE_URL }}

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Run tests (Shard \${{ matrix.shard }}/4)
        run: |
          npx cucumber-js \\
            --tags "@shard\${{ matrix.shard }}" \\
            --parallel 2 \\
            --retry 1
        continue-on-error: true
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-shard-\${{ matrix.shard }}
          path: |
            reports/
            screenshots/
            traces/
          retention-days: 7
      
      - name: Upload JUnit results
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Test Results (Shard \${{ matrix.shard }})
          path: reports/junit-report.xml
          reporter: java-junit

  merge-reports:
    needs: test
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-results
      
      - name: Merge reports
        run: |
          npm ci
          node scripts/merge-reports.js
      
      - name: Upload merged report
        uses: actions/upload-artifact@v4
        with:
          name: merged-test-report
          path: reports/merged/
`;

/*
 * Best Practice 2: Environment Configuration
 */
const ciEnvironmentSetup = `
# .env.ci
BASE_URL=https://staging.example.com
HEADLESS=true
BROWSER=chromium
PARALLEL=4
RETRY=1
TIMEOUT=60000
ENABLE_TRACES=true
ENABLE_VIDEOS=false
`;

/*
 * Best Practice 3: Retry Configuration
 */
// cucumber.js
const cucumberCIConfig = {
    ci: {
        require: ['step_definitions/**/*.ts', 'support/**/*.ts'],
        requireModule: ['ts-node/register'],
        format: [
            'progress',
            'json:reports/cucumber-report.json',
            'junit:reports/junit-report.xml',
        ],
        parallel: parseInt(process.env.PARALLEL || '4'),
        retry: parseInt(process.env.RETRY || '1'),
        retryTagFilter: '@flaky',
        tags: 'not @skip and not @wip',
    },
};

/*
 * Best Practice 4: Failure Notification
 */
async function sendSlackNotification(results: any): Promise<void> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;
    
    const message = {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: results.failed > 0 ? '❌ Tests Failed' : '✅ Tests Passed',
                },
            },
            {
                type: 'section',
                fields: [
                    { type: 'mrkdwn', text: `*Total:* ${results.total}` },
                    { type: 'mrkdwn', text: `*Passed:* ${results.passed}` },
                    { type: 'mrkdwn', text: `*Failed:* ${results.failed}` },
                    { type: 'mrkdwn', text: `*Duration:* ${results.duration}` },
                ],
            },
        ],
    };
    
    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
    });
}

/*
 * Best Practice 5: Test Selection Strategy
 * 
 * PR: Run smoke tests only
 * Merge to main: Run full suite
 * Nightly: Run full suite + slow tests
 */
function getTestTags(): string {
    const eventName = process.env.GITHUB_EVENT_NAME;
    const ref = process.env.GITHUB_REF;
    
    if (eventName === 'pull_request') {
        return '@smoke';
    }
    
    if (eventName === 'schedule') {
        return 'not @skip';  // Run everything
    }
    
    if (ref === 'refs/heads/main') {
        return 'not @skip and not @slow';
    }
    
    return '@smoke';
}

// Export
export { githubActionsWorkflow, ciEnvironmentSetup, cucumberCIConfig, sendSlackNotification, getTestTags };

