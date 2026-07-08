/**
 * Lab 1006: AI Test Generator CLI - Complete Integration
 *
 * CONCEPT:
 * This lab brings together all components into a complete, working CLI tool
 * that can analyze pages and generate Playwright tests using AI.
 *
 * BULLET POINTS:
 * - Full CLI workflow integration
 * - Component orchestration
 * - Configuration management
 * - Output formatting and reporting
 * - Production-ready error handling
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { PageAnalyzer } from './lab999_page_analyzer';
import { AITestGenerator } from './lab1000_ai_test_generation';
import { PromptBuilder } from './lab1001_prompt_engineering';
import { TestFileWriter } from './lab1002_test_file_writer';
import { InteractiveMode } from './lab1003_cli_interactive_mode';
import { ErrorHandler, withRetry, validateUrl, validateApiKey } from './lab1004_error_handling';
import { TestValidator } from './lab1005_test_validation';

interface CLIOptions {
  output: string;
  model: string;
  maxTests: number;
  interactive: boolean;
  verbose: boolean;
  dryRun: boolean;
  pageObjects: boolean;
}

class AITestGeneratorCLI {
  private analyzer: PageAnalyzer;
  private generator: AITestGenerator;
  private promptBuilder: PromptBuilder;
  private writer: TestFileWriter;
  private validator: TestValidator;
  private errorHandler: ErrorHandler;

  constructor(apiKey: string, verbose: boolean = false) {
    this.analyzer = new PageAnalyzer();
    this.generator = new AITestGenerator(apiKey);
    this.promptBuilder = new PromptBuilder();
    this.writer = new TestFileWriter();
    this.validator = new TestValidator();
    this.errorHandler = new ErrorHandler(verbose);
  }

  async run(url: string, options: CLIOptions): Promise<void> {
    console.log(chalk.blue.bold('\n🤖 AI Test Generator CLI v1.0.0\n'));

    try {
      // Validate inputs
      validateUrl(url);
      validateApiKey(process.env.OPENAI_API_KEY);

      // Step 1: Analyze page
      const spinner1 = ora('Analyzing page...').start();
      await this.analyzer.initialize();
      const analysis = await withRetry(() => this.analyzer.analyze(url));
      spinner1.succeed(`Analyzed: ${analysis.title}`);

      console.log(chalk.gray(`  Found ${analysis.elements.length} elements, ${analysis.forms.length} forms`));

      // Step 2: Generate tests
      const spinner2 = ora('Generating tests with AI...').start();
      const tests = await withRetry(() => 
        this.generator.generateTests(analysis, {
          model: options.model,
          maxTests: options.maxTests
        })
      );
      spinner2.succeed(`Generated ${tests.length} tests`);

      // Step 3: Validate tests
      const spinner3 = ora('Validating generated tests...').start();
      let validTests = 0;
      let totalScore = 0;

      tests.forEach(test => {
        const result = this.validator.validate(test);
        if (result.valid) validTests++;
        totalScore += result.score;
        
        // Auto-fix issues
        test.code = this.validator.autoFix(test.code);
      });

      const avgScore = Math.round(totalScore / tests.length);
      spinner3.succeed(`Validated: ${validTests}/${tests.length} tests passed (avg score: ${avgScore})`);

      // Step 4: Write files (unless dry-run)
      if (!options.dryRun) {
        const spinner4 = ora('Writing test files...').start();
        const pageName = new URL(url).pathname.replace(/\//g, '-').slice(1) || 'home';
        const files = await this.writer.writeTests(tests, pageName, {
          outputDir: options.output,
          generatePageObjects: options.pageObjects
        });
        spinner4.succeed(`Written ${files.length} files to ${options.output}`);

        // Print file list
        console.log(chalk.gray('\n  Generated files:'));
        files.forEach(f => console.log(chalk.gray(`    • ${f.filename}`)));
      } else {
        console.log(chalk.yellow('\n  Dry run - no files written'));
      }

      // Summary
      this.printSummary(url, tests.length, avgScore, options);

    } catch (error) {
      this.errorHandler.handle(error);
      process.exit(1);
    } finally {
      await this.analyzer.close();
    }
  }

  private printSummary(url: string, testCount: number, score: number, options: CLIOptions): void {
    console.log(chalk.green.bold('\n✅ Generation Complete!\n'));
    console.log(chalk.white('  Summary:'));
    console.log(chalk.gray(`    URL:         ${url}`));
    console.log(chalk.gray(`    Tests:       ${testCount}`));
    console.log(chalk.gray(`    Quality:     ${score}%`));
    console.log(chalk.gray(`    Output:      ${options.output}`));
    console.log(chalk.gray(`    Model:       ${options.model}`));
    
    console.log(chalk.blue('\n  Next steps:'));
    console.log(chalk.gray('    1. Review generated tests'));
    console.log(chalk.gray('    2. Run: npx playwright test'));
    console.log(chalk.gray('    3. Customize as needed\n'));
  }
}

// CLI Entry Point
const program = new Command();

program
  .name('ai-test-gen')
  .description('AI-powered Playwright test generator')
  .version('1.0.0')
  .argument('<url>', 'URL to analyze')
  .option('-o, --output <dir>', 'Output directory', './generated-tests')
  .option('-m, --model <model>', 'AI model', 'gpt-4')
  .option('-n, --max-tests <number>', 'Max tests to generate', '10')
  .option('-i, --interactive', 'Interactive mode')
  .option('-v, --verbose', 'Verbose output')
  .option('--dry-run', 'Preview without writing files')
  .option('--no-page-objects', 'Skip Page Object generation')
  .action(async (url, options) => {
    const apiKey = process.env.OPENAI_API_KEY || '';
    
    if (options.interactive) {
      const interactive = new InteractiveMode();
      const config = await interactive.run();
      url = config.url;
      options = { ...options, ...config };
    }

    const cli = new AITestGeneratorCLI(apiKey, options.verbose);
    await cli.run(url, {
      output: options.output,
      model: options.model,
      maxTests: parseInt(options.maxTests),
      interactive: options.interactive,
      verbose: options.verbose,
      dryRun: options.dryRun,
      pageObjects: options.pageObjects !== false
    });
  });

program.parse();

/**
 * LEARNING:
 * - Integration requires careful orchestration of components
 * - Progress feedback keeps users informed
 * - Graceful error handling is essential for CLI tools
 *
 * ONE LINER:
 * "A complete tool is more than the sum of its parts."
 */

export { AITestGeneratorCLI };

