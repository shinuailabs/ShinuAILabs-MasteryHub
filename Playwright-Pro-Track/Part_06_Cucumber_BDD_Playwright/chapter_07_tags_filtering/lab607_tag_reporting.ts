/**
 * Lab 607: Tag-Based Reporting
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Generating reports by tags:
 * 
 * - Tag statistics
 * - Coverage by tag
 * - Failure analysis
 * - Trend tracking
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Generate tag reports
 * 2. Analyze coverage
 * 3. Track trends
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { After, AfterAll, Status } from '@cucumber/cucumber';

// Solution 1: Tag Statistics Collector
interface TagStats {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
}

const tagStatistics: Map<string, TagStats> = new Map();

function initTagStats(): TagStats {
    return { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };
}

After(async function (scenario) {
    const tags = scenario.pickle.tags.map(t => t.name);
    const status = scenario.result?.status;
    const duration = scenario.result?.duration?.nanos || 0;
    
    for (const tag of tags) {
        if (!tagStatistics.has(tag)) {
            tagStatistics.set(tag, initTagStats());
        }
        
        const stats = tagStatistics.get(tag)!;
        stats.total++;
        stats.duration += duration / 1_000_000; // Convert to ms
        
        switch (status) {
            case Status.PASSED:
                stats.passed++;
                break;
            case Status.FAILED:
                stats.failed++;
                break;
            case Status.SKIPPED:
                stats.skipped++;
                break;
        }
    }
});

// Solution 2: Generate Tag Report
AfterAll(async function () {
    console.log('\n========== TAG STATISTICS REPORT ==========\n');
    
    const sortedTags = Array.from(tagStatistics.entries())
        .sort((a, b) => b[1].total - a[1].total);
    
    for (const [tag, stats] of sortedTags) {
        const passRate = stats.total > 0 
            ? ((stats.passed / stats.total) * 100).toFixed(1) 
            : '0.0';
        const avgDuration = stats.total > 0 
            ? (stats.duration / stats.total).toFixed(0) 
            : '0';
        
        console.log(`${tag}:`);
        console.log(`  Total: ${stats.total} | Passed: ${stats.passed} | Failed: ${stats.failed} | Skipped: ${stats.skipped}`);
        console.log(`  Pass Rate: ${passRate}% | Avg Duration: ${avgDuration}ms`);
        console.log('');
    }
});

// Solution 3: Tag Coverage Report
interface TagCoverage {
    tag: string;
    scenarios: string[];
    features: Set<string>;
}

const tagCoverage: Map<string, TagCoverage> = new Map();

After(async function (scenario) {
    const tags = scenario.pickle.tags.map(t => t.name);
    const scenarioName = scenario.pickle.name;
    const featureName = scenario.gherkinDocument.feature?.name || 'Unknown';
    
    for (const tag of tags) {
        if (!tagCoverage.has(tag)) {
            tagCoverage.set(tag, {
                tag,
                scenarios: [],
                features: new Set(),
            });
        }
        
        const coverage = tagCoverage.get(tag)!;
        coverage.scenarios.push(scenarioName);
        coverage.features.add(featureName);
    }
});

// Solution 4: Failure Analysis by Tag
interface FailureInfo {
    scenario: string;
    feature: string;
    error: string;
    tags: string[];
}

const failuresByTag: Map<string, FailureInfo[]> = new Map();

After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED) {
        const tags = scenario.pickle.tags.map(t => t.name);
        const failureInfo: FailureInfo = {
            scenario: scenario.pickle.name,
            feature: scenario.gherkinDocument.feature?.name || 'Unknown',
            error: scenario.result.message || 'Unknown error',
            tags,
        };
        
        for (const tag of tags) {
            if (!failuresByTag.has(tag)) {
                failuresByTag.set(tag, []);
            }
            failuresByTag.get(tag)!.push(failureInfo);
        }
    }
});

// Solution 5: Generate JSON Report
function generateJsonReport(): object {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTags: tagStatistics.size,
            totalScenarios: Array.from(tagStatistics.values())
                .reduce((sum, s) => sum + s.total, 0) / tagStatistics.size,
        },
        tagStats: Object.fromEntries(tagStatistics),
        coverage: Object.fromEntries(
            Array.from(tagCoverage.entries()).map(([tag, cov]) => [
                tag,
                {
                    scenarioCount: cov.scenarios.length,
                    featureCount: cov.features.size,
                    features: Array.from(cov.features),
                },
            ])
        ),
        failures: Object.fromEntries(failuresByTag),
    };
    
    return report;
}

// Solution 6: Priority Tag Analysis
function analyzePriorityTags(): void {
    const priorityTags = ['@p1', '@p2', '@p3', '@p4', '@critical', '@high', '@medium', '@low'];
    
    console.log('\n========== PRIORITY TAG ANALYSIS ==========\n');
    
    for (const tag of priorityTags) {
        const stats = tagStatistics.get(tag);
        if (stats) {
            const passRate = ((stats.passed / stats.total) * 100).toFixed(1);
            console.log(`${tag}: ${stats.total} tests, ${passRate}% pass rate`);
            
            if (stats.failed > 0) {
                console.log(`  ⚠️  ${stats.failed} failures need attention!`);
            }
        }
    }
}

// Solution 7: Test Type Distribution
function analyzeTestTypeDistribution(): void {
    const typesTags = ['@smoke', '@regression', '@e2e', '@integration', '@unit'];
    
    console.log('\n========== TEST TYPE DISTRIBUTION ==========\n');
    
    let totalTests = 0;
    const distribution: Record<string, number> = {};
    
    for (const tag of typesTags) {
        const stats = tagStatistics.get(tag);
        if (stats) {
            distribution[tag] = stats.total;
            totalTests += stats.total;
        }
    }
    
    for (const [tag, count] of Object.entries(distribution)) {
        const percentage = ((count / totalTests) * 100).toFixed(1);
        console.log(`${tag}: ${count} (${percentage}%)`);
    }
}

// Solution 8: Export
export { 
    tagStatistics, 
    tagCoverage, 
    failuresByTag, 
    generateJsonReport,
    analyzePriorityTags,
    analyzeTestTypeDistribution,
};

