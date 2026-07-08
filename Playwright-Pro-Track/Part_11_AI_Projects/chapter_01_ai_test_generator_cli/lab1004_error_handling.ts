/**
 * Lab 1004: AI Test Generator CLI - Error Handling & Validation
 *
 * CONCEPT:
 * Robust error handling ensures the CLI provides helpful feedback
 * when things go wrong and recovers gracefully from failures.
 *
 * BULLET POINTS:
 * - Custom error classes for different failure types
 * - Retry logic for transient failures
 * - User-friendly error messages
 * - Logging and debugging support
 * - Graceful degradation strategies
 */

import chalk from 'chalk';

// Custom Error Classes
class AITestGenError extends Error {
  constructor(message: string, public code: string, public recoverable: boolean = false) {
    super(message);
    this.name = 'AITestGenError';
  }
}

class NetworkError extends AITestGenError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', true);
    this.name = 'NetworkError';
  }
}

class APIError extends AITestGenError {
  constructor(message: string, public statusCode?: number) {
    super(message, 'API_ERROR', statusCode === 429); // Rate limit is recoverable
    this.name = 'APIError';
  }
}

class ValidationError extends AITestGenError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', false);
    this.name = 'ValidationError';
  }
}

class PageAnalysisError extends AITestGenError {
  constructor(message: string) {
    super(message, 'PAGE_ANALYSIS_ERROR', true);
    this.name = 'PageAnalysisError';
  }
}

// Error Handler
class ErrorHandler {
  private verbose: boolean;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  handle(error: unknown): void {
    if (error instanceof AITestGenError) {
      this.handleKnownError(error);
    } else if (error instanceof Error) {
      this.handleUnknownError(error);
    } else {
      console.error(chalk.red('❌ An unexpected error occurred'));
    }
  }

  private handleKnownError(error: AITestGenError): void {
    console.error(chalk.red(`\n❌ ${error.name}: ${error.message}`));
    
    // Provide helpful suggestions based on error type
    const suggestions = this.getSuggestions(error);
    if (suggestions.length > 0) {
      console.log(chalk.yellow('\n💡 Suggestions:'));
      suggestions.forEach(s => console.log(chalk.yellow(`   • ${s}`)));
    }

    if (this.verbose && error.stack) {
      console.log(chalk.gray('\nStack trace:'));
      console.log(chalk.gray(error.stack));
    }
  }

  private handleUnknownError(error: Error): void {
    console.error(chalk.red(`\n❌ Unexpected Error: ${error.message}`));
    
    if (this.verbose && error.stack) {
      console.log(chalk.gray('\nStack trace:'));
      console.log(chalk.gray(error.stack));
    }
  }

  private getSuggestions(error: AITestGenError): string[] {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return [
          'Check your internet connection',
          'Verify the URL is accessible',
          'Try again in a few moments'
        ];
      case 'API_ERROR':
        if (error instanceof APIError && error.statusCode === 429) {
          return [
            'You have hit the API rate limit',
            'Wait a few minutes before trying again',
            'Consider using a different API key'
          ];
        }
        return [
          'Verify your API key is correct',
          'Check API service status',
          'Ensure you have sufficient API credits'
        ];
      case 'VALIDATION_ERROR':
        return [
          'Check the input parameters',
          'Run with --help for usage information'
        ];
      case 'PAGE_ANALYSIS_ERROR':
        return [
          'The page may require authentication',
          'Try a different URL',
          'Check if the page loads correctly in a browser'
        ];
      default:
        return [];
    }
  }
}

// Retry Logic
interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts: RetryOptions = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2,
    ...options
  };

  let lastError: Error | null = null;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is recoverable
      if (error instanceof AITestGenError && !error.recoverable) {
        throw error;
      }

      if (attempt < opts.maxRetries) {
        console.log(chalk.yellow(`⚠️ Attempt ${attempt} failed, retrying in ${delay}ms...`));
        await sleep(delay);
        delay = Math.min(delay * opts.backoffFactor, opts.maxDelay);
      }
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Input Validation
function validateUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw new ValidationError('Invalid URL format', 'url');
  }
}

function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey || apiKey.trim() === '') {
    throw new ValidationError(
      'API key is required. Set OPENAI_API_KEY environment variable.',
      'apiKey'
    );
  }
}

/**
 * EXERCISE:
 * 1. Add circuit breaker pattern for repeated failures
 * 2. Implement error reporting to external service
 * 3. Create recovery strategies for each error type
 * 4. Add error aggregation for batch operations
 */

/**
 * LEARNING:
 * - Good error handling improves user experience
 * - Retry logic handles transient failures
 * - Helpful suggestions guide users to solutions
 *
 * ONE LINER:
 * "Errors are inevitable; how you handle them defines your tool's quality."
 */

export {
  AITestGenError, NetworkError, APIError, ValidationError, PageAnalysisError,
  ErrorHandler, withRetry, validateUrl, validateApiKey
};

