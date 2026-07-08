/**
 * Lab 977: AI Test Report Generation
 *
 * CONCEPT:
 * AI generates comprehensive, intelligent test reports that provide insights,
 * summarize results, and highlight key information for different stakeholders.
 *
 * BULLET POINTS:
 * - Automated report generation
 * - Stakeholder-specific views
 * - Executive summaries
 * - Technical details
 * - Actionable insights
 */

// Example 1: Report types
interface TestReport {
  title: string;
  generatedAt: Date;
  period: { start: Date; end: Date };
  summary: ExecutiveSummary;
  details: TestDetails;
  insights: string[];
  recommendations: string[];
}

interface ExecutiveSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
  trend: 'improving' | 'stable' | 'declining';
  healthScore: number;
}

interface TestDetails {
  byCategory: Record<string, { passed: number; failed: number }>;
  slowestTests: { name: string; duration: number }[];
  flakyTests: string[];
  newFailures: string[];
  fixedTests: string[];
}

// Example 2: AI report generator
class AIReportGenerator {
  generateReport(data: {
    executions: { name: string; passed: boolean; duration: number; category: string }[];
    previousPeriod?: { passRate: number };
  }): TestReport {
    const now = new Date();
    const summary = this.generateSummary(data.executions, data.previousPeriod);
    const details = this.generateDetails(data.executions);
    const insights = this.generateInsights(summary, details);
    const recommendations = this.generateRecommendations(summary, details);

    return {
      title: 'AI-Generated Test Report',
      generatedAt: now,
      period: { start: new Date(now.getTime() - 24 * 60 * 60 * 1000), end: now },
      summary,
      details,
      insights,
      recommendations,
    };
  }

  private generateSummary(
    executions: { passed: boolean }[],
    previousPeriod?: { passRate: number }
  ): ExecutiveSummary {
    const passed = executions.filter((e) => e.passed).length;
    const failed = executions.filter((e) => !e.passed).length;
    const passRate = passed / executions.length;

    let trend: ExecutiveSummary['trend'] = 'stable';
    if (previousPeriod) {
      if (passRate > previousPeriod.passRate + 0.02) trend = 'improving';
      if (passRate < previousPeriod.passRate - 0.02) trend = 'declining';
    }

    return {
      totalTests: executions.length,
      passed,
      failed,
      skipped: 0,
      passRate,
      trend,
      healthScore: this.calculateHealthScore(passRate, trend),
    };
  }

  private calculateHealthScore(passRate: number, trend: string): number {
    let score = passRate * 80;
    if (trend === 'improving') score += 10;
    if (trend === 'declining') score -= 10;
    return Math.round(score);
  }

  private generateDetails(
    executions: { name: string; passed: boolean; duration: number; category: string }[]
  ): TestDetails {
    const byCategory: Record<string, { passed: number; failed: number }> = {};

    executions.forEach((e) => {
      if (!byCategory[e.category]) {
        byCategory[e.category] = { passed: 0, failed: 0 };
      }
      if (e.passed) byCategory[e.category].passed++;
      else byCategory[e.category].failed++;
    });

    const slowestTests = [...executions]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map((e) => ({ name: e.name, duration: e.duration }));

    return {
      byCategory,
      slowestTests,
      flakyTests: [],
      newFailures: executions.filter((e) => !e.passed).map((e) => e.name).slice(0, 5),
      fixedTests: [],
    };
  }

  private generateInsights(summary: ExecutiveSummary, details: TestDetails): string[] {
    const insights: string[] = [];

    if (summary.passRate >= 0.95) {
      insights.push('Excellent test health - pass rate above 95%');
    } else if (summary.passRate < 0.85) {
      insights.push('Test health needs attention - pass rate below 85%');
    }

    if (summary.trend === 'declining') {
      insights.push('Quality is declining - investigate recent changes');
    }

    if (details.slowestTests[0]?.duration > 60000) {
      insights.push(`Slowest test takes ${(details.slowestTests[0].duration / 1000).toFixed(0)}s - consider optimization`);
    }

    return insights;
  }

  private generateRecommendations(summary: ExecutiveSummary, details: TestDetails): string[] {
    const recommendations: string[] = [];

    if (summary.failed > 0) {
      recommendations.push(`Fix ${summary.failed} failing tests to improve quality`);
    }

    if (details.slowestTests.length > 0) {
      recommendations.push('Optimize slow tests for faster feedback');
    }

    if (summary.trend === 'declining') {
      recommendations.push('Schedule quality improvement sprint');
    }

    return recommendations;
  }
}

// Example 3: Markdown report formatter
function formatReportAsMarkdown(report: TestReport): string {
  let md = `# ${report.title}\n\n`;
  md += `Generated: ${report.generatedAt.toISOString()}\n\n`;

  md += '## Executive Summary\n\n';
  md += `| Metric | Value |\n|--------|-------|\n`;
  md += `| Total Tests | ${report.summary.totalTests} |\n`;
  md += `| Passed | ${report.summary.passed} |\n`;
  md += `| Failed | ${report.summary.failed} |\n`;
  md += `| Pass Rate | ${(report.summary.passRate * 100).toFixed(1)}% |\n`;
  md += `| Trend | ${report.summary.trend} |\n`;
  md += `| Health Score | ${report.summary.healthScore}/100 |\n\n`;

  md += '## Key Insights\n\n';
  report.insights.forEach((i) => (md += `- ${i}\n`));

  md += '\n## Recommendations\n\n';
  report.recommendations.forEach((r) => (md += `- ${r}\n`));

  return md;
}

// Example 4: Usage
const generator = new AIReportGenerator();
const report = generator.generateReport({
  executions: [
    { name: 'login test', passed: true, duration: 5000, category: 'auth' },
    { name: 'checkout test', passed: false, duration: 45000, category: 'commerce' },
    { name: 'search test', passed: true, duration: 8000, category: 'search' },
  ],
  previousPeriod: { passRate: 0.7 },
});

console.log(formatReportAsMarkdown(report));

/**
 * EXERCISE:
 * 1. Generate test reports automatically
 * 2. Customize for stakeholders
 * 3. Include actionable insights
 * 4. Schedule regular reports
 *
 * LEARNING:
 * - AI summarizes complex data
 * - Different views for different audiences
 * - Insights drive action
 * - Automation ensures consistency
 *
 * ONE LINER:
 * "AI generates test reports that tell the story - not just numbers, but insights."
 */

export { AIReportGenerator, formatReportAsMarkdown };
