# Part 01: AI Test Generator CLI - Notes

## 📚 Overview

Build a complete command-line tool that generates Playwright tests from URLs using AI. This project combines CLI development, web scraping, and LLM integration to create a practical automation tool.

## 🎯 Key Concepts

### 1. CLI Architecture
```typescript
import { Command } from 'commander';

const program = new Command();
program
  .name('ai-test-gen')
  .argument('<url>', 'URL to analyze')
  .option('-o, --output <dir>', 'Output directory')
  .action(async (url, options) => {
    // Implementation
  });
```

### 2. Page Analysis
```typescript
class PageAnalyzer {
  async analyze(url: string): Promise<PageAnalysis> {
    await this.page.goto(url);
    const elements = await this.extractElements();
    const forms = await this.extractForms();
    return { url, elements, forms };
  }
}
```

### 3. AI Test Generation
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: pageAnalysis }
  ]
});
```

### 4. Prompt Engineering
```typescript
const prompt = `Generate Playwright tests for:
URL: ${analysis.url}
Elements: ${JSON.stringify(analysis.elements)}
Focus on: happy paths, validation, error handling`;
```

## 💻 Practice Exercises

1. **Basic CLI**: Create a CLI that accepts a URL and prints page title
2. **Element Extraction**: Extract all interactive elements from a page
3. **AI Integration**: Send page data to OpenAI and get test suggestions
4. **File Generation**: Write generated tests to properly formatted files
5. **Interactive Mode**: Add prompts for user configuration

## ✅ Best Practices

### Do's ✓
- Use role-based locators in generated tests
- Validate generated code before saving
- Provide helpful error messages
- Support both interactive and command-line modes
- Include progress indicators for long operations

### Don'ts ✗
- Don't hardcode API keys in code
- Don't generate tests without validation
- Don't ignore rate limits
- Don't skip error handling
- Don't generate fragile CSS selectors

## 📝 Quick Reference

```bash
# Basic usage
ai-test-gen https://example.com/login

# With options
ai-test-gen https://example.com -o ./tests -m gpt-4 -n 10

# Interactive mode
ai-test-gen --interactive

# Dry run (preview only)
ai-test-gen https://example.com --dry-run
```

### Project Structure
```
ai-test-generator/
├── src/
│   ├── index.ts           # CLI entry
│   ├── analyzer/          # Page analysis
│   ├── generator/         # Test generation
│   ├── ai/                # LLM integration
│   └── utils/             # Helpers
├── package.json
└── tsconfig.json
```

### Key Dependencies
- `commander` - CLI framework
- `inquirer` - Interactive prompts
- `chalk` - Terminal styling
- `ora` - Spinners
- `openai` - AI integration
- `playwright` - Browser automation

## 🔗 Labs in This Chapter

| Lab | Topic |
|-----|-------|
| 998 | CLI Project Setup |
| 999 | Page Analyzer |
| 1000 | AI Test Generation |
| 1001 | Prompt Engineering |
| 1002 | Test File Writer |
| 1003 | Interactive Mode |
| 1004 | Error Handling |
| 1005 | Test Validation |
| 1006 | Complete Integration |

