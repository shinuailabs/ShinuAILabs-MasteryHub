/**
 * Lab 991: Measuring AI ROI in Testing
 *
 * CONCEPT:
 * Quantify the value AI brings to your testing efforts. Track time saved,
 * quality improvements, and costs to justify and optimize AI investments.
 *
 * BULLET POINTS:
 * - Time savings measurement
 * - Quality improvements
 * - Cost tracking
 * - Productivity metrics
 * - ROI calculation
 */

// Example 1: ROI metrics
interface AIROIMetrics {
  timeSaved: { hours: number; tasks: string[] };
  qualityImprovement: { metricBefore: number; metricAfter: number; metric: string };
  costSavings: { laborCost: number; aiCost: number; netSavings: number };
  productivityGain: { testsPerDay: { before: number; after: number } };
}

// Example 2: Time tracking
interface TimeTracking {
  task: string;
  withoutAI: number; // minutes
  withAI: number; // minutes
  saved: number; // minutes
}

const timeTrackingData: TimeTracking[] = [
  { task: 'Write unit test', withoutAI: 30, withAI: 10, saved: 20 },
  { task: 'Write E2E test', withoutAI: 60, withAI: 20, saved: 40 },
  { task: 'Debug failing test', withoutAI: 45, withAI: 15, saved: 30 },
  { task: 'Analyze test report', withoutAI: 30, withAI: 5, saved: 25 },
  { task: 'Generate test data', withoutAI: 20, withAI: 5, saved: 15 },
];

function calculateTimeSavings(data: TimeTracking[]): {
  totalSaved: number;
  percentageSaved: number;
} {
  const totalWithoutAI = data.reduce((sum, t) => sum + t.withoutAI, 0);
  const totalWithAI = data.reduce((sum, t) => sum + t.withAI, 0);
  const totalSaved = totalWithoutAI - totalWithAI;

  return {
    totalSaved,
    percentageSaved: (totalSaved / totalWithoutAI) * 100,
  };
}

// Example 3: Quality metrics comparison
interface QualityComparison {
  metric: string;
  before: number;
  after: number;
  improvement: number;
}

function compareQuality(
  beforeAI: { bugEscapes: number; testCoverage: number; flakyRate: number },
  afterAI: { bugEscapes: number; testCoverage: number; flakyRate: number }
): QualityComparison[] {
  return [
    {
      metric: 'Bug Escapes',
      before: beforeAI.bugEscapes,
      after: afterAI.bugEscapes,
      improvement: ((beforeAI.bugEscapes - afterAI.bugEscapes) / beforeAI.bugEscapes) * 100,
    },
    {
      metric: 'Test Coverage',
      before: beforeAI.testCoverage,
      after: afterAI.testCoverage,
      improvement: afterAI.testCoverage - beforeAI.testCoverage,
    },
    {
      metric: 'Flaky Test Rate',
      before: beforeAI.flakyRate,
      after: afterAI.flakyRate,
      improvement: ((beforeAI.flakyRate - afterAI.flakyRate) / beforeAI.flakyRate) * 100,
    },
  ];
}

// Example 4: Cost analysis
interface CostAnalysis {
  period: string;
  laborCost: number;
  aiToolCost: number;
  apiCosts: number;
  trainingCost: number;
  totalCost: number;
  valueGenerated: number;
  roi: number;
}

function calculateROI(
  laborSaved: number, // hours
  hourlyRate: number,
  aiCosts: { tools: number; api: number; training: number }
): CostAnalysis {
  const laborCost = laborSaved * hourlyRate;
  const totalAICost = aiCosts.tools + aiCosts.api + aiCosts.training;
  const netValue = laborCost - totalAICost;
  const roi = totalAICost > 0 ? (netValue / totalAICost) * 100 : 0;

  return {
    period: 'Monthly',
    laborCost,
    aiToolCost: aiCosts.tools,
    apiCosts: aiCosts.api,
    trainingCost: aiCosts.training,
    totalCost: totalAICost,
    valueGenerated: laborCost,
    roi,
  };
}

// Example 5: ROI dashboard
function generateROIDashboard(): string {
  const timeSavings = calculateTimeSavings(timeTrackingData);
  const costAnalysis = calculateROI(80, 75, { tools: 100, api: 200, training: 500 });

  return `
# AI Testing ROI Dashboard

## Time Savings
- Total time saved: ${timeSavings.totalSaved} minutes/month
- Efficiency improvement: ${timeSavings.percentageSaved.toFixed(1)}%

## Cost Analysis
- Labor cost saved: $${costAnalysis.laborCost}
- AI costs: $${costAnalysis.totalCost}
- Net savings: $${costAnalysis.valueGenerated - costAnalysis.totalCost}
- ROI: ${costAnalysis.roi.toFixed(1)}%

## Productivity
- Tests created per day: 5 → 15 (3x improvement)
- Bug detection rate: +25%
- Test maintenance time: -40%
  `.trim();
}

// Example 6: Tracking template
const roiTrackingTemplate = {
  weekly: {
    testsGenerated: 0,
    testsReviewed: 0,
    hoursSpentWithAI: 0,
    hoursWithoutAI: 0,
    aiApiCalls: 0,
    apiCost: 0,
  },
  record(data: Partial<typeof roiTrackingTemplate.weekly>): void {
    Object.assign(this.weekly, data);
  },
};

/**
 * EXERCISE:
 * 1. Track time with and without AI
 * 2. Measure quality improvements
 * 3. Calculate costs
 * 4. Report ROI to stakeholders
 *
 * CODING QUESTION:
 * Calculate break-even point for AI investment.
 *
 * SOLUTION:
 */
function calculateBreakEven(
  monthlySavings: number,
  initialInvestment: number,
  monthlyAICost: number
): number {
  const netMonthlySavings = monthlySavings - monthlyAICost;
  if (netMonthlySavings <= 0) return -1; // Never breaks even
  return Math.ceil(initialInvestment / netMonthlySavings);
}

/**
 * LEARNING:
 * - Measure to manage
 * - Time savings are tangible
 * - Quality improvements justify costs
 * - ROI proves value to stakeholders
 *
 * ONE LINER:
 * "Measure AI ROI to prove value - data convinces where opinions fail."
 */

export { calculateTimeSavings, compareQuality, calculateROI, generateROIDashboard };

