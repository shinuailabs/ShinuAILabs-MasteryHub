/**
 * Lab 974: AI Performance Analysis
 *
 * CONCEPT:
 * AI analyzes test execution performance to identify bottlenecks, optimize
 * resource usage, and improve overall test suite efficiency.
 *
 * BULLET POINTS:
 * - Identify slow tests
 * - Analyze resource bottlenecks
 * - Optimize execution paths
 * - Predict performance issues
 * - Recommend improvements
 */

import { test, expect } from '@playwright/test';

// Example 1: Performance metrics
interface TestPerformanceMetrics {
  testName: string;
  duration: number;
  cpuUsage: number;
  memoryUsage: number;
  networkRequests: number;
  screenshots: number;
  waitTime: number;
  actionTime: number;
}

interface PerformanceAnalysis {
  slowTests: { name: string; duration: number; reason: string }[];
  bottlenecks: { type: string; impact: number; suggestion: string }[];
  optimization: { action: string; expectedImprovement: string }[];
}

// Example 2: AI performance analyzer
class AIPerformanceAnalyzer {
  analyze(metrics: TestPerformanceMetrics[]): PerformanceAnalysis {
    const slowTests = this.identifySlowTests(metrics);
    const bottlenecks = this.identifyBottlenecks(metrics);
    const optimization = this.suggestOptimizations(metrics, bottlenecks);

    return { slowTests, bottlenecks, optimization };
  }

  private identifySlowTests(
    metrics: TestPerformanceMetrics[]
  ): PerformanceAnalysis['slowTests'] {
    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
    const threshold = avgDuration * 2;

    return metrics
      .filter((m) => m.duration > threshold)
      .map((m) => ({
        name: m.testName,
        duration: m.duration,
        reason: this.analyzeSlowReason(m),
      }))
      .sort((a, b) => b.duration - a.duration);
  }

  private analyzeSlowReason(metrics: TestPerformanceMetrics): string {
    if (metrics.waitTime > metrics.duration * 0.5) {
      return 'Excessive wait time';
    }
    if (metrics.networkRequests > 50) {
      return 'Too many network requests';
    }
    if (metrics.screenshots > 10) {
      return 'Too many screenshots';
    }
    if (metrics.memoryUsage > 500) {
      return 'High memory usage';
    }
    return 'Complex test logic';
  }

  private identifyBottlenecks(
    metrics: TestPerformanceMetrics[]
  ): PerformanceAnalysis['bottlenecks'] {
    const bottlenecks: PerformanceAnalysis['bottlenecks'] = [];

    const avgWaitTime = metrics.reduce((sum, m) => sum + m.waitTime, 0) / metrics.length;
    if (avgWaitTime > 5000) {
      bottlenecks.push({
        type: 'Wait Time',
        impact: avgWaitTime / 1000,
        suggestion: 'Use more specific waits instead of fixed timeouts',
      });
    }

    const avgMemory = metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length;
    if (avgMemory > 300) {
      bottlenecks.push({
        type: 'Memory Usage',
        impact: avgMemory,
        suggestion: 'Close unused pages and contexts between tests',
      });
    }

    const avgNetworkRequests = metrics.reduce((sum, m) => sum + m.networkRequests, 0) / metrics.length;
    if (avgNetworkRequests > 30) {
      bottlenecks.push({
        type: 'Network Requests',
        impact: avgNetworkRequests,
        suggestion: 'Mock API responses for faster execution',
      });
    }

    return bottlenecks.sort((a, b) => b.impact - a.impact);
  }

  private suggestOptimizations(
    metrics: TestPerformanceMetrics[],
    bottlenecks: PerformanceAnalysis['bottlenecks']
  ): PerformanceAnalysis['optimization'] {
    const optimizations: PerformanceAnalysis['optimization'] = [];

    if (bottlenecks.some((b) => b.type === 'Wait Time')) {
      optimizations.push({
        action: 'Replace waitForTimeout with waitForSelector',
        expectedImprovement: '20-40% faster execution',
      });
    }

    if (bottlenecks.some((b) => b.type === 'Network Requests')) {
      optimizations.push({
        action: 'Implement API mocking for tests',
        expectedImprovement: '30-50% faster execution',
      });
    }

    const slowTests = metrics.filter((m) => m.duration > 30000);
    if (slowTests.length > metrics.length * 0.2) {
      optimizations.push({
        action: 'Split large tests into smaller focused tests',
        expectedImprovement: 'Better parallelization',
      });
    }

    optimizations.push({
      action: 'Enable parallel execution with 4+ workers',
      expectedImprovement: '50-75% faster total execution',
    });

    return optimizations;
  }
}

// Example 3: Performance report
function generatePerformanceReport(analysis: PerformanceAnalysis): string {
  let report = '# Test Performance Analysis\n\n';

  report += '## Slow Tests\n';
  analysis.slowTests.slice(0, 5).forEach((t) => {
    report += `- ${t.name}: ${(t.duration / 1000).toFixed(1)}s (${t.reason})\n`;
  });

  report += '\n## Bottlenecks\n';
  analysis.bottlenecks.forEach((b) => {
    report += `- ${b.type}: Impact ${b.impact.toFixed(1)}\n`;
    report += `  Suggestion: ${b.suggestion}\n`;
  });

  report += '\n## Optimization Recommendations\n';
  analysis.optimization.forEach((o) => {
    report += `- ${o.action}\n`;
    report += `  Expected: ${o.expectedImprovement}\n`;
  });

  return report;
}

// Example 4: Sample analysis
const sampleMetrics: TestPerformanceMetrics[] = [
  { testName: 'login test', duration: 15000, cpuUsage: 45, memoryUsage: 200, networkRequests: 20, screenshots: 2, waitTime: 3000, actionTime: 12000 },
  { testName: 'checkout test', duration: 45000, cpuUsage: 70, memoryUsage: 400, networkRequests: 80, screenshots: 5, waitTime: 15000, actionTime: 30000 },
  { testName: 'search test', duration: 8000, cpuUsage: 30, memoryUsage: 150, networkRequests: 15, screenshots: 1, waitTime: 2000, actionTime: 6000 },
];

const analyzer = new AIPerformanceAnalyzer();
const analysis = analyzer.analyze(sampleMetrics);
console.log(generatePerformanceReport(analysis));

/**
 * EXERCISE:
 * 1. Collect performance metrics
 * 2. Analyze bottlenecks
 * 3. Implement optimizations
 * 4. Measure improvements
 *
 * LEARNING:
 * - Performance impacts feedback speed
 * - Bottlenecks reveal improvement areas
 * - Optimization is iterative
 * - AI guides efficient improvements
 *
 * ONE LINER:
 * "AI finds performance bottlenecks so your tests run faster - every second counts."
 */

export { AIPerformanceAnalyzer, generatePerformanceReport };

