/**
 * Lab 534: Error Handling
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Error handling in POM:
 * 
 * - Custom exceptions
 * - Error recovery
 * - Graceful degradation
 * - Error reporting
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom errors
 * 2. Implement recovery
 * 3. Handle gracefully
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page } from '@playwright/test';

// Solution 1: Custom Error Classes
class PageError extends Error {
    constructor(message: string, public pageName: string) {
        super(`[${pageName}] ${message}`);
        this.name = 'PageError';
    }
}

class ElementNotFoundError extends PageError {
    constructor(selector: string, pageName: string) {
        super(`Element not found: ${selector}`, pageName);
        this.name = 'ElementNotFoundError';
    }
}

class NavigationError extends PageError {
    constructor(expectedUrl: string, actualUrl: string, pageName: string) {
        super(`Expected URL: ${expectedUrl}, Actual: ${actualUrl}`, pageName);
        this.name = 'NavigationError';
    }
}

class TimeoutError extends PageError {
    constructor(operation: string, timeout: number, pageName: string) {
        super(`Operation "${operation}" timed out after ${timeout}ms`, pageName);
        this.name = 'TimeoutError';
    }
}

// Solution 2: Error Handler
class ErrorHandler {
    private errors: Error[] = [];
    
    handle(error: Error, context?: string) {
        this.errors.push(error);
        console.error(`Error${context ? ` in ${context}` : ''}: ${error.message}`);
    }
    
    getErrors(): Error[] {
        return [...this.errors];
    }
    
    hasErrors(): boolean {
        return this.errors.length > 0;
    }
    
    clear() {
        this.errors = [];
    }
    
    throwIfErrors() {
        if (this.hasErrors()) {
            throw new AggregateError(this.errors, 'Multiple errors occurred');
        }
    }
}

// Solution 3: Safe Page Operations
class SafePage {
    private errorHandler: ErrorHandler;
    
    constructor(readonly page: Page, readonly pageName: string) {
        this.errorHandler = new ErrorHandler();
    }
    
    async safeClick(selector: string): Promise<boolean> {
        try {
            await this.page.click(selector, { timeout: 5000 });
            return true;
        } catch (error) {
            this.errorHandler.handle(
                new ElementNotFoundError(selector, this.pageName)
            );
            return false;
        }
    }
    
    async safeFill(selector: string, value: string): Promise<boolean> {
        try {
            await this.page.fill(selector, value, { timeout: 5000 });
            return true;
        } catch (error) {
            this.errorHandler.handle(
                new ElementNotFoundError(selector, this.pageName)
            );
            return false;
        }
    }
    
    async safeNavigate(url: string): Promise<boolean> {
        try {
            await this.page.goto(url);
            return true;
        } catch (error) {
            this.errorHandler.handle(
                new NavigationError(url, this.page.url(), this.pageName)
            );
            return false;
        }
    }
    
    getErrors(): Error[] {
        return this.errorHandler.getErrors();
    }
}

// Solution 4: Recovery Strategies
interface RecoveryStrategy {
    canRecover(error: Error): boolean;
    recover(page: Page): Promise<void>;
}

class RefreshRecovery implements RecoveryStrategy {
    canRecover(error: Error): boolean {
        return error instanceof ElementNotFoundError;
    }
    
    async recover(page: Page): Promise<void> {
        await page.reload();
        await page.waitForLoadState('networkidle');
    }
}

class NavigateHomeRecovery implements RecoveryStrategy {
    canRecover(error: Error): boolean {
        return error instanceof NavigationError;
    }
    
    async recover(page: Page): Promise<void> {
        await page.goto('/');
    }
}

// Solution 5: Recoverable Page
class RecoverablePage {
    private strategies: RecoveryStrategy[] = [];
    
    constructor(readonly page: Page) {
        this.strategies = [
            new RefreshRecovery(),
            new NavigateHomeRecovery(),
        ];
    }
    
    async executeWithRecovery<T>(
        operation: () => Promise<T>,
        maxAttempts: number = 2
    ): Promise<T> {
        let lastError: Error | undefined;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                
                if (attempt < maxAttempts) {
                    const strategy = this.strategies.find(s => s.canRecover(lastError!));
                    if (strategy) {
                        await strategy.recover(this.page);
                    }
                }
            }
        }
        
        throw lastError;
    }
}

// Solution 6: Error Reporter
class ErrorReporter {
    private reports: { error: Error; timestamp: Date; screenshot?: string }[] = [];
    
    async report(error: Error, page: Page, takeScreenshot: boolean = true) {
        let screenshot: string | undefined;
        
        if (takeScreenshot) {
            const buffer = await page.screenshot();
            screenshot = buffer.toString('base64');
        }
        
        this.reports.push({
            error,
            timestamp: new Date(),
            screenshot,
        });
    }
    
    getReports() {
        return [...this.reports];
    }
}

// Solution 7: Export
export {
    PageError,
    ElementNotFoundError,
    NavigationError,
    TimeoutError,
    ErrorHandler,
    SafePage,
    RecoveryStrategy,
    RefreshRecovery,
    NavigateHomeRecovery,
    RecoverablePage,
    ErrorReporter,
};

