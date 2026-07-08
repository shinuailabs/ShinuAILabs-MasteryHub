# Lab 915: AI Fundamentals Best Practices

## Concept
Adopting AI in testing requires a strategic approach. Following best practices ensures you maximize benefits while avoiding pitfalls. This lab consolidates key principles for effectively using AI in your QA workflow.

## Bullet Points
- **Start Small**: Begin with low-risk, high-value use cases
- **Validate Always**: Never trust AI output without verification
- **Provide Context**: Better context yields better results
- **Iterate Prompts**: Refine prompts based on output quality
- **Maintain Skills**: Don't let AI replace fundamental QA skills
- **Measure Impact**: Track metrics to prove AI value
- **Stay Updated**: AI tools evolve rapidly
- **Security First**: Protect sensitive data from AI exposure

## Examples

### Example 1: AI Adoption Roadmap
```typescript
const aiAdoptionRoadmap = {
  phase1_foundation: {
    duration: '1-2 months',
    activities: [
      'Install GitHub Copilot for all QA engineers',
      'Train team on effective prompting',
      'Establish AI usage guidelines',
      'Set up metrics tracking'
    ],
    successMetrics: {
      adoption: '80% team using Copilot daily',
      productivity: '20% faster test writing'
    }
  },
  
  phase2_expansion: {
    duration: '2-3 months',
    activities: [
      'Integrate ChatGPT/Claude for test planning',
      'Implement visual AI testing (Applitools)',
      'Create prompt template library',
      'Automate test data generation'
    ],
    successMetrics: {
      coverage: '30% more test scenarios identified',
      visualBugs: '50% more visual issues caught'
    }
  },
  
  phase3_optimization: {
    duration: '3-6 months',
    activities: [
      'Implement self-healing locators',
      'Build custom LLM integrations',
      'AI-powered test selection in CI',
      'Predictive failure analysis'
    ],
    successMetrics: {
      maintenance: '40% less test maintenance',
      ciTime: '50% faster CI pipelines'
    }
  }
};
```

### Example 2: AI Quality Gates
```typescript
// Implement quality gates for AI-generated code
interface AIQualityGate {
  name: string;
  check: (code: string) => boolean;
  severity: 'error' | 'warning';
  autoFix?: (code: string) => string;
}

const aiQualityGates: AIQualityGate[] = [
  {
    name: 'Has Playwright imports',
    check: (code) => code.includes("from '@playwright/test'"),
    severity: 'error'
  },
  {
    name: 'Uses async/await',
    check: (code) => code.includes('async') && code.includes('await'),
    severity: 'error'
  },
  {
    name: 'Has assertions',
    check: (code) => code.includes('expect('),
    severity: 'error'
  },
  {
    name: 'No hardcoded waits',
    check: (code) => !code.includes('waitForTimeout'),
    severity: 'warning',
    autoFix: (code) => code.replace(
      /await page\.waitForTimeout\(\d+\);?/g,
      '// TODO: Replace with proper wait condition'
    )
  },
  {
    name: 'Uses stable locators',
    check: (code) => /data-testid|getByRole|getByText|getByLabel/.test(code),
    severity: 'warning'
  },
  {
    name: 'No sensitive data',
    check: (code) => !/password\s*[:=]\s*['"][^'"]{8,}['"]/.test(code),
    severity: 'error'
  }
];

function validateAICode(code: string): {
  passed: boolean;
  results: { gate: string; passed: boolean; severity: string }[];
} {
  const results = aiQualityGates.map(gate => ({
    gate: gate.name,
    passed: gate.check(code),
    severity: gate.severity
  }));
  
  const passed = results
    .filter(r => r.severity === 'error')
    .every(r => r.passed);
  
  return { passed, results };
}
```

### Example 3: AI Metrics Dashboard
```typescript
interface AIMetrics {
  testsGenerated: number;
  testsAccepted: number;
  timeSavedHours: number;
  bugsFoundByAI: number;
  falsePositives: number;
  promptIterations: number;
}

class AIMetricsDashboard {
  private metrics: AIMetrics = {
    testsGenerated: 0,
    testsAccepted: 0,
    timeSavedHours: 0,
    bugsFoundByAI: 0,
    falsePositives: 0,
    promptIterations: 0
  };

  recordTestGeneration(accepted: boolean, timeMinutes: number): void {
    this.metrics.testsGenerated++;
    if (accepted) {
      this.metrics.testsAccepted++;
      this.metrics.timeSavedHours += timeMinutes / 60;
    }
  }

  getAcceptanceRate(): number {
    return this.metrics.testsGenerated > 0
      ? (this.metrics.testsAccepted / this.metrics.testsGenerated) * 100
      : 0;
  }

  getROI(toolCostPerMonth: number, hourlyRate: number = 50): number {
    const savings = this.metrics.timeSavedHours * hourlyRate;
    return ((savings - toolCostPerMonth) / toolCostPerMonth) * 100;
  }

  generateReport(): string {
    return `
## AI Testing Metrics Report

