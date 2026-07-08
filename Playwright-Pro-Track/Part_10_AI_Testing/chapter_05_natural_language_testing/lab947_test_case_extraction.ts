/**
 * Lab 947: AI Test Case Extraction
 *
 * CONCEPT:
 * AI can extract test cases from various sources like documentation, emails,
 * chat logs, and meeting notes. This ensures no test scenarios are missed
 * and accelerates test planning.
 *
 * BULLET POINTS:
 * - Extract tests from documentation
 * - Parse requirements documents
 * - Analyze user feedback for tests
 * - Convert bug reports to tests
 * - Mine chat logs for scenarios
 */

// Example 1: Extract test cases from documentation
interface ExtractedTestCase {
  source: string;
  title: string;
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  priority: 'high' | 'medium' | 'low';
}

function extractTestCasesFromDoc(document: string): ExtractedTestCase[] {
  const testCases: ExtractedTestCase[] = [];

  // Pattern: "Users can/should/must be able to..."
  const canPatterns = document.match(/users?\s+(?:can|should|must)\s+(?:be able to\s+)?([^.]+)/gi) || [];

  canPatterns.forEach((pattern, index) => {
    const action = pattern.replace(/users?\s+(?:can|should|must)\s+(?:be able to\s+)?/i, '');
    testCases.push({
      source: 'documentation',
      title: `Verify user can ${action}`,
      preconditions: ['User is logged in'],
      steps: [`Attempt to ${action}`],
      expectedResult: `User successfully ${action}`,
      priority: pattern.includes('must') ? 'high' : 'medium',
    });
  });

  // Pattern: "When X, then Y"
  const whenThenPatterns = document.match(/when\s+([^,]+),\s+(?:then\s+)?([^.]+)/gi) || [];

  whenThenPatterns.forEach((pattern) => {
    const match = pattern.match(/when\s+([^,]+),\s+(?:then\s+)?([^.]+)/i);
    if (match) {
      testCases.push({
        source: 'documentation',
        title: `When ${match[1]}`,
        preconditions: [],
        steps: [match[1]],
        expectedResult: match[2],
        priority: 'medium',
      });
    }
  });

  return testCases;
}

// Example 2: Extract from bug report
interface BugReport {
  id: string;
  title: string;
  description: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
}

function bugReportToTestCase(bug: BugReport): ExtractedTestCase {
  return {
    source: `Bug #${bug.id}`,
    title: `Regression: ${bug.title}`,
    preconditions: [],
    steps: bug.stepsToReproduce,
    expectedResult: bug.expectedBehavior,
    priority: 'high', // Regression tests are high priority
  };
}

// Example 3: Extract from user feedback
function extractFromFeedback(feedback: string): ExtractedTestCase[] {
  const testCases: ExtractedTestCase[] = [];

  // Look for "I tried to... but..."
  const triedButPatterns = feedback.match(/i tried to\s+([^,]+),?\s+but\s+([^.]+)/gi) || [];

  triedButPatterns.forEach((pattern) => {
    const match = pattern.match(/i tried to\s+([^,]+),?\s+but\s+([^.]+)/i);
    if (match) {
      testCases.push({
        source: 'user feedback',
        title: `User can ${match[1]}`,
        preconditions: [],
        steps: [`Try to ${match[1]}`],
        expectedResult: `Action completes successfully (not: ${match[2]})`,
        priority: 'high',
      });
    }
  });

  return testCases;
}

// Example 4: Generate Playwright test from extracted case
function generatePlaywrightTest(testCase: ExtractedTestCase): string {
  let code = `/**\n * Source: ${testCase.source}\n * Priority: ${testCase.priority}\n */\n`;
  code += `test('${testCase.title}', async ({ page }) => {\n`;

  // Add preconditions as comments
  testCase.preconditions.forEach((pre) => {
    code += `  // Precondition: ${pre}\n`;
  });

  // Add steps
  testCase.steps.forEach((step, i) => {
    code += `  // Step ${i + 1}: ${step}\n`;
    code += `  // TODO: Implement step\n`;
  });

  // Add assertion
  code += `\n  // Expected: ${testCase.expectedResult}\n`;
  code += `  // TODO: Add assertion\n`;
  code += `});\n`;

  return code;
}

// Example 5: Batch extraction
const sampleDocumentation = `
Product Requirements:
- Users must be able to login with email and password
- Users can reset their password via email
- When a user enters wrong password 3 times, then account is locked
- Users should be able to update their profile information
`;

const extractedTests = extractTestCasesFromDoc(sampleDocumentation);
console.log(`Extracted ${extractedTests.length} test cases from documentation`);

/**
 * EXERCISE:
 * 1. Extract test cases from your documentation
 * 2. Convert bug reports to regression tests
 * 3. Analyze user feedback for test scenarios
 * 4. Generate Playwright tests from extracted cases
 *
 * LEARNING:
 * - Test cases exist in many sources
 * - AI can extract and structure them
 * - Bug reports become regression tests
 * - User feedback reveals edge cases
 *
 * ONE LINER:
 * "AI finds test cases hiding in your docs, bugs, and feedback - nothing escapes."
 */

export {
  extractTestCasesFromDoc,
  bugReportToTestCase,
  extractFromFeedback,
  generatePlaywrightTest,
};

