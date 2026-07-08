/**
 * Lab 612: Allure Report Integration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Integrating Allure reports:
 * 
 * - Allure setup
 * - Allure annotations
 * - Attachments
 * - History trends
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Set up Allure
 * 2. Add annotations
 * 3. Attach screenshots
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, AfterStep } from '@cucumber/cucumber';
import { Status } from '@cucumber/cucumber';

// Solution 1: Allure Configuration
// cucumber.js
const cucumberConfig = {
    default: {
        format: [
            'progress',
            './node_modules/allure-cucumberjs/reporter.js',
        ],
        formatOptions: {
            resultsDir: 'allure-results',
        },
    },
};

// Solution 2: Allure World Extension
// Note: This is a conceptual implementation
// Real implementation requires @cucumber/cucumber and allure-cucumberjs

interface AllureInterface {
    label(name: string, value: string): void;
    link(url: string, name?: string, type?: string): void;
    description(markdown: string): void;
    attachment(name: string, content: Buffer | string, type: string): void;
    step(name: string, fn: () => Promise<void>): Promise<void>;
    epic(name: string): void;
    feature(name: string): void;
    story(name: string): void;
    severity(level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): void;
}

// Solution 3: Before Hook with Allure Labels
Before(async function (scenario) {
    const allure = this.allure as AllureInterface | undefined;
    
    if (allure) {
        // Add labels from tags
        const tags = scenario.pickle.tags.map(t => t.name);
        
        for (const tag of tags) {
            if (tag.startsWith('@epic:')) {
                allure.epic(tag.replace('@epic:', ''));
            } else if (tag.startsWith('@feature:')) {
                allure.feature(tag.replace('@feature:', ''));
            } else if (tag.startsWith('@story:')) {
                allure.story(tag.replace('@story:', ''));
            } else if (tag.startsWith('@severity:')) {
                const severity = tag.replace('@severity:', '') as any;
                allure.severity(severity);
            }
        }
        
        // Add environment info
        allure.label('environment', process.env.TEST_ENV || 'local');
        allure.label('browser', process.env.BROWSER || 'chromium');
    }
});

// Solution 4: After Step Hook for Screenshots
AfterStep(async function (step) {
    const allure = this.allure as AllureInterface | undefined;
    
    if (this.page && allure) {
        // Attach screenshot on failure
        if (step.result?.status === Status.FAILED) {
            const screenshot = await this.page.screenshot({ fullPage: true });
            allure.attachment('Screenshot on Failure', screenshot, 'image/png');
        }
    }
});

// Solution 5: After Hook for Final Attachments
After(async function (scenario) {
    const allure = this.allure as AllureInterface | undefined;
    
    if (allure) {
        // Attach page source on failure
        if (scenario.result?.status === Status.FAILED && this.page) {
            const html = await this.page.content();
            allure.attachment('Page Source', html, 'text/html');
            
            // Attach console logs
            if (this.consoleLogs?.length) {
                allure.attachment(
                    'Console Logs',
                    this.consoleLogs.join('\n'),
                    'text/plain'
                );
            }
        }
        
        // Add links
        if (scenario.pickle.tags.some(t => t.name.startsWith('@jira:'))) {
            const jiraTag = scenario.pickle.tags.find(t => t.name.startsWith('@jira:'));
            if (jiraTag) {
                const ticketId = jiraTag.name.replace('@jira:', '');
                allure.link(
                    `https://jira.example.com/browse/${ticketId}`,
                    ticketId,
                    'issue'
                );
            }
        }
    }
});

// Solution 6: Custom Allure Steps
async function allureStep(
    allure: AllureInterface | undefined,
    name: string,
    fn: () => Promise<void>
): Promise<void> {
    if (allure) {
        await allure.step(name, fn);
    } else {
        await fn();
    }
}

// Solution 7: Allure Environment Properties
// allure-results/environment.properties
const environmentProperties = `
Browser=${process.env.BROWSER || 'chromium'}
Environment=${process.env.TEST_ENV || 'local'}
Platform=${process.platform}
Node.Version=${process.version}
`;

// Solution 8: Allure Categories Configuration
// allure-results/categories.json
const categoriesConfig = [
    {
        name: 'Product Defects',
        matchedStatuses: ['failed'],
        messageRegex: '.*AssertionError.*',
    },
    {
        name: 'Test Defects',
        matchedStatuses: ['failed'],
        messageRegex: '.*TimeoutError.*',
    },
    {
        name: 'Infrastructure Issues',
        matchedStatuses: ['failed'],
        messageRegex: '.*(ECONNREFUSED|ETIMEDOUT).*',
    },
    {
        name: 'Skipped Tests',
        matchedStatuses: ['skipped'],
    },
];

// Solution 9: Generate Allure Report Command
// npx allure generate allure-results --clean -o allure-report
// npx allure open allure-report

// Solution 10: Export
export {
    cucumberConfig,
    allureStep,
    environmentProperties,
    categoriesConfig,
    AllureInterface,
};

