/**
 * Lab 602: Tag Expressions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using tag expressions for filtering:
 * 
 * - AND expressions
 * - OR expressions
 * - NOT expressions
 * - Complex combinations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create tag expressions
 * 2. Combine expressions
 * 3. Filter scenarios
 *
 * =====================
 * SOLUTION:
 * =====================
 */

/**
 * Tag Expression Examples for Cucumber CLI
 * 
 * Run with: npx cucumber-js --tags "<expression>"
 */

// Solution 1: Simple Tag Selection
// Run all scenarios with @smoke tag
// npx cucumber-js --tags "@smoke"

// Solution 2: AND Expression (both tags required)
// Run scenarios that have BOTH @smoke AND @critical
// npx cucumber-js --tags "@smoke and @critical"

// Solution 3: OR Expression (either tag)
// Run scenarios that have @smoke OR @regression
// npx cucumber-js --tags "@smoke or @regression"

// Solution 4: NOT Expression (exclude tag)
// Run all scenarios EXCEPT those with @skip
// npx cucumber-js --tags "not @skip"

// Solution 5: Complex Combinations
// Run @smoke scenarios that are NOT @wip
// npx cucumber-js --tags "@smoke and not @wip"

// Run @critical OR @p1 scenarios, excluding @skip
// npx cucumber-js --tags "(@critical or @p1) and not @skip"

// Solution 6: Parentheses for Grouping
// Run (@smoke AND @critical) OR @e2e
// npx cucumber-js --tags "(@smoke and @critical) or @e2e"

// Solution 7: Configuration File Example
export const cucumberConfig = {
    default: {
        // Default: run smoke tests
        tags: '@smoke and not @skip',
    },
    smoke: {
        tags: '@smoke',
    },
    regression: {
        tags: '@regression and not @wip',
    },
    critical: {
        tags: '@critical or @p1',
    },
    staging: {
        tags: '@staging-only or (not @production)',
    },
    production: {
        tags: '@production and @smoke',
    },
    full: {
        tags: 'not @skip and not @wip',
    },
};

// Solution 8: Programmatic Tag Filtering
interface Scenario {
    name: string;
    tags: string[];
}

function matchesTagExpression(scenario: Scenario, expression: string): boolean {
    const tags = scenario.tags;
    
    // Simple implementation for demonstration
    // Real implementation would parse the expression properly
    
    // Handle NOT
    if (expression.startsWith('not ')) {
        const tag = expression.replace('not ', '');
        return !tags.includes(tag);
    }
    
    // Handle AND
    if (expression.includes(' and ')) {
        const parts = expression.split(' and ');
        return parts.every(part => matchesTagExpression(scenario, part.trim()));
    }
    
    // Handle OR
    if (expression.includes(' or ')) {
        const parts = expression.split(' or ');
        return parts.some(part => matchesTagExpression(scenario, part.trim()));
    }
    
    // Simple tag match
    return tags.includes(expression);
}

// Solution 9: Tag Expression Builder
class TagExpressionBuilder {
    private expression: string = '';
    
    tag(name: string): TagExpressionBuilder {
        this.expression = name.startsWith('@') ? name : `@${name}`;
        return this;
    }
    
    and(name: string): TagExpressionBuilder {
        const tag = name.startsWith('@') ? name : `@${name}`;
        this.expression = `${this.expression} and ${tag}`;
        return this;
    }
    
    or(name: string): TagExpressionBuilder {
        const tag = name.startsWith('@') ? name : `@${name}`;
        this.expression = `${this.expression} or ${tag}`;
        return this;
    }
    
    not(name: string): TagExpressionBuilder {
        const tag = name.startsWith('@') ? name : `@${name}`;
        this.expression = `${this.expression} and not ${tag}`;
        return this;
    }
    
    build(): string {
        return this.expression;
    }
}

// Usage example
const smokeNotWip = new TagExpressionBuilder()
    .tag('smoke')
    .not('wip')
    .not('skip')
    .build();
// Result: "@smoke and not @wip and not @skip"

// Solution 10: Environment-Based Tag Selection
function getTagsForEnvironment(env: string): string {
    const envTags: Record<string, string> = {
        local: 'not @ci-only',
        ci: '@smoke or @regression',
        staging: '@staging-only or (@smoke and not @production)',
        production: '@production and @smoke and @critical',
    };
    
    return envTags[env] || '@smoke';
}

// Solution 11: Export
export { 
    matchesTagExpression, 
    TagExpressionBuilder, 
    getTagsForEnvironment 
};

