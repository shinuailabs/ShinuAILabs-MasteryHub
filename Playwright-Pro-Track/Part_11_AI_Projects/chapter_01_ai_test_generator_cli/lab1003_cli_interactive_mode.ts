/**
 * Lab 1003: AI Test Generator CLI - Interactive Mode
 *
 * CONCEPT:
 * Interactive mode provides a guided experience for users to configure
 * test generation options through prompts and menus.
 *
 * BULLET POINTS:
 * - Inquirer.js for interactive prompts
 * - Multi-step wizard flow
 * - Configuration persistence
 * - Progress indicators and spinners
 * - User-friendly error messages
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

interface InteractiveConfig {
  url: string;
  outputDir: string;
  testTypes: string[];
  framework: string;
  language: string;
  model: string;
  includePageObjects: boolean;
  maxTests: number;
}

class InteractiveMode {
  async run(): Promise<InteractiveConfig> {
    console.log(chalk.blue.bold('\n🤖 AI Test Generator - Interactive Mode\n'));

    const config = await this.collectConfiguration();
    await this.confirmConfiguration(config);
    
    return config;
  }

  private async collectConfiguration(): Promise<InteractiveConfig> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Enter the URL to analyze:',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'input',
        name: 'outputDir',
        message: 'Output directory for generated tests:',
        default: './generated-tests'
      },
      {
        type: 'checkbox',
        name: 'testTypes',
        message: 'Select test types to generate:',
        choices: [
          { name: 'Smoke Tests', value: 'smoke', checked: true },
          { name: 'Functional Tests', value: 'functional', checked: true },
          { name: 'E2E Tests', value: 'e2e', checked: true },
          { name: 'Validation Tests', value: 'validation', checked: true },
          { name: 'Accessibility Tests', value: 'accessibility' },
          { name: 'Performance Tests', value: 'performance' }
        ]
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Select test framework:',
        choices: ['playwright', 'cypress', 'puppeteer'],
        default: 'playwright'
      },
      {
        type: 'list',
        name: 'language',
        message: 'Select language:',
        choices: ['typescript', 'javascript'],
        default: 'typescript'
      },
      {
        type: 'list',
        name: 'model',
        message: 'Select AI model:',
        choices: [
          { name: 'GPT-4 (Best quality)', value: 'gpt-4' },
          { name: 'GPT-4 Turbo (Faster)', value: 'gpt-4-turbo' },
          { name: 'GPT-3.5 Turbo (Budget)', value: 'gpt-3.5-turbo' },
          { name: 'Claude 3 Opus', value: 'claude-3-opus' }
        ],
        default: 'gpt-4'
      },
      {
        type: 'confirm',
        name: 'includePageObjects',
        message: 'Generate Page Objects?',
        default: true
      },
      {
        type: 'number',
        name: 'maxTests',
        message: 'Maximum number of tests to generate:',
        default: 10,
        validate: (input) => input > 0 && input <= 50 ? true : 'Enter a number between 1 and 50'
      }
    ]);

    return answers as InteractiveConfig;
  }

  private async confirmConfiguration(config: InteractiveConfig): Promise<void> {
    console.log(chalk.yellow('\n📋 Configuration Summary:\n'));
    console.log(`  URL:           ${chalk.cyan(config.url)}`);
    console.log(`  Output:        ${chalk.cyan(config.outputDir)}`);
    console.log(`  Test Types:    ${chalk.cyan(config.testTypes.join(', '))}`);
    console.log(`  Framework:     ${chalk.cyan(config.framework)}`);
    console.log(`  Language:      ${chalk.cyan(config.language)}`);
    console.log(`  AI Model:      ${chalk.cyan(config.model)}`);
    console.log(`  Page Objects:  ${chalk.cyan(config.includePageObjects ? 'Yes' : 'No')}`);
    console.log(`  Max Tests:     ${chalk.cyan(config.maxTests.toString())}`);

    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Proceed with this configuration?',
        default: true
      }
    ]);

    if (!confirmed) {
      console.log(chalk.yellow('Configuration cancelled. Run again to start over.'));
      process.exit(0);
    }
  }

  async showProgress(task: string, operation: () => Promise<void>): Promise<void> {
    const spinner = ora(task).start();
    try {
      await operation();
      spinner.succeed(chalk.green(task + ' - Complete'));
    } catch (error) {
      spinner.fail(chalk.red(task + ' - Failed'));
      throw error;
    }
  }
}

// Progress tracking for multi-step operations
class ProgressTracker {
  private steps: string[];
  private currentStep = 0;

  constructor(steps: string[]) {
    this.steps = steps;
  }

  start(): void {
    console.log(chalk.blue(`\n📊 Progress: 0/${this.steps.length} steps\n`));
  }

  advance(message?: string): void {
    this.currentStep++;
    const progress = `[${this.currentStep}/${this.steps.length}]`;
    const step = this.steps[this.currentStep - 1];
    console.log(chalk.green(`✅ ${progress} ${step}${message ? ': ' + message : ''}`));
  }

  complete(): void {
    console.log(chalk.green.bold(`\n🎉 All ${this.steps.length} steps completed!\n`));
  }
}

/**
 * EXERCISE:
 * 1. Add configuration file save/load functionality
 * 2. Implement a "quick mode" with sensible defaults
 * 3. Add URL history for quick re-runs
 * 4. Create a dry-run mode that shows what would be generated
 */

/**
 * LEARNING:
 * - Interactive mode improves user experience
 * - Progress indicators keep users informed
 * - Configuration validation prevents errors
 *
 * ONE LINER:
 * "A great CLI guides users through complexity with clarity."
 */

export { InteractiveMode, InteractiveConfig, ProgressTracker };