### Productivity
- Tests Generated: ${this.metrics.testsGenerated}
- Tests Accepted: ${this.metrics.testsAccepted} (${this.getAcceptanceRate().toFixed(1)}%)
- Time Saved: ${this.metrics.timeSavedHours.toFixed(1)} hours

### Quality
- Bugs Found by AI: ${this.metrics.bugsFoundByAI}
- False Positives: ${this.metrics.falsePositives}
- Precision: ${this.calculatePrecision().toFixed(1)}%

### Efficiency
- Avg Prompt Iterations: ${(this.metrics.promptIterations / this.metrics.testsGenerated).toFixed(1)}
    `.trim();
  }

  private calculatePrecision(): number {
    const total = this.metrics.bugsFoundByAI + this.metrics.falsePositives;
    return total > 0 ? (this.metrics.bugsFoundByAI / total) * 100 : 100;
  }
}
```

## Exercise

### Task 1: Create AI Guidelines
Draft AI usage guidelines for your QA team.

### Task 2: Build Quality Gates
Implement quality gates for AI-generated tests in your project.

### Task 3: Metrics Tracking
Set up metrics tracking for AI tool usage.

## Coding Questions & Solutions

### Question 1: AI prompt library manager
```typescript
// Solution:
interface PromptTemplate {
  id: string;
  name: string;
  category: 'generation' | 'debugging' | 'review' | 'documentation';
  template: string;
  variables: string[];
  successRate: number;
  usageCount: number;
}

class PromptLibrary {
  private prompts: Map<string, PromptTemplate> = new Map();

  addPrompt(prompt: PromptTemplate): void {
    this.prompts.set(prompt.id, prompt);
  }

  getPrompt(id: string, variables: Record<string, string>): string {
    const template = this.prompts.get(id);
    if (!template) throw new Error(`Prompt ${id} not found`);

    let result = template.template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    template.usageCount++;
    return result;
  }

  recordSuccess(id: string, success: boolean): void {
    const template = this.prompts.get(id);
    if (template) {
      const total = template.usageCount;
      const currentSuccesses = template.successRate * (total - 1) / 100;
      template.successRate = ((currentSuccesses + (success ? 1 : 0)) / total) * 100;
    }
  }

  getTopPrompts(category?: string): PromptTemplate[] {
    return Array.from(this.prompts.values())
      .filter(p => !category || p.category === category)
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 10);
  }
}

// Usage
const library = new PromptLibrary();
library.addPrompt({
  id: 'playwright-test-gen',
  name: 'Playwright Test Generator',
  category: 'generation',
  template: `Generate a Playwright test for {{feature}}.
URL: {{url}}
Requirements: {{requirements}}`,
  variables: ['feature', 'url', 'requirements'],
  successRate: 85,
  usageCount: 150
});
```

### Question 2: AI feedback loop system
```typescript
// Solution:
interface AIFeedback {
  promptId: string;
  outputQuality: 1 | 2 | 3 | 4 | 5;
  wasUsed: boolean;
  modifications: 'none' | 'minor' | 'major' | 'rewritten';
  comments?: string;
}

class AIFeedbackSystem {
  private feedback: AIFeedback[] = [];

  recordFeedback(fb: AIFeedback): void {
    this.feedback.push(fb);
  }

  analyzePromptEffectiveness(promptId: string): {
    avgQuality: number;
    usageRate: number;
    modificationRate: Record<string, number>;
  } {
    const promptFeedback = this.feedback.filter(f => f.promptId === promptId);
    
    const avgQuality = promptFeedback.reduce((sum, f) => sum + f.outputQuality, 0) 
      / promptFeedback.length;
    
    const usageRate = promptFeedback.filter(f => f.wasUsed).length 
      / promptFeedback.length * 100;
    
    const modificationRate = {
      none: promptFeedback.filter(f => f.modifications === 'none').length / promptFeedback.length * 100,
      minor: promptFeedback.filter(f => f.modifications === 'minor').length / promptFeedback.length * 100,
      major: promptFeedback.filter(f => f.modifications === 'major').length / promptFeedback.length * 100,
      rewritten: promptFeedback.filter(f => f.modifications === 'rewritten').length / promptFeedback.length * 100
    };

    return { avgQuality, usageRate, modificationRate };
  }

  suggestImprovements(promptId: string): string[] {
    const analysis = this.analyzePromptEffectiveness(promptId);
    const suggestions: string[] = [];

    if (analysis.avgQuality < 3) {
      suggestions.push('Consider adding more context to the prompt');
    }
    if (analysis.modificationRate.major > 30) {
      suggestions.push('Prompt output requires significant editing - refine template');
    }
    if (analysis.usageRate < 50) {
      suggestions.push('Low usage rate - prompt may not be meeting needs');
    }

    return suggestions;
  }
}
```

## Learning
- Start with simple AI tools and expand gradually
- Always validate AI output before using in production
- Track metrics to demonstrate AI value
- Create reusable prompt templates
- Implement quality gates for AI-generated code
- Maintain human expertise alongside AI adoption
- Continuously improve prompts based on feedback

## One Liner
> "Successful AI adoption in testing is a journey of continuous learning, validation, and improvement - not a destination."

