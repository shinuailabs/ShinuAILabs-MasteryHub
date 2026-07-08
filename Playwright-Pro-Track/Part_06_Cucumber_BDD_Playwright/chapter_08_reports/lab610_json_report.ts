/**
 * Lab 610: JSON Report Generation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Generating JSON reports:
 * 
 * - Cucumber JSON format
 * - Custom JSON reports
 * - Report structure
 * - Data extraction
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Generate JSON reports
 * 2. Parse report data
 * 3. Extract metrics
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Cucumber Configuration for JSON Report
// cucumber.js
const cucumberConfig = {
    default: {
        format: [
            'progress',
            'json:reports/cucumber-report.json',
        ],
        formatOptions: {
            snippetInterface: 'async-await',
        },
    },
};

// Solution 2: JSON Report Structure
interface CucumberJsonReport {
    id: string;
    name: string;
    description: string;
    keyword: string;
    uri: string;
    tags: Array<{ name: string }>;
    elements: ScenarioElement[];
}

interface ScenarioElement {
    id: string;
    name: string;
    keyword: string;
    type: 'scenario' | 'background';
    tags: Array<{ name: string }>;
    steps: StepResult[];
}

interface StepResult {
    keyword: string;
    name: string;
    result: {
        status: 'passed' | 'failed' | 'skipped' | 'pending';
        duration: number;
        error_message?: string;
    };
    embeddings?: Array<{
        mime_type: string;
        data: string;
    }>;
}

// Solution 3: Parse JSON Report
import * as fs from 'fs';
import * as path from 'path';

function parseJsonReport(reportPath: string): CucumberJsonReport[] {
    const content = fs.readFileSync(reportPath, 'utf-8');
    return JSON.parse(content);
}

// Solution 4: Extract Summary Statistics
interface ReportSummary {
    totalFeatures: number;
    totalScenarios: number;
    totalSteps: number;
    passed: number;
    failed: number;
    skipped: number;
    pending: number;
    duration: number;
    passRate: number;
}

function extractSummary(report: CucumberJsonReport[]): ReportSummary {
    let totalScenarios = 0;
    let totalSteps = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let pending = 0;
    let duration = 0;
    
    for (const feature of report) {
        for (const element of feature.elements) {
            if (element.type === 'scenario') {
                totalScenarios++;
                
                let scenarioPassed = true;
                for (const step of element.steps) {
                    totalSteps++;
                    duration += step.result.duration || 0;
                    
                    switch (step.result.status) {
                        case 'passed':
                            passed++;
                            break;
                        case 'failed':
                            failed++;
                            scenarioPassed = false;
                            break;
                        case 'skipped':
                            skipped++;
                            break;
                        case 'pending':
                            pending++;
                            break;
                    }
                }
            }
        }
    }
    
    return {
        totalFeatures: report.length,
        totalScenarios,
        totalSteps,
        passed,
        failed,
        skipped,
        pending,
        duration: duration / 1_000_000_000, // Convert to seconds
        passRate: totalSteps > 0 ? (passed / totalSteps) * 100 : 0,
    };
}

// Solution 5: Extract Failed Scenarios
interface FailedScenario {
    feature: string;
    scenario: string;
    failedStep: string;
    errorMessage: string;
}

function extractFailures(report: CucumberJsonReport[]): FailedScenario[] {
    const failures: FailedScenario[] = [];
    
    for (const feature of report) {
        for (const element of feature.elements) {
            if (element.type === 'scenario') {
                for (const step of element.steps) {
                    if (step.result.status === 'failed') {
                        failures.push({
                            feature: feature.name,
                            scenario: element.name,
                            failedStep: `${step.keyword}${step.name}`,
                            errorMessage: step.result.error_message || 'Unknown error',
                        });
                        break; // Only first failure per scenario
                    }
                }
            }
        }
    }
    
    return failures;
}

// Solution 6: Generate Custom JSON Report
interface CustomReport {
    timestamp: string;
    environment: string;
    summary: ReportSummary;
    failures: FailedScenario[];
    features: Array<{
        name: string;
        scenarios: number;
        passed: number;
        failed: number;
    }>;
}

function generateCustomReport(reportPath: string): CustomReport {
    const report = parseJsonReport(reportPath);
    const summary = extractSummary(report);
    const failures = extractFailures(report);
    
    const features = report.map(feature => {
        let passed = 0;
        let failed = 0;
        
        for (const element of feature.elements) {
            if (element.type === 'scenario') {
                const hasFailed = element.steps.some(s => s.result.status === 'failed');
                if (hasFailed) {
                    failed++;
                } else {
                    passed++;
                }
            }
        }
        
        return {
            name: feature.name,
            scenarios: passed + failed,
            passed,
            failed,
        };
    });
    
    return {
        timestamp: new Date().toISOString(),
        environment: process.env.TEST_ENV || 'local',
        summary,
        failures,
        features,
    };
}

// Solution 7: Save Custom Report
function saveCustomReport(report: CustomReport, outputPath: string): void {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`Custom report saved to: ${outputPath}`);
}

// Solution 8: Export
export {
    cucumberConfig,
    parseJsonReport,
    extractSummary,
    extractFailures,
    generateCustomReport,
    saveCustomReport,
    CucumberJsonReport,
    ReportSummary,
    FailedScenario,
    CustomReport,
};

