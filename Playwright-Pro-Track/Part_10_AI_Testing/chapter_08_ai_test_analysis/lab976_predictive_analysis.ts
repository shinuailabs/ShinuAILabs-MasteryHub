/**
 * Lab 976: AI Predictive Analysis
 *
 * CONCEPT:
 * AI uses historical data to predict future test outcomes, identify tests
 * likely to fail, and anticipate quality issues before they occur.
 *
 * BULLET POINTS:
 * - Predict test failures
 * - Identify at-risk tests
 * - Forecast quality trends
 * - Estimate bug likelihood
 * - Proactive issue prevention
 */

// Example 1: Prediction model
interface TestPrediction {
  testName: string;
  failureProbability: number;
  riskFactors: string[];
  recommendedAction: string;
}

interface QualityForecast {
  period: string;
  predictedPassRate: number;
  predictedFlakyCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// Example 2: AI predictor
class AIPredictiveAnalyzer {
  private historicalData: Map<string, { passed: boolean; factors: Record<string, number> }[]> = new Map();

  recordExecution(testName: string, passed: boolean, factors: Record<string, number>): void {
    if (!this.historicalData.has(testName)) {
      this.historicalData.set(testName, []);
    }
    this.historicalData.get(testName)!.push({ passed, factors });
  }

  predictFailure(testName: string, currentFactors: Record<string, number>): TestPrediction {
    const history = this.historicalData.get(testName) || [];
    const riskFactors: string[] = [];

    // Base failure probability from history
    let probability = history.length > 0
      ? history.filter((h) => !h.passed).length / history.length
      : 0.1;

    // Adjust based on current factors
    if (currentFactors.codeChurn > 50) {
      probability += 0.15;
      riskFactors.push('High code churn');
    }

    if (currentFactors.daysSinceLastRun > 30) {
      probability += 0.1;
      riskFactors.push('Not run recently');
    }

    if (currentFactors.complexity > 10) {
      probability += 0.1;
      riskFactors.push('High test complexity');
    }

    if (currentFactors.dependencies > 5) {
      probability += 0.05;
      riskFactors.push('Many dependencies');
    }

    probability = Math.min(probability, 0.95);

    return {
      testName,
      failureProbability: probability,
      riskFactors,
      recommendedAction: this.recommendAction(probability, riskFactors),
    };
  }

  private recommendAction(probability: number, riskFactors: string[]): string {
    if (probability > 0.7) {
      return 'Run with extra monitoring, prepare for failure investigation';
    }
    if (probability > 0.4) {
      return 'Review test before running, check for known issues';
    }
    if (riskFactors.includes('High code churn')) {
      return 'Verify test still aligns with changed code';
    }
    return 'Normal execution expected';
  }

  forecastQuality(days: number): QualityForecast {
    const allHistory = Array.from(this.historicalData.values()).flat();
    const recentHistory = allHistory.slice(-100);

    const currentPassRate = recentHistory.length > 0
      ? recentHistory.filter((h) => h.passed).length / recentHistory.length
      : 0.9;

    // Simple linear projection
    const trend = this.calculateTrend(allHistory);
    const predictedPassRate = Math.max(0, Math.min(1, currentPassRate + trend * days));

    const riskLevel = predictedPassRate > 0.9 ? 'low' : predictedPassRate > 0.8 ? 'medium' : 'high';

    return {
      period: `Next ${days} days`,
      predictedPassRate,
      predictedFlakyCount: Math.round((1 - predictedPassRate) * this.historicalData.size * 0.3),
      riskLevel,
      recommendations: this.generateForecastRecommendations(riskLevel, trend),
    };
  }

  private calculateTrend(history: { passed: boolean }[]): number {
    if (history.length < 10) return 0;

    const recentPassRate = history.slice(-10).filter((h) => h.passed).length / 10;
    const oldPassRate = history.slice(0, 10).filter((h) => h.passed).length / 10;

    return (recentPassRate - oldPassRate) / 10;
  }

  private generateForecastRecommendations(riskLevel: string, trend: number): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'high') {
      recommendations.push('Schedule test stabilization sprint');
      recommendations.push('Increase monitoring and alerting');
    }

    if (trend < 0) {
      recommendations.push('Investigate declining quality trend');
      recommendations.push('Review recent code changes for issues');
    }

    recommendations.push('Continue monitoring quality metrics');

    return recommendations;
  }
}

// Example 3: Batch predictions
function predictBatch(
  analyzer: AIPredictiveAnalyzer,
  tests: { name: string; factors: Record<string, number> }[]
): TestPrediction[] {
  return tests
    .map((t) => analyzer.predictFailure(t.name, t.factors))
    .sort((a, b) => b.failureProbability - a.failureProbability);
}

// Example 4: Usage
const predictor = new AIPredictiveAnalyzer();

// Record historical data
for (let i = 0; i < 50; i++) {
  predictor.recordExecution('login test', Math.random() > 0.1, { complexity: 5 });
  predictor.recordExecution('checkout test', Math.random() > 0.3, { complexity: 15 });
}

// Get predictions
const predictions = predictBatch(predictor, [
  { name: 'login test', factors: { codeChurn: 20, daysSinceLastRun: 1, complexity: 5, dependencies: 2 } },
  { name: 'checkout test', factors: { codeChurn: 80, daysSinceLastRun: 5, complexity: 15, dependencies: 8 } },
]);

console.log('Failure Predictions:');
predictions.forEach((p) => {
  console.log(`- ${p.testName}: ${(p.failureProbability * 100).toFixed(0)}% likely to fail`);
  console.log(`  Risk factors: ${p.riskFactors.join(', ')}`);
});

// Get forecast
const forecast = predictor.forecastQuality(7);
console.log(`\n7-Day Forecast: ${(forecast.predictedPassRate * 100).toFixed(1)}% pass rate (${forecast.riskLevel} risk)`);

/**
 * EXERCISE:
 * 1. Record test execution history
 * 2. Predict failure probabilities
 * 3. Forecast quality trends
 * 4. Act on predictions
 *
 * LEARNING:
 * - Historical data enables prediction
 * - Risk factors increase accuracy
 * - Forecasts enable proactive action
 * - Prevention is better than cure
 *
 * ONE LINER:
 * "AI predicts test failures before they happen - fix issues proactively."
 */

export { AIPredictiveAnalyzer, predictBatch };

