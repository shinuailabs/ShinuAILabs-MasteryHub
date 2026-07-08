/**
 * Lab 1005: AI Test Generator CLI - Test Validation
 *
 * CONCEPT:
 * Before saving generated tests, we validate them to ensure they are
 * syntactically correct and follow best practices.
 *
 * BULLET POINTS:
 * - TypeScript compilation validation
 * - Playwright-specific lint rules
 * - Best practice checks
 * - Auto-fix for common issues
 * - Quality scoring
 */

import * as ts from 'typescript';
import { GeneratedTest } from './lab1000_ai_test_generation';

interface ValidationResult {
  valid: boolean;
  score: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions: string[];
}

interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  line?: number;
  fix?: string;
}

class TestValidator {
  validate(test: GeneratedTest): ValidationResult {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const suggestions: string[] = [];

    // Syntax validation
    const syntaxResult = this.validateSyntax(test.code);
    errors.push(...syntaxResult.errors);

    // Playwright best practices
    const practiceResult = this.validateBestPractices(test.code);
    warnings.push(...practiceResult.warnings);
    suggestions.push(...practiceResult.suggestions);

    // Locator quality
    const locatorResult = this.validateLocators(test.code);
    warnings.push(...locatorResult.warnings);
    suggestions.push(...locatorResult.suggestions);

    // Assertion coverage
    const assertionResult = this.validateAssertions(test.code);
    warnings.push(...assertionResult.warnings);

    // Calculate quality score
    const score = this.calculateScore(errors, warnings);

    return {
      valid: errors.length === 0,
      score,
      errors,
      warnings,
      suggestions
    };
  }

  private validateSyntax(code: string): { errors: ValidationIssue[] } {
    const errors: ValidationIssue[] = [];

    // Create a virtual TypeScript file
    const sourceFile = ts.createSourceFile(
      'test.ts',
      code,
      ts.ScriptTarget.Latest,
      true
    );

    // Check for syntax errors
    const diagnostics = (sourceFile as any).parseDiagnostics || [];
    diagnostics.forEach((d: ts.Diagnostic) => {
      errors.push({
        type: 'error',
        message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
        line: d.start ? sourceFile.getLineAndCharacterOfPosition(d.start).line + 1 : undefined
      });
    });

    // Basic structure checks
    if (!code.includes('test(') && !code.includes('test.describe(')) {
      errors.push({
        type: 'error',
        message: 'Missing test() or test.describe() block'
      });
    }

    if (!code.includes('async')) {
      errors.push({
        type: 'error',
        message: 'Test function should be async'
      });
    }

    return { errors };
  }

  private validateBestPractices(code: string): { warnings: ValidationIssue[]; suggestions: string[] } {
    const warnings: ValidationIssue[] = [];
    const suggestions: string[] = [];

    // Check for hardcoded waits
    if (code.includes('waitForTimeout') || code.includes('setTimeout')) {
      warnings.push({
        type: 'warning',
        message: 'Avoid hardcoded waits. Use explicit waits instead.',
        fix: 'Replace with waitForSelector or expect().toBeVisible()'
      });
    }

    // Check for page.pause() left in code
    if (code.includes('page.pause()')) {
      warnings.push({
        type: 'warning',
        message: 'Remove page.pause() before committing',
        fix: 'Delete the page.pause() line'
      });
    }

    // Check for proper error handling
    if (!code.includes('expect(') && !code.includes('assert')) {
      warnings.push({
        type: 'warning',
        message: 'Test has no assertions'
      });
    }

    // Suggest improvements
    if (code.includes('.click()') && !code.includes('getByRole')) {
      suggestions.push('Consider using role-based locators (getByRole) for better accessibility');
    }

    if (!code.includes('test.describe(')) {
      suggestions.push('Group related tests using test.describe()');
    }

    return { warnings, suggestions };
  }

  private validateLocators(code: string): { warnings: ValidationIssue[]; suggestions: string[] } {
    const warnings: ValidationIssue[] = [];
    const suggestions: string[] = [];

    // Check for fragile locators
    const fragilePatterns = [
      /locator\(['"]div > div > /,
      /locator\(['"]\[class\*=/,
      /nth-child\(\d+\)/,
      /locator\(['"]\.[\w-]+__[\w-]+/  // BEM-like classes that might change
    ];

    fragilePatterns.forEach(pattern => {
      if (pattern.test(code)) {
        warnings.push({
          type: 'warning',
          message: 'Fragile locator detected. Consider using more stable selectors.',
          fix: 'Use data-testid, role, or label-based locators'
        });
      }
    });

    // Suggest better locators
    if (code.includes("locator('#") || code.includes("locator('.")) {
      suggestions.push('Prefer getByRole(), getByLabel(), or getByTestId() over CSS selectors');
    }

    return { warnings, suggestions };
  }

  private validateAssertions(code: string): { warnings: ValidationIssue[] } {
    const warnings: ValidationIssue[] = [];

    // Count assertions
    const assertionCount = (code.match(/expect\(/g) || []).length;
    const actionCount = (code.match(/\.(click|fill|type|select|check)\(/g) || []).length;

    if (actionCount > 0 && assertionCount === 0) {
      warnings.push({
        type: 'warning',
        message: 'Test has actions but no assertions'
      });
    }

    if (assertionCount < actionCount / 2) {
      warnings.push({
        type: 'warning',
        message: 'Consider adding more assertions to verify actions'
      });
    }

    return { warnings };
  }

  private calculateScore(errors: ValidationIssue[], warnings: ValidationIssue[]): number {
    let score = 100;
    score -= errors.length * 20;
    score -= warnings.length * 5;
    return Math.max(0, Math.min(100, score));
  }

  // Auto-fix common issues
  autoFix(code: string): string {
    let fixed = code;

    // Remove page.pause()
    fixed = fixed.replace(/await page\.pause\(\);?\n?/g, '');

    // Fix missing await
    fixed = fixed.replace(/(?<!await\s)(page\.(click|fill|goto|type))/g, 'await $1');

    return fixed;
  }
}

/**
 * EXERCISE:
 * 1. Add ESLint integration for more comprehensive linting
 * 2. Implement custom Playwright-specific lint rules
 * 3. Create a "strict mode" with additional checks
 * 4. Add auto-fix for more issue types
 */

/**
 * LEARNING:
 * - Validation ensures generated tests are usable
 * - Quality scoring helps prioritize fixes
 * - Auto-fix saves time on common issues
 *
 * ONE LINER:
 * "Validate early, fix automatically, deliver quality."
 */

export { TestValidator, ValidationResult, ValidationIssue };

