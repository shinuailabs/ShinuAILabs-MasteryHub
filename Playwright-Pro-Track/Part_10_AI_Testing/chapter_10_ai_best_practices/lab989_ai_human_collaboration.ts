/**
 * Lab 989: AI-Human Collaboration in Testing
 *
 * CONCEPT:
 * Effective AI testing combines AI capabilities with human expertise.
 * Learn to leverage AI strengths while maintaining human oversight
 * and decision-making.
 *
 * BULLET POINTS:
 * - Division of responsibilities
 * - Collaborative workflows
 * - AI as assistant, not replacement
 * - Skill development
 * - Feedback loops
 */

// Example 1: Task division
interface TaskAllocation {
  task: string;
  bestFor: 'ai' | 'human' | 'collaborative';
  reason: string;
}

const taskAllocations: TaskAllocation[] = [
  {
    task: 'Generate test boilerplate',
    bestFor: 'ai',
    reason: 'Repetitive, pattern-based task',
  },
  {
    task: 'Define test strategy',
    bestFor: 'human',
    reason: 'Requires business context and judgment',
  },
  {
    task: 'Identify edge cases',
    bestFor: 'collaborative',
    reason: 'AI suggests, human validates and adds context',
  },
  {
    task: 'Analyze test failures',
    bestFor: 'collaborative',
    reason: 'AI categorizes, human investigates root cause',
  },
  {
    task: 'Maintain test suite',
    bestFor: 'collaborative',
    reason: 'AI identifies issues, human decides fixes',
  },
  {
    task: 'Review test quality',
    bestFor: 'human',
    reason: 'Requires understanding of business requirements',
  },
];

// Example 2: Collaboration workflow
interface CollaborativeStep {
  step: number;
  actor: 'ai' | 'human';
  action: string;
  output: string;
}

const testCreationWorkflow: CollaborativeStep[] = [
  { step: 1, actor: 'human', action: 'Define requirement', output: 'User story' },
  { step: 2, actor: 'ai', action: 'Generate test scenarios', output: 'Test scenario list' },
  { step: 3, actor: 'human', action: 'Review and select scenarios', output: 'Approved scenarios' },
  { step: 4, actor: 'ai', action: 'Generate test code', output: 'Draft test code' },
  { step: 5, actor: 'human', action: 'Review and refine code', output: 'Final test code' },
  { step: 6, actor: 'ai', action: 'Run tests and report', output: 'Test results' },
  { step: 7, actor: 'human', action: 'Analyze results and decide', output: 'Action items' },
];

// Example 3: AI assistant interface
interface AIAssistant {
  suggest(context: string): Promise<string[]>;
  generate(requirement: string): Promise<string>;
  analyze(failure: string): Promise<string>;
  explain(code: string): Promise<string>;
}

class TestingAIAssistant implements AIAssistant {
  private llm: { call: (prompt: string) => Promise<string> };

  constructor(llm: { call: (prompt: string) => Promise<string> }) {
    this.llm = llm;
  }

  async suggest(context: string): Promise<string[]> {
    const response = await this.llm.call(`Suggest test scenarios for: ${context}`);
    return response.split('\n').filter((s) => s.trim());
  }

  async generate(requirement: string): Promise<string> {
    return this.llm.call(`Generate Playwright test for: ${requirement}`);
  }

  async analyze(failure: string): Promise<string> {
    return this.llm.call(`Analyze this test failure: ${failure}`);
  }

  async explain(code: string): Promise<string> {
    return this.llm.call(`Explain this test code: ${code}`);
  }
}

// Example 4: Human decision points
interface DecisionPoint {
  trigger: string;
  question: string;
  options: string[];
  default: string;
}

const humanDecisionPoints: DecisionPoint[] = [
  {
    trigger: 'AI suggests deleting a test',
    question: 'Should this test be removed?',
    options: ['Delete', 'Keep', 'Archive'],
    default: 'Keep',
  },
  {
    trigger: 'AI confidence is below 70%',
    question: 'AI is uncertain. How to proceed?',
    options: ['Use AI suggestion', 'Modify', 'Manual creation'],
    default: 'Modify',
  },
  {
    trigger: 'Test affects production data',
    question: 'Test may affect production. Proceed?',
    options: ['Proceed', 'Review', 'Cancel'],
    default: 'Review',
  },
];

// Example 5: Skill development tracking
interface SkillProgress {
  skill: string;
  aiHelped: number;
  humanMastered: number;
  level: 'learning' | 'practicing' | 'proficient';
}

function trackSkillDevelopment(
  skills: SkillProgress[],
  task: string,
  usedAI: boolean
): SkillProgress[] {
  const skill = skills.find((s) => s.skill === task);
  if (skill) {
    if (usedAI) {
      skill.aiHelped++;
    } else {
      skill.humanMastered++;
    }

    // Update level based on ratio
    const ratio = skill.humanMastered / (skill.aiHelped + skill.humanMastered);
    skill.level = ratio > 0.7 ? 'proficient' : ratio > 0.4 ? 'practicing' : 'learning';
  }
  return skills;
}

// Example 6: Feedback loop
function provideFeedbackToAI(
  aiSuggestion: string,
  humanDecision: 'accepted' | 'modified' | 'rejected',
  modification?: string
): { feedback: string; learningSignal: number } {
  const signals = { accepted: 1, modified: 0.5, rejected: 0 };

  return {
    feedback: `AI suggested: ${aiSuggestion.slice(0, 50)}... Human: ${humanDecision}`,
    learningSignal: signals[humanDecision],
  };
}

/**
 * EXERCISE:
 * 1. Define task allocations
 * 2. Create collaborative workflows
 * 3. Implement decision points
 * 4. Track skill development
 *
 * LEARNING:
 * - AI augments human capability
 * - Clear roles improve efficiency
 * - Human oversight ensures quality
 * - Feedback improves both AI and humans
 *
 * ONE LINER:
 * "AI is your testing partner, not your replacement - collaborate for best results."
 */

export { taskAllocations, testCreationWorkflow, TestingAIAssistant, provideFeedbackToAI };

