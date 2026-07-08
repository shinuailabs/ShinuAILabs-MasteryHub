/**
 * Lab 998: AI Test Generator CLI - Project Setup
 *
 * CONCEPT:
 * Build a command-line tool that generates Playwright tests from URLs using AI.
 * This project teaches you how to combine CLI development with LLM integration
 * to create a practical tool for automated test generation.
 *
 * BULLET POINTS:
 * - CLI frameworks: Commander.js, Inquirer.js, Chalk
 * - Project structure for CLI applications
 * - TypeScript configuration for CLI tools
 * - npm package setup for distribution
 * - Environment configuration for API keys
 *
 * EXAMPLES:
 * Usage: ai-test-gen <url> [options]
 * ai-test-gen https://example.com/login --output ./tests
 * ai-test-gen https://example.com --framework playwright --lang typescript
 */

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

// CLI Configuration
const program = new Command();

program
  .name('ai-test-gen')
  .description('AI-powered Playwright test generator')
  .version('1.0.0');

program
  .argument('<url>', 'URL to analyze and generate tests for')
  .option('-o, --output <dir>', 'Output directory for tests', './generated-tests')
  .option('-f, --framework <name>', 'Test framework', 'playwright')
  .option('-l, --lang <language>', 'Language (typescript/javascript)', 'typescript')
  .option('--model <model>', 'AI model to use', 'gpt-4')
  .option('--verbose', 'Enable verbose logging', false)
  .action(async (url, options) => {
    console.log(chalk.blue('🤖 AI Test Generator CLI'));
    console.log(chalk.gray(`Analyzing: ${url}`));
    console.log(chalk.gray(`Output: ${options.output}`));
    console.log(chalk.gray(`Framework: ${options.framework}`));
    console.log(chalk.gray(`Language: ${options.lang}`));
    
    // Ensure output directory exists
    if (!fs.existsSync(options.output)) {
      fs.mkdirSync(options.output, { recursive: true });
    }
    
    // TODO: Implement test generation in next labs
    console.log(chalk.green('✅ Setup complete!'));
  });

// Project structure
const projectStructure = `
ai-test-generator/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── analyzer/
│   │   ├── page-analyzer.ts
│   │   └── element-extractor.ts
│   ├── generator/
│   │   ├── test-generator.ts
│   │   └── templates/
│   ├── ai/
│   │   ├── openai-client.ts
│   │   └── prompt-builder.ts
│   └── utils/
│       ├── logger.ts
│       └── config.ts
├── package.json
├── tsconfig.json
└── .env
`;

// Package.json configuration
const packageJson = {
  name: 'ai-test-generator',
  version: '1.0.0',
  description: 'AI-powered Playwright test generator CLI',
  main: 'dist/index.js',
  bin: {
    'ai-test-gen': './dist/index.js'
  },
  scripts: {
    build: 'tsc',
    start: 'node dist/index.js',
    dev: 'ts-node src/index.ts'
  },
  dependencies: {
    'commander': '^11.0.0',
    'chalk': '^5.3.0',
    'inquirer': '^9.2.0',
    'openai': '^4.0.0',
    'playwright': '^1.40.0',
    'dotenv': '^16.0.0'
  },
  devDependencies: {
    '@types/node': '^20.0.0',
    'typescript': '^5.0.0',
    'ts-node': '^10.9.0'
  }
};

/**
 * EXERCISE:
 * 1. Initialize a new npm project with the structure above
 * 2. Install all dependencies
 * 3. Create the CLI entry point with Commander.js
 * 4. Add environment variable support for API keys
 * 5. Test the CLI with: npx ts-node src/index.ts https://example.com
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 */

// Q1: Create a configuration loader
interface Config {
  openaiApiKey: string;
  model: string;
  outputDir: string;
}

function loadConfig(): Config {
  return {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4',
    outputDir: process.env.OUTPUT_DIR || './generated-tests'
  };
}

// Q2: Create a logger utility
const logger = {
  info: (msg: string) => console.log(chalk.blue(`ℹ ${msg}`)),
  success: (msg: string) => console.log(chalk.green(`✅ ${msg}`)),
  error: (msg: string) => console.log(chalk.red(`❌ ${msg}`)),
  warn: (msg: string) => console.log(chalk.yellow(`⚠ ${msg}`)),
  debug: (msg: string, verbose: boolean) => {
    if (verbose) console.log(chalk.gray(`🔍 ${msg}`));
  }
};

/**
 * LEARNING:
 * - CLI tools need clear command structure and help text
 * - Environment variables keep sensitive data secure
 * - TypeScript provides type safety for complex projects
 * - Modular structure makes code maintainable
 *
 * ONE LINER:
 * "A well-structured CLI is the foundation of a great developer tool."
 */

export { program, loadConfig, logger, packageJson, projectStructure };

