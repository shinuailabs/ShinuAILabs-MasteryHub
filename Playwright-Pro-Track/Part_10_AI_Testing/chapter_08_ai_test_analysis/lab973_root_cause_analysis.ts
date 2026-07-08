/**
 * Lab 973: AI Root Cause Analysis
 *
 * CONCEPT:
 * AI performs deep root cause analysis on test failures by correlating
 * multiple data sources, identifying patterns, and tracing issues back
 * to their origin.
 *
 * BULLET POINTS:
 * - Correlate failure data
 * - Trace issue origins
 * - Identify systemic problems
 * - Suggest preventive measures
 * - Learn from past incidents
 */

// Example 1: Root cause categories
type RootCauseCategory =
  | 'code-change'
  | 'environment'
  | 'test-issue'
  | 'infrastructure'
  | 'data-issue'
  | 'timing'
  | 'dependency';

interface RootCauseResult {
  category: RootCauseCategory;
  confidence: number;
  description: string;
  evidence: string[];
  preventiveMeasures: string[];
}

// Example 2: Root cause analyzer
class AIRootCauseAnalyzer {
  analyze(
    failure: { error: string; timestamp: Date; testName: string },
    context: {
      recentCommits: { hash: string; files: string[]; author: string }[];
      environmentChanges: string[];
      relatedFailures: { testName: string; error: string }[];
    }
  ): RootCauseResult {
    // Check for code change correlation
    const codeChangeResult = this.analyzeCodeChanges(failure, context.recentCommits);
    if (codeChangeResult.confidence > 0.7) {
      return codeChangeResult;
    }

    // Check for environment issues
    const envResult = this.analyzeEnvironment(failure, context.environmentChanges);
    if (envResult.confidence > 0.7) {
      return envResult;
    }

    // Check for timing issues
    const timingResult = this.analyzeTimingIssues(failure);
    if (timingResult.confidence > 0.7) {
      return timingResult;
    }

    // Default to test issue
    return {
      category: 'test-issue',
      confidence: 0.5,
      description: 'Test may need maintenance',
      evidence: ['No clear external cause identified'],
      preventiveMeasures: ['Review test implementation', 'Add better error handling'],
    };
  }

  private analyzeCodeChanges(
    failure: { error: string; testName: string },
    commits: { hash: string; files: string[]; author: string }[]
  ): RootCauseResult {
    // Check if recent commits touched related files
    const relatedCommits = commits.filter((c) =>
      c.files.some((f) => failure.testName.toLowerCase().includes(f.split('/').pop()?.split('.')[0] || ''))
    );

    if (relatedCommits.length > 0) {
      return {
        category: 'code-change',
        confidence: 0.85,
        description: `Recent code changes may have caused the failure`,
        evidence: relatedCommits.map((c) => `Commit ${c.hash} by ${c.author}`),
        preventiveMeasures: [
          'Review recent commits',
          'Add pre-commit test hooks',
          'Improve code review process',
        ],
      };
    }

    return { category: 'code-change', confidence: 0.2, description: '', evidence: [], preventiveMeasures: [] };
  }

  private analyzeEnvironment(
    failure: { error: string },
    changes: string[]
  ): RootCauseResult {
    const envKeywords = ['environment', 'config', 'connection', 'service unavailable'];
    const isEnvRelated = envKeywords.some((kw) => failure.error.toLowerCase().includes(kw));

    if (isEnvRelated || changes.length > 0) {
      return {
        category: 'environment',
        confidence: 0.8,
        description: 'Environment or configuration issue detected',
        evidence: changes.length > 0 ? changes : ['Error message suggests environment issue'],
        preventiveMeasures: [
          'Verify environment configuration',
          'Add environment health checks',
          'Implement environment parity',
        ],
      };
    }

    return { category: 'environment', confidence: 0.1, description: '', evidence: [], preventiveMeasures: [] };
  }

  private analyzeTimingIssues(failure: { error: string }): RootCauseResult {
    const timingKeywords = ['timeout', 'timed out', 'too slow', 'race condition'];
    const isTimingRelated = timingKeywords.some((kw) => failure.error.toLowerCase().includes(kw));

    if (isTimingRelated) {
      return {
        category: 'timing',
        confidence: 0.9,
        description: 'Timing or synchronization issue',
        evidence: ['Error indicates timeout or timing problem'],
        preventiveMeasures: [
          'Add explicit waits',
          'Increase timeout values',
          'Use proper synchronization',
        ],
      };
    }

    return { category: 'timing', confidence: 0.1, description: '', evidence: [], preventiveMeasures: [] };
  }
}

// Example 3: Root cause report
function generateRootCauseReport(result: RootCauseResult): string {
  let report = '# Root Cause Analysis Report\n\n';
  report += `## Category: ${result.category}\n`;
  report += `Confidence: ${(result.confidence * 100).toFixed(0)}%\n\n`;
  report += `## Description\n${result.description}\n\n`;
  report += '## Evidence\n';
  result.evidence.forEach((e) => (report += `- ${e}\n`));
  report += '\n## Preventive Measures\n';
  result.preventiveMeasures.forEach((m) => (report += `- ${m}\n`));
  return report;
}

// Example 4: Usage
const rcaAnalyzer = new AIRootCauseAnalyzer();

const result = rcaAnalyzer.analyze(
  { error: 'Timeout waiting for element', timestamp: new Date(), testName: 'login.spec.ts' },
  {
    recentCommits: [{ hash: 'abc123', files: ['src/login.tsx'], author: 'dev@example.com' }],
    environmentChanges: [],
    relatedFailures: [],
  }
);

console.log(generateRootCauseReport(result));

/**
 * EXERCISE:
 * 1. Collect failure context data
 * 2. Correlate with code changes
 * 3. Identify root causes
 * 4. Implement preventive measures
 *
 * LEARNING:
 * - Root cause analysis prevents recurrence
 * - Correlation reveals hidden connections
 * - Evidence supports conclusions
 * - Prevention beats cure
 *
 * ONE LINER:
 * "AI traces failures to their source - fix the cause, not just the symptom."
 */

export { AIRootCauseAnalyzer, generateRootCauseReport };

