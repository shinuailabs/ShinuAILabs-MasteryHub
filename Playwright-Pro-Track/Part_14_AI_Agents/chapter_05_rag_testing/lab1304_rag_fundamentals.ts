/**
 * Lab 1304: RAG (Retrieval-Augmented Generation) for Test Automation
 *
 * CONCEPT:
 * RAG combines retrieval systems with LLMs to provide context-aware responses.
 * For test automation, RAG enables AI to understand your codebase, test patterns,
 * and documentation to generate better tests.
 *
 * BULLET POINTS:
 * - RAG = Retrieval + Generation (LLM)
 * - Embeddings: Convert text to vectors for similarity search
 * - Vector stores: Database for storing embeddings (Pinecone, Chroma)
 * - Chunking: Split documents into manageable pieces
 * - Context window: Amount of retrieved context sent to LLM
 *
 * EXAMPLES:
 * - Generate tests based on existing test patterns
 * - Answer questions about your test framework
 * - Auto-fix tests using codebase knowledge
 */

// Note: Install dependencies:
// npm install langchain @langchain/openai chromadb

import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';

// ============================================
// 1. Document Loading & Chunking
// ============================================

interface TestDocument {
  content: string;
  metadata: {
    filename: string;
    type: 'test' | 'page-object' | 'config' | 'documentation';
  };
}

class TestCodebaseLoader {
  private splitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', ' ', ''],
    });
  }

  async loadTestFile(content: string, filename: string): Promise<Document[]> {
    const docs = await this.splitter.createDocuments(
      [content],
      [{ filename, type: this.detectType(filename) }]
    );
    return docs;
  }

  private detectType(filename: string): string {
    if (filename.includes('.spec.') || filename.includes('.test.')) return 'test';
    if (filename.includes('page') || filename.includes('Page')) return 'page-object';
    if (filename.includes('config')) return 'config';
    return 'documentation';
  }

  async loadMultipleFiles(files: TestDocument[]): Promise<Document[]> {
    const allDocs: Document[] = [];

    for (const file of files) {
      const docs = await this.loadTestFile(file.content, file.metadata.filename);
      allDocs.push(...docs);
    }

    return allDocs;
  }
}

// ============================================
// 2. Vector Store Setup
// ============================================

class TestKnowledgeBase {
  private vectorStore: MemoryVectorStore | null = null;
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async indexDocuments(documents: Document[]): Promise<void> {
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      this.embeddings
    );
    console.log(`✅ Indexed ${documents.length} document chunks`);
  }

  async search(query: string, k: number = 5): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized. Call indexDocuments first.');
    }

    const results = await this.vectorStore.similaritySearch(query, k);
    return results;
  }

  async searchWithScore(query: string, k: number = 5): Promise<Array<[Document, number]>> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }

    return this.vectorStore.similaritySearchWithScore(query, k);
  }
}

// ============================================
// 3. RAG Chain for Test Generation
// ============================================

class TestGeneratorRAG {
  private knowledgeBase: TestKnowledgeBase;
  private llm: ChatOpenAI;

  constructor() {
    this.knowledgeBase = new TestKnowledgeBase();
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async initialize(documents: Document[]): Promise<void> {
    await this.knowledgeBase.indexDocuments(documents);
  }

  async generateTest(requirement: string): Promise<string> {
    // Step 1: Retrieve relevant context
    const relevantDocs = await this.knowledgeBase.search(requirement, 5);

    const context = relevantDocs
      .map(doc => `File: ${doc.metadata.filename}\n${doc.pageContent}`)
      .join('\n\n---\n\n');

    // Step 2: Generate test with context
    const prompt = `You are a Playwright test automation expert.

Based on the following existing test patterns and code from the codebase:

${context}

Generate a new Playwright test for this requirement:
${requirement}

Follow the same patterns, naming conventions, and structure as the existing tests.
Use TypeScript and include proper assertions.

Output only the test code.`;

    const response = await this.llm.invoke(prompt);
    return response.content as string;
  }

  async answerQuestion(question: string): Promise<string> {
    const relevantDocs = await this.knowledgeBase.search(question, 3);

    const context = relevantDocs
      .map(doc => doc.pageContent)
      .join('\n\n');

    const prompt = `Based on this codebase context:

${context}

Answer this question: ${question}

Be specific and reference the code when relevant.`;

    const response = await this.llm.invoke(prompt);
    return response.content as string;
  }
}

// ============================================
// 4. Example Usage
// ============================================

async function exampleRAGUsage() {
  const loader = new TestCodebaseLoader();
  const ragGenerator = new TestGeneratorRAG();

  // Load existing test files
  const testFiles: TestDocument[] = [
    {
      content: `
        import { test, expect } from '@playwright/test';
        import { LoginPage } from './pages/LoginPage';

        test('should login successfully', async ({ page }) => {
          const loginPage = new LoginPage(page);
          await loginPage.goto();
          await loginPage.login('user@example.com', 'password');
          await expect(page).toHaveURL('/dashboard');
        });
      `,
      metadata: { filename: 'login.spec.ts', type: 'test' },
    },
    {
      content: `
        import { Page, Locator } from '@playwright/test';

        export class LoginPage {
          readonly emailInput: Locator;
          readonly passwordInput: Locator;
          readonly submitButton: Locator;

          constructor(private page: Page) {
            this.emailInput = page.getByLabel('Email');
            this.passwordInput = page.getByLabel('Password');
            this.submitButton = page.getByRole('button', { name: 'Sign In' });
          }

          async goto() { await this.page.goto('/login'); }
          async login(email: string, password: string) {
            await this.emailInput.fill(email);
            await this.passwordInput.fill(password);
            await this.submitButton.click();
          }
        }
      `,
      metadata: { filename: 'LoginPage.ts', type: 'page-object' },
    },
  ];

  // Index documents
  const documents = await loader.loadMultipleFiles(testFiles);
  await ragGenerator.initialize(documents);

  // Generate new test based on existing patterns
  const newTest = await ragGenerator.generateTest(
    'Test user registration with email, password, and confirm password fields'
  );
  console.log('Generated Test:\n', newTest);

  // Ask questions about the codebase
  const answer = await ragGenerator.answerQuestion(
    'How do I create a new page object in this project?'
  );
  console.log('Answer:\n', answer);
}

/**
 * EXERCISE:
 * 1. Index your entire test codebase
 * 2. Generate tests for new features using RAG
 * 3. Build a Q&A bot for your test framework
 * 4. Implement test fix suggestions using RAG
 * 5. Add metadata filtering (only search tests, only page objects)
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: What is RAG and why use it for test automation?
 * A1: RAG retrieves relevant context from your codebase before
 *     generating responses. This ensures AI-generated tests follow
 *     your existing patterns and conventions.
 *
 * Q2: How do you choose chunk size for test code?
 * A2: For code, use 500-1500 characters with 100-200 overlap.
 *     This keeps functions/classes together while allowing
 *     enough context for the LLM.
 */

/**
 * LEARNING:
 * - RAG provides context-aware AI responses
 * - Embeddings convert code to searchable vectors
 * - Chunk size affects retrieval quality
 * - Metadata helps filter relevant documents
 *
 * ONE LINER:
 * "RAG: Give your AI the context it needs to write better tests."
 */

export { TestCodebaseLoader, TestKnowledgeBase, TestGeneratorRAG };
