/**
 * Lab 616: Custom Report Formatter
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating custom formatters:
 * 
 * - Formatter interface
 * - Event handling
 * - Custom output
 * - Integration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom formatter
 * 2. Handle events
 * 3. Generate output
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Formatter, IFormatterOptions, Status } from '@cucumber/cucumber';
import * as fs from 'fs';

// Solution 1: Basic Custom Formatter
class CustomFormatter extends Formatter {
    private results: any[] = [];
    private currentFeature: any = null;
    private currentScenario: any = null;
    
    constructor(options: IFormatterOptions) {
        super(options);
        
        // Subscribe to events
        options.eventBroadcaster.on('envelope', (envelope: any) => {
            if (envelope.testRunStarted) {
                this.onTestRunStarted();
            }
            if (envelope.testCaseStarted) {
                this.onTestCaseStarted(envelope.testCaseStarted);
            }
            if (envelope.testStepFinished) {
                this.onTestStepFinished(envelope.testStepFinished);
            }
            if (envelope.testCaseFinished) {
                this.onTestCaseFinished(envelope.testCaseFinished);
            }
            if (envelope.testRunFinished) {
                this.onTestRunFinished();
            }
        });
    }
    
    private onTestRunStarted(): void {
        this.log('Test run started\n');
        this.results = [];
    }
    
    private onTestCaseStarted(event: any): void {
        this.currentScenario = {
            id: event.id,
            steps: [],
            startTime: Date.now(),
        };
    }
    
    private onTestStepFinished(event: any): void {
        if (this.currentScenario) {
            this.currentScenario.steps.push({
                status: event.testStepResult.status,
                duration: event.testStepResult.duration,
            });
        }
    }
    
    private onTestCaseFinished(event: any): void {
        if (this.currentScenario) {
            this.currentScenario.endTime = Date.now();
            this.currentScenario.duration = 
                this.currentScenario.endTime - this.currentScenario.startTime;
            this.results.push(this.currentScenario);
        }
    }
    
    private onTestRunFinished(): void {
        this.generateReport();
    }
    
    private generateReport(): void {
        const passed = this.results.filter(r => 
            r.steps.every((s: any) => s.status === Status.PASSED)
        ).length;
        const failed = this.results.length - passed;
        
        this.log('\n========== CUSTOM REPORT ==========\n');
        this.log(`Total Scenarios: ${this.results.length}\n`);
        this.log(`Passed: ${passed}\n`);
        this.log(`Failed: ${failed}\n`);
        this.log(`Pass Rate: ${((passed / this.results.length) * 100).toFixed(1)}%\n`);
    }
}

// Solution 2: JSON Summary Formatter
class JsonSummaryFormatter extends Formatter {
    private summary: any = {
        startTime: null,
        endTime: null,
        features: [],
        scenarios: { total: 0, passed: 0, failed: 0, skipped: 0 },
        steps: { total: 0, passed: 0, failed: 0, skipped: 0 },
    };
    
    constructor(options: IFormatterOptions) {
        super(options);
        
        options.eventBroadcaster.on('envelope', (envelope: any) => {
            this.handleEnvelope(envelope);
        });
    }
    
    private handleEnvelope(envelope: any): void {
        if (envelope.testRunStarted) {
            this.summary.startTime = new Date().toISOString();
        }
        
        if (envelope.testStepFinished) {
            this.summary.steps.total++;
            const status = envelope.testStepFinished.testStepResult.status;
            
            if (status === Status.PASSED) this.summary.steps.passed++;
            else if (status === Status.FAILED) this.summary.steps.failed++;
            else if (status === Status.SKIPPED) this.summary.steps.skipped++;
        }
        
        if (envelope.testCaseFinished) {
            this.summary.scenarios.total++;
            // Determine scenario status based on steps
        }
        
        if (envelope.testRunFinished) {
            this.summary.endTime = new Date().toISOString();
            this.writeReport();
        }
    }
    
    private writeReport(): void {
        const output = JSON.stringify(this.summary, null, 2);
        fs.writeFileSync('reports/summary.json', output);
        this.log('Summary report written to reports/summary.json\n');
    }
}

// Solution 3: Slack Notification Formatter
class SlackFormatter extends Formatter {
    private results: { passed: number; failed: number; total: number } = {
        passed: 0,
        failed: 0,
        total: 0,
    };
    
    constructor(options: IFormatterOptions) {
        super(options);
        
        options.eventBroadcaster.on('envelope', (envelope: any) => {
            if (envelope.testCaseFinished) {
                this.results.total++;
                // Track pass/fail
            }
            
            if (envelope.testRunFinished) {
                this.sendSlackNotification();
            }
        });
    }
    
    private async sendSlackNotification(): Promise<void> {
        const webhookUrl = process.env.SLACK_WEBHOOK_URL;
        if (!webhookUrl) {
            this.log('SLACK_WEBHOOK_URL not set, skipping notification\n');
            return;
        }
        
        const message = {
            text: `Test Run Complete`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*Test Results*\n` +
                              `Total: ${this.results.total}\n` +
                              `Passed: ${this.results.passed}\n` +
                              `Failed: ${this.results.failed}`,
                    },
                },
            ],
        };
        
        // In real implementation, send to Slack
        this.log(`Would send to Slack: ${JSON.stringify(message)}\n`);
    }
}

// Solution 4: Console Progress Formatter
class ProgressFormatter extends Formatter {
    private scenarioCount = 0;
    private passedCount = 0;
    private failedCount = 0;
    
    constructor(options: IFormatterOptions) {
        super(options);
        
        options.eventBroadcaster.on('envelope', (envelope: any) => {
            if (envelope.testCaseFinished) {
                this.scenarioCount++;
                this.updateProgress();
            }
            
            if (envelope.testRunFinished) {
                this.log('\n');
            }
        });
    }
    
    private updateProgress(): void {
        const progress = `Scenarios: ${this.scenarioCount} | ` +
                        `Passed: ${this.passedCount} | ` +
                        `Failed: ${this.failedCount}`;
        
        // Clear line and write progress
        process.stdout.write(`\r${progress}`);
    }
}

// Solution 5: Export formatters
export { 
    CustomFormatter, 
    JsonSummaryFormatter, 
    SlackFormatter, 
    ProgressFormatter 
};

