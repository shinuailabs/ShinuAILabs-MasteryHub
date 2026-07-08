/**
 * Lab 1002: AI Test Generator CLI - Test File Writer
 *
 * CONCEPT:
 * The Test File Writer takes generated tests and creates properly formatted
 * Playwright test files with correct imports, structure, and organization.
 *
 * BULLET POINTS:
 * - File system operations for test output
 * - Code formatting with Prettier
 * - Import management and deduplication
 * - Test file organization patterns
 * - Page Object generation alongside tests
 */

import * as fs from 'fs';
import * as path from 'path';
import { GeneratedTest } from './lab1000_ai_test_generation';

interface WriteOptions {
  outputDir: string;
  groupByType: boolean;
  generatePageObjects: boolean;
  addTimestamp: boolean;
}

interface TestFile {
  filename: string;
  content: string;
  path: string;
}

class TestFileWriter {
  private defaultOptions: WriteOptions = {
    outputDir: './generated-tests',
    groupByType: true,
    generatePageObjects: true,
    addTimestamp: true
  };

  async writeTests(
    tests: GeneratedTest[],
    pageName: string,
    options: Partial<WriteOptions> = {}
  ): Promise<TestFile[]> {
    const opts = { ...this.defaultOptions, ...options };
    const files: TestFile[] = [];

    // Ensure output directory exists
    this.ensureDirectory(opts.outputDir);

    if (opts.groupByType) {
      // Group tests by type and write separate files
      const grouped = this.groupTestsByType(tests);
      
      for (const [type, typeTests] of Object.entries(grouped)) {
        const file = this.createTestFile(typeTests, `${pageName}.${type}`, opts);
        files.push(file);
        await this.writeFile(file);
      }
    } else {
      // Write all tests to single file
      const file = this.createTestFile(tests, pageName, opts);
      files.push(file);
      await this.writeFile(file);
    }

    // Generate Page Object if requested
    if (opts.generatePageObjects) {
      const pageObject = this.generatePageObject(tests, pageName, opts);
      files.push(pageObject);
      await this.writeFile(pageObject);
    }

    return files;
  }

  private createTestFile(tests: GeneratedTest[], name: string, opts: WriteOptions): TestFile {
    const timestamp = opts.addTimestamp ? `// Generated: ${new Date().toISOString()}\n` : '';
    
    const imports = `import { test, expect } from '@playwright/test';\n\n`;
    
    const testDescribe = `test.describe('${this.formatTestSuiteName(name)}', () => {\n`;
    
    const testCases = tests.map(t => this.formatTestCase(t)).join('\n\n');
    
    const closing = '\n});\n';

    const content = timestamp + imports + testDescribe + testCases + closing;
    const filename = `${this.sanitizeFilename(name)}.spec.ts`;

    return {
      filename,
      content: this.formatCode(content),
      path: path.join(opts.outputDir, filename)
    };
  }

  private formatTestCase(test: GeneratedTest): string {
    // Clean up the code if it already has imports
    let code = test.code;
    code = code.replace(/import.*from.*;\n?/g, '');
    code = code.trim();
    
    // Add description as comment
    const comment = `  // ${test.description}\n`;
    
    // Indent the test code
    const indentedCode = code.split('\n').map(line => `  ${line}`).join('\n');
    
    return comment + indentedCode;
  }

  private generatePageObject(tests: GeneratedTest[], pageName: string, opts: WriteOptions): TestFile {
    const className = this.toPascalCase(pageName) + 'Page';
    
    // Extract unique selectors from tests
    const selectors = this.extractSelectors(tests);
    
    const content = `import { Page, Locator } from '@playwright/test';

/**
 * Page Object for ${pageName}
 * Generated: ${new Date().toISOString()}
 */
export class ${className} {
  readonly page: Page;
${selectors.map(s => `  readonly ${s.name}: Locator;`).join('\n')}

  constructor(page: Page) {
    this.page = page;
${selectors.map(s => `    this.${s.name} = page.locator('${s.selector}');`).join('\n')}
  }

  async navigate(): Promise<void> {
    await this.page.goto('/${pageName.toLowerCase()}');
  }
}
`;

    return {
      filename: `${this.sanitizeFilename(pageName)}.page.ts`,
      content,
      path: path.join(opts.outputDir, 'pages', `${this.sanitizeFilename(pageName)}.page.ts`)
    };
  }

  private extractSelectors(tests: GeneratedTest[]): Array<{ name: string; selector: string }> {
    const selectors: Array<{ name: string; selector: string }> = [];
    const selectorRegex = /locator\(['"]([^'"]+)['"]\)|getBy\w+\(['"]([^'"]+)['"]\)/g;
    
    tests.forEach(test => {
      let match;
      while ((match = selectorRegex.exec(test.code)) !== null) {
        const selector = match[1] || match[2];
        const name = this.selectorToName(selector);
        if (!selectors.find(s => s.name === name)) {
          selectors.push({ name, selector });
        }
      }
    });
    
    return selectors.slice(0, 20); // Limit to 20 selectors
  }

  private selectorToName(selector: string): string {
    return selector
      .replace(/[#.\[\]="']/g, '')
      .replace(/-/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  private groupTestsByType(tests: GeneratedTest[]): Record<string, GeneratedTest[]> {
    return tests.reduce((acc, test) => {
      const type = test.type || 'general';
      if (!acc[type]) acc[type] = [];
      acc[type].push(test);
      return acc;
    }, {} as Record<string, GeneratedTest[]>);
  }

  private ensureDirectory(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private async writeFile(file: TestFile): Promise<void> {
    const dir = path.dirname(file.path);
    this.ensureDirectory(dir);
    fs.writeFileSync(file.path, file.content, 'utf-8');
    console.log(`✅ Written: ${file.path}`);
  }

  private formatCode(code: string): string {
    // Basic formatting - in production, use Prettier
    return code.replace(/\n{3,}/g, '\n\n');
  }

  private sanitizeFilename(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  private formatTestSuiteName(name: string): string {
    return name.split(/[-_.]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  private toPascalCase(str: string): string {
    return str.split(/[-_.]/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  }
}

/**
 * LEARNING:
 * - Proper file organization improves maintainability
 * - Page Objects should be generated alongside tests
 * - Code formatting ensures consistency
 *
 * ONE LINER:
 * "Well-organized test files are easier to maintain and understand."
 */

export { TestFileWriter, TestFile, WriteOptions };

