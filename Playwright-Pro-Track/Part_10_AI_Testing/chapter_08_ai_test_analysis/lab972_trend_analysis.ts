/**
 * Lab 972: AI Test Trend Analysis
 *
 * CONCEPT:
 * AI analyzes test execution trends over time to identify patterns,
 * predict issues, and provide insights for continuous improvement.
 *
 * BULLET POINTS:
 * - Track metrics over time
 * - Identify trends and patterns
 * - Predict future issues
 * - Anomaly detection
 * - Actionable insights
 */

// Example 1: Trend data structure
interface TrendDataPoint {
  date: Date;
  passRate: number;
  failCount: number;
  flakyCount: number;
  avgDuration: number;
  totalTests: number;
}

interface TrendAnalysis {
  metric: string;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  prediction: string;
  recommendation: string;
}

// Example 2: Trend analyzer
class AITrendAnalyzer {
  private data: TrendDataPoint[] = [];

  addDataPoint(point: TrendDataPoint): void {
    this.data.push(point);
  }

  analyzeTrends(): TrendAnalysis[] {
    if (this.data.length < 7) {
      return [{ metric: 'insufficient-data', trend: 'stable', changePercent: 0, prediction: 'Need more data', recommendation: 'Collect at least 7 days of data' }];
    }

    const analyses: TrendAnalysis[] = [];

    // Analyze pass rate trend
    analyses.push(this.analyzeMetric('passRate', 'Pass Rate'));

    // Analyze flaky test trend
    analyses.push(this.analyzeMetric('flakyCount', 'Flaky Tests'));

    // Analyze duration trend
    analyses.push(this.analyzeMetric('avgDuration', 'Execution Time'));

    return analyses;
  }

  private analyzeMetric(key: keyof TrendDataPoint, name: string): TrendAnalysis {
    const recent = this.data.slice(-7);
    const older = this.data.slice(-14, -7);

    const recentAvg = recent.reduce((sum, d) => sum + (d[key] as number), 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, d) => sum + (d[key] as number), 0) / older.length : recentAvg;

    const changePercent = olderAvg !== 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    let trend: 'improving' | 'stable' | 'declining';
    if (key === 'passRate') {
      trend = changePercent > 2 ? 'improving' : changePercent < -2 ? 'declining' : 'stable';
    } else {
      trend = changePercent < -2 ? 'improving' : changePercent > 2 ? 'declining' : 'stable';
    }

    return {
      metric: name,
      trend,
      changePercent: Math.round(changePercent * 10) / 10,
      prediction: this.generatePrediction(key, trend, recentAvg),
      recommendation: this.generateRecommendation(key, trend),
    };
  }

  private generatePrediction(key: keyof TrendDataPoint, trend: string, current: number): string {
    if (trend === 'declining') {
      return `${key} may continue to decline if no action is taken`;
    }
    if (trend === 'improving') {
      return `${key} is on track to meet targets`;
    }
    return `${key} is stable at current levels`;
  }

  private generateRecommendation(key: keyof TrendDataPoint, trend: string): string {
    if (key === 'passRate' && trend === 'declining') {
      return 'Investigate recent failures and prioritize fixes';
    }
    if (key === 'flakyCount' && trend === 'declining') {
      return 'Address flaky tests to improve reliability';
    }
    if (key === 'avgDuration' && trend === 'declining') {
      return 'Optimize slow tests or add parallelization';
    }
    return 'Continue monitoring';
  }

  detectAnomalies(): { date: Date; metric: string; value: number; expected: number }[] {
    const anomalies: { date: Date; metric: string; value: number; expected: number }[] = [];

    if (this.data.length < 7) return anomalies;

    const avgPassRate = this.data.reduce((sum, d) => sum + d.passRate, 0) / this.data.length;
    const stdDev = Math.sqrt(this.data.reduce((sum, d) => sum + Math.pow(d.passRate - avgPassRate, 2), 0) / this.data.length);

    this.data.forEach((point) => {
      if (Math.abs(point.passRate - avgPassRate) > 2 * stdDev) {
        anomalies.push({
          date: point.date,
          metric: 'passRate',
          value: point.passRate,
          expected: avgPassRate,
        });
      }
    });

    return anomalies;
  }
}

// Example 3: Generate trend report
function generateTrendReport(analyzer: AITrendAnalyzer): string {
  const trends = analyzer.analyzeTrends();
  const anomalies = analyzer.detectAnomalies();

  let report = '# Test Trend Analysis Report\n\n';

  report += '## Trend Summary\n';
  trends.forEach((t) => {
    const emoji = t.trend === 'improving' ? '📈' : t.trend === 'declining' ? '📉' : '➡️';
    report += `### ${t.metric} ${emoji}\n`;
    report += `- Trend: ${t.trend} (${t.changePercent > 0 ? '+' : ''}${t.changePercent}%)\n`;
    report += `- Prediction: ${t.prediction}\n`;
    report += `- Recommendation: ${t.recommendation}\n\n`;
  });

  if (anomalies.length > 0) {
    report += '## Anomalies Detected\n';
    anomalies.forEach((a) => {
      report += `- ${a.date.toISOString().split('T')[0]}: ${a.metric} was ${a.value} (expected ~${a.expected.toFixed(2)})\n`;
    });
  }

  return report;
}

// Example 4: Sample usage
const trendAnalyzer = new AITrendAnalyzer();

// Add historical data
for (let i = 14; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  trendAnalyzer.addDataPoint({
    date,
    passRate: 0.9 + Math.random() * 0.05,
    failCount: Math.floor(Math.random() * 10),
    flakyCount: Math.floor(Math.random() * 5),
    avgDuration: 30 + Math.random() * 10,
    totalTests: 500,
  });
}

console.log(generateTrendReport(trendAnalyzer));

/**
 * EXERCISE:
 * 1. Collect test execution data
 * 2. Analyze trends over time
 * 3. Detect anomalies
 * 4. Generate actionable insights
 *
 * LEARNING:
 * - Trends reveal patterns
 * - Anomalies indicate issues
 * - Predictions enable proactive action
 * - Data drives improvement
 *
 * ONE LINER:
 * "AI sees patterns in your test data - trends today, predictions tomorrow."
 */

export { AITrendAnalyzer, generateTrendReport };

