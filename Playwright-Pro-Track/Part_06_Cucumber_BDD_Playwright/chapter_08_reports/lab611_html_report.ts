/**
 * Lab 611: HTML Report Generation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Generating HTML reports:
 * 
 * - Built-in HTML formatter
 * - cucumber-html-reporter
 * - Custom HTML templates
 * - Styling reports
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Generate HTML reports
 * 2. Customize appearance
 * 3. Add screenshots
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import * as fs from 'fs';
import * as path from 'path';

// Solution 1: Cucumber Configuration for HTML Report
const cucumberConfig = {
    default: {
        format: [
            'progress',
            'html:reports/cucumber-report.html',
            'json:reports/cucumber-report.json',
        ],
    },
};

// Solution 2: Using cucumber-html-reporter
// npm install cucumber-html-reporter
interface HtmlReporterOptions {
    theme: 'bootstrap' | 'hierarchy' | 'foundation' | 'simple';
    jsonFile: string;
    output: string;
    reportSuiteAsScenarios: boolean;
    scenarioTimestamp: boolean;
    launchReport: boolean;
    metadata: {
        'App Version': string;
        'Test Environment': string;
        Browser: string;
        Platform: string;
    };
}

function generateHtmlReport(): void {
    // This would use cucumber-html-reporter package
    const options: HtmlReporterOptions = {
        theme: 'bootstrap',
        jsonFile: 'reports/cucumber-report.json',
        output: 'reports/cucumber-html-report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: false,
        metadata: {
            'App Version': '1.0.0',
            'Test Environment': process.env.TEST_ENV || 'local',
            Browser: process.env.BROWSER || 'chromium',
            Platform: process.platform,
        },
    };
    
    // reporter.generate(options);
    console.log('HTML report generated:', options.output);
}

// Solution 3: Custom HTML Report Generator
interface ReportData {
    title: string;
    timestamp: string;
    summary: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        passRate: string;
    };
    features: Array<{
        name: string;
        status: 'passed' | 'failed';
        scenarios: Array<{
            name: string;
            status: 'passed' | 'failed' | 'skipped';
            steps: Array<{
                keyword: string;
                name: string;
                status: string;
                duration: string;
                error?: string;
                screenshot?: string;
            }>;
        }>;
    }>;
}

function generateCustomHtmlReport(data: ReportData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary h2 { margin-top: 0; }
        .stats { display: flex; gap: 20px; }
        .stat { text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .feature { border: 1px solid #ddd; margin-bottom: 15px; border-radius: 8px; }
        .feature-header { padding: 15px; background: #f8f9fa; cursor: pointer; }
        .feature-header.passed { border-left: 4px solid #28a745; }
        .feature-header.failed { border-left: 4px solid #dc3545; }
        .scenario { padding: 10px 15px; border-top: 1px solid #eee; }
        .step { padding: 5px 15px 5px 30px; font-family: monospace; }
        .step.passed::before { content: "✓ "; color: #28a745; }
        .step.failed::before { content: "✗ "; color: #dc3545; }
        .step.skipped::before { content: "○ "; color: #ffc107; }
        .error { background: #fff3f3; padding: 10px; margin: 5px 0; border-radius: 4px; color: #dc3545; }
        .screenshot { max-width: 100%; margin: 10px 0; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>${data.title}</h1>
    <p>Generated: ${data.timestamp}</p>
    
    <div class="summary">
        <h2>Summary</h2>
        <div class="stats">
            <div class="stat">
                <div class="stat-value">${data.summary.total}</div>
                <div>Total</div>
            </div>
            <div class="stat">
                <div class="stat-value passed">${data.summary.passed}</div>
                <div>Passed</div>
            </div>
            <div class="stat">
                <div class="stat-value failed">${data.summary.failed}</div>
                <div>Failed</div>
            </div>
            <div class="stat">
                <div class="stat-value skipped">${data.summary.skipped}</div>
                <div>Skipped</div>
            </div>
            <div class="stat">
                <div class="stat-value">${data.summary.passRate}</div>
                <div>Pass Rate</div>
            </div>
        </div>
    </div>
    
    <h2>Features</h2>
    ${data.features.map(feature => `
        <div class="feature">
            <div class="feature-header ${feature.status}">
                <strong>${feature.name}</strong>
            </div>
            ${feature.scenarios.map(scenario => `
                <div class="scenario">
                    <strong class="${scenario.status}">${scenario.name}</strong>
                    ${scenario.steps.map(step => `
                        <div class="step ${step.status}">
                            ${step.keyword}${step.name}
                            <span style="color: #666; font-size: 12px;">(${step.duration})</span>
                            ${step.error ? `<div class="error">${step.error}</div>` : ''}
                            ${step.screenshot ? `<img class="screenshot" src="${step.screenshot}" alt="Screenshot">` : ''}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `).join('')}
</body>
</html>
    `;
}

// Solution 4: Save HTML Report
function saveHtmlReport(html: string, outputPath: string): void {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    console.log(`HTML report saved to: ${outputPath}`);
}

// Solution 5: Export
export {
    cucumberConfig,
    generateHtmlReport,
    generateCustomHtmlReport,
    saveHtmlReport,
    ReportData,
};

