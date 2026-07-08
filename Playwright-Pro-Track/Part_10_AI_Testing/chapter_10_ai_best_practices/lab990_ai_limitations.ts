/**
 * Lab 990: Understanding AI Limitations
 *
 * CONCEPT:
 * Knowing AI limitations helps set realistic expectations and avoid
 * pitfalls. AI is powerful but not infallible - understanding its
 * boundaries leads to better outcomes.
 *
 * BULLET POINTS:
 * - Hallucination awareness
 * - Context limitations
 * - Knowledge cutoffs
 * - Reasoning limitations
 * - When not to use AI
 */

// Example 1: Known AI limitations
interface AILimitation {
  limitation: string;
  description: string;
  impact: string;
  mitigation: string;
}

const aiLimitations: AILimitation[] = [
  {
    limitation: 'Hallucination',
    description: 'AI can generate plausible but incorrect information',
    impact: 'Generated tests may have invalid selectors or assertions',
    mitigation: 'Always verify AI-generated code against actual application',
  },
  {
    limitation: 'Context Window',
    description: 'AI can only process limited context at once',
    impact: 'May miss important information in large codebases',
    mitigation: 'Provide focused, relevant context; summarize when needed',
  },
  {
    limitation: 'Knowledge Cutoff',
    description: 'AI knowledge has a training cutoff date',
    impact: 'May not know about latest Playwright features or APIs',
    mitigation: 'Provide documentation for new features in prompts',
  },
  {
    limitation: 'No Runtime Access',
    description: 'AI cannot actually run or test code',
    impact: 'Cannot verify if generated tests actually work',
    mitigation: 'Always run and validate generated tests',
  },
  {
    limitation: 'No Application Knowledge',
    description: 'AI does not know your specific application',
    impact: 'Generated tests may not match your app structure',
    mitigation: 'Provide application context, examples, and conventions',
  },
];

// Example 2: Hallucination detection
interface HallucinationCheck {
  check: string;
  passed: boolean;
  details?: string;
}

function detectPotentialHallucinations(generatedCode: string): HallucinationCheck[] {
  const checks: HallucinationCheck[] = [];

  // Check for non-existent Playwright methods
  const suspiciousMethods = ['waitForVisible', 'findElement', 'sendKeys', 'findByText'];
  suspiciousMethods.forEach((method) => {
    if (generatedCode.includes(method)) {
      checks.push({
        check: `Suspicious method: ${method}`,
        passed: false,
        details: 'This method may not exist in Playwright',
      });
    }
  });

  // Check for made-up selectors
  if (generatedCode.includes('#made-up-id') || generatedCode.includes('.fake-class')) {
    checks.push({
      check: 'Placeholder selectors detected',
      passed: false,
      details: 'Replace with actual selectors from your application',
    });
  }

  // Check for overly specific assertions
  if (generatedCode.match(/toHaveText\(['"][\w\s]{50,}['"]\)/)) {
    checks.push({
      check: 'Very specific text assertion',
      passed: false,
      details: 'Consider using partial text match to avoid brittleness',
    });
  }

  if (checks.length === 0) {
    checks.push({ check: 'No obvious hallucinations detected', passed: true });
  }

  return checks;
}

// Example 3: When NOT to use AI
const whenNotToUseAI = [
  {
    scenario: 'Security-critical tests',
    reason: 'AI may miss security edge cases or introduce vulnerabilities',
    alternative: 'Manual security review with AI as secondary check',
  },
  {
    scenario: 'Regulatory compliance tests',
    reason: 'AI may not understand specific compliance requirements',
    alternative: 'Human-written tests with AI-assisted documentation',
  },
  {
    scenario: 'Complex business logic',
    reason: 'AI lacks deep understanding of business rules',
    alternative: 'Human design with AI code generation assistance',
  },
  {
    scenario: 'Performance benchmarking',
    reason: 'AI cannot accurately predict or measure performance',
    alternative: 'Traditional performance testing tools',
  },
];

// Example 4: Confidence scoring
interface AIOutputConfidence {
  output: string;
  confidence: number;
  factors: { factor: string; impact: number }[];
  recommendation: 'use' | 'review' | 'discard';
}

function assessConfidence(aiOutput: string, context: string): AIOutputConfidence {
  const factors: { factor: string; impact: number }[] = [];
  let confidence = 0.7; // Base confidence

  // Context provided
  if (context.length > 500) {
    confidence += 0.1;
    factors.push({ factor: 'Detailed context provided', impact: 0.1 });
  }

  // Output has structure
  if (aiOutput.includes('test(') && aiOutput.includes('expect(')) {
    confidence += 0.1;
    factors.push({ factor: 'Valid test structure', impact: 0.1 });
  }

  // Check for uncertainty markers
  if (aiOutput.includes('TODO') || aiOutput.includes('FIXME')) {
    confidence -= 0.2;
    factors.push({ factor: 'Contains uncertainty markers', impact: -0.2 });
  }

  confidence = Math.max(0, Math.min(1, confidence));

  return {
    output: aiOutput,
    confidence,
    factors,
    recommendation: confidence > 0.8 ? 'use' : confidence > 0.5 ? 'review' : 'discard',
  };
}

// Example 5: Limitation acknowledgment
function acknowledgeAILimitations(): string {
  return `
AI-Assisted Test Generation Notice:
-----------------------------------
- AI-generated code requires human review
- Selectors should be verified against actual application
- Assertions may need adjustment for your specific requirements
- AI may suggest deprecated or non-existent methods
- Always run tests to verify functionality
  `.trim();
}

/**
 * EXERCISE:
 * 1. Identify AI limitations in your context
 * 2. Implement hallucination detection
 * 3. Set up confidence scoring
 * 4. Know when to use alternatives
 *
 * LEARNING:
 * - AI is powerful but imperfect
 * - Hallucinations are real
 * - Context limitations matter
 * - Human oversight compensates
 *
 * ONE LINER:
 * "Know AI's limits to use it effectively - trust but verify, always."
 */

export { aiLimitations, detectPotentialHallucinations, assessConfidence, whenNotToUseAI };

