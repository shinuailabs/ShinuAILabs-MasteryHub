/**
 * Lab 618: Report Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for reporting:
 *
 * - Report organization
 * - Information hierarchy
 * - Actionable insights
 * - Maintenance
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Organize reports
 * 3. Extract insights
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import * as fs from 'fs';
import * as path from 'path';

/*
 * Best Practice 1: Organize Reports by Run
 *
 * reports/
 * ├── 2024-01-15_10-30-00/
 * │   ├── cucumber-report.json
 * │   ├── cucumber-report.html
 * │   ├── screenshots/
 * │   ├── videos/
 * │   └── traces/
 * └── latest -> 2024-01-15_10-30-00/
 */

// Solution 1: Report Directory Manager
class ReportDirectoryManager {
    private baseDir: string;

    constructor(baseDir: string = 'reports') {
        this.baseDir = baseDir;
    }

    createRunDirectory(): string {
        const timestamp = new Date().toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_')
            .slice(0, 19);

        const runDir = path.join(this.baseDir, timestamp);

        // Create subdirectories
        const subdirs = ['screenshots', 'videos', 'traces'];
        for (const subdir of subdirs) {
            fs.mkdirSync(path.join(runDir, subdir), { recursive: true });
        }

        // Update 'latest' symlink
        const latestLink = path.join(this.baseDir, 'latest');
        if (fs.existsSync(latestLink)) {
            fs.unlinkSync(latestLink);
        }
        fs.symlinkSync(runDir, latestLink);

        return runDir;
    }

    cleanup(maxRuns: number = 10): void {
        const dirs = fs.readdirSync(this.baseDir)
            .filter(d => d !== 'latest' && fs.statSync(path.join(this.baseDir, d)).isDirectory())
            .sort()
            .reverse();

        // Remove old runs
        for (const dir of dirs.slice(maxRuns)) {
            fs.rmSync(path.join(this.baseDir, dir), { recursive: true });
            console.log(`Removed old report: ${dir}`);
        }
    }
}

/*
 * Best Practice 2: Include Essential Information
 *
 * - Test environment
 * - Browser/device info
 * - Timestamps
 * - Git commit info
 * - Error details with context
 */

// Solution 2: Report Metadata
interface ReportMetadata {
    timestamp: string;
    environment: string;
    browser: string;
    platform: string;
    nodeVersion: string;
    gitCommit?: string;
    gitBranch?: string;
    ciJobId?: string;
    ciJobUrl?: string;
}

function collectMetadata(): ReportMetadata {
    return {
        timestamp: new Date().toISOString(),
        environment: process.env.TEST_ENV || 'local',
        browser: process.env.BROWSER || 'chromium',
        platform: process.platform,
        nodeVersion: process.version,
        gitCommit: process.env.GIT_COMMIT || process.env.GITHUB_SHA,
        gitBranch: process.env.GIT_BRANCH || process.env.GITHUB_REF,
        ciJobId: process.env.CI_JOB_ID || process.env.GITHUB_RUN_ID,
        ciJobUrl: process.env.CI_JOB_URL || process.env.GITHUB_SERVER_URL,
    };
}

/*
 * Best Practice 3: Provide Actionable Failure Information
 */

// Solution 3: Failure Analysis
interface FailureAnalysis {
    scenario: string;
    feature: string;
    step: string;
    errorType: string;
    errorMessage: string;
    possibleCause: string;
    suggestedAction: string;
    screenshot?: string;
    trace?: string;
}

function analyzeFailure(error: Error, context: any): FailureAnalysis {
    const errorMessage = error.message;
    let errorType = 'Unknown';
    let possibleCause = 'Unknown cause';
    let suggestedAction = 'Investigate the error';

    // Categorize error
    if (errorMessage.includes('TimeoutError') || errorMessage.includes('timeout')) {
        errorType = 'Timeout';
        possibleCause = 'Element not found or page load too slow';
        suggestedAction = 'Check if element exists, increase timeout, or verify page load';
    } else if (errorMessage.includes('AssertionError')) {
        errorType = 'Assertion';
        possibleCause = 'Expected value does not match actual value';
        suggestedAction = 'Verify test data and expected outcomes';
    } else if (errorMessage.includes('ECONNREFUSED')) {
        errorType = 'Connection';
        possibleCause = 'Server not running or network issue';
        suggestedAction = 'Verify server is running and accessible';
    }

    return {
        scenario: context.scenarioName || 'Unknown',
        feature: context.featureName || 'Unknown',
        step: context.stepName || 'Unknown',
        errorType,
        errorMessage,
        possibleCause,
        suggestedAction,
        screenshot: context.screenshotPath,
        trace: context.tracePath,
    };
}

/*
 * Best Practice 4: Generate Summary Dashboard
 */

// Solution 4: Dashboard Data
interface DashboardData {
    summary: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        passRate: number;
        duration: number;
    };
    trends: {
        date: string;
        passRate: number;
    }[];
    topFailures: {
        scenario: string;
        failureCount: number;
        lastFailure: string;
    }[];
    slowestTests: {
        scenario: string;
        duration: number;
    }[];
}

function generateDashboardData(currentRun: any, history: any[]): DashboardData {
    // Calculate trends from history
    const trends = history.slice(-10).map(run => ({
        date: run.date,
        passRate: run.passRate,
    }));

    return {
        summary: currentRun.summary,
        trends,
        topFailures: [], // Aggregate from history
        slowestTests: currentRun.slowestTests || [],
    };
}

/*
 * Best Practice 5: Report Retention Policy
 */

// Solution 5: Retention Policy
interface RetentionPolicy {
    maxReports: number;
    maxAgeDays: number;
    keepFailedReports: boolean;
}

function applyRetentionPolicy(
    reportsDir: string,
    policy: RetentionPolicy
): void {
    const reports = fs.readdirSync(reportsDir)
        .filter(d => d !== 'latest')
        .map(d => ({
            name: d,
            path: path.join(reportsDir, d),
            stats: fs.statSync(path.join(reportsDir, d)),
        }))
        .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs);

    const now = Date.now();
    const maxAge = policy.maxAgeDays * 24 * 60 * 60 * 1000;

    let kept = 0;
    for (const report of reports) {
        const age = now - report.stats.mtimeMs;
        const shouldKeep = kept < policy.maxReports && age < maxAge;

        if (!shouldKeep) {
            fs.rmSync(report.path, { recursive: true });
            console.log(`Removed report: ${report.name}`);
        } else {
            kept++;
        }
    }
}

// Solution 6: Export
export {
    ReportDirectoryManager,
    collectMetadata,
    analyzeFailure,
    generateDashboardData,
    applyRetentionPolicy,
    ReportMetadata,
    FailureAnalysis,
    DashboardData,
    RetentionPolicy,
};
