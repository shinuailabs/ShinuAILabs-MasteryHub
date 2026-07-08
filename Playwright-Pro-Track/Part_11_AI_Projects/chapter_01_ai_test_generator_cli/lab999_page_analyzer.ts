/**
 * Lab 999: AI Test Generator CLI - Page Analyzer
 *
 * CONCEPT:
 * The Page Analyzer uses Playwright to crawl a webpage and extract all
 * interactive elements, forms, and navigation patterns. This data is then
 * used by the AI to generate meaningful test cases.
 *
 * BULLET POINTS:
 * - Headless browser automation for page analysis
 * - DOM traversal and element extraction
 * - Form detection and input identification
 * - Navigation pattern recognition
 * - Accessibility attribute extraction
 */

import { chromium, Page, Browser, ElementHandle } from 'playwright';

interface PageElement {
  type: 'button' | 'input' | 'link' | 'select' | 'textarea' | 'form';
  selector: string;
  text?: string;
  attributes: Record<string, string>;
  role?: string;
  label?: string;
}

interface PageAnalysis {
  url: string;
  title: string;
  elements: PageElement[];
  forms: FormAnalysis[];
  navigation: NavigationItem[];
  metadata: PageMetadata;
}

interface FormAnalysis {
  selector: string;
  action?: string;
  method?: string;
  inputs: PageElement[];
  submitButton?: PageElement;
}

interface NavigationItem {
  text: string;
  href: string;
  selector: string;
}

interface PageMetadata {
  hasLogin: boolean;
  hasSearch: boolean;
  hasCart: boolean;
  pageType: 'landing' | 'form' | 'list' | 'detail' | 'checkout' | 'unknown';
}

class PageAnalyzer {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  async analyze(url: string): Promise<PageAnalysis> {
    if (!this.page) throw new Error('Analyzer not initialized');

    await this.page.goto(url, { waitUntil: 'networkidle' });

    const [title, elements, forms, navigation] = await Promise.all([
      this.page.title(),
      this.extractElements(),
      this.extractForms(),
      this.extractNavigation()
    ]);

    const metadata = this.analyzePageType(elements, forms);

    return { url, title, elements, forms, navigation, metadata };
  }

  private async extractElements(): Promise<PageElement[]> {
    if (!this.page) return [];

    return this.page.evaluate(() => {
      const elements: PageElement[] = [];
      
      // Extract buttons
      document.querySelectorAll('button, [role="button"], input[type="submit"]').forEach((el) => {
        elements.push({
          type: 'button',
          selector: generateSelector(el),
          text: el.textContent?.trim() || '',
          attributes: getAttributes(el),
          role: el.getAttribute('role') || undefined
        });
      });

      // Extract inputs
      document.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach((el) => {
        const input = el as HTMLInputElement;
        elements.push({
          type: input.tagName.toLowerCase() as 'input' | 'textarea' | 'select',
          selector: generateSelector(el),
          attributes: getAttributes(el),
          label: findLabel(el)
        });
      });

      // Extract links
      document.querySelectorAll('a[href]').forEach((el) => {
        elements.push({
          type: 'link',
          selector: generateSelector(el),
          text: el.textContent?.trim() || '',
          attributes: getAttributes(el)
        });
      });

      function generateSelector(el: Element): string {
        if (el.id) return `#${el.id}`;
        if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
        if (el.getAttribute('name')) return `[name="${el.getAttribute('name')}"]`;
        return el.tagName.toLowerCase();
      }

      function getAttributes(el: Element): Record<string, string> {
        const attrs: Record<string, string> = {};
        ['id', 'name', 'type', 'placeholder', 'aria-label', 'data-testid'].forEach(attr => {
          const value = el.getAttribute(attr);
          if (value) attrs[attr] = value;
        });
        return attrs;
      }

      function findLabel(el: Element): string | undefined {
        const id = el.getAttribute('id');
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (label) return label.textContent?.trim();
        }
        return el.getAttribute('aria-label') || el.getAttribute('placeholder');
      }

      return elements;
    });
  }

  private async extractForms(): Promise<FormAnalysis[]> {
    // Implementation continues in next section
    return [];
  }

  private async extractNavigation(): Promise<NavigationItem[]> {
    // Implementation continues in next section
    return [];
  }

  private analyzePageType(elements: PageElement[], forms: FormAnalysis[]): PageMetadata {
    const hasLogin = elements.some(e => 
      e.attributes.type === 'password' || 
      e.text?.toLowerCase().includes('login')
    );
    const hasSearch = elements.some(e => 
      e.attributes.type === 'search' || 
      e.attributes.placeholder?.toLowerCase().includes('search')
    );
    const hasCart = elements.some(e => 
      e.text?.toLowerCase().includes('cart') || 
      e.selector.includes('cart')
    );

    return { hasLogin, hasSearch, hasCart, pageType: 'unknown' };
  }

  async close(): Promise<void> {
    await this.browser?.close();
  }
}

/**
 * EXERCISE:
 * 1. Complete the extractForms method
 * 2. Complete the extractNavigation method
 * 3. Improve pageType detection logic
 * 4. Add screenshot capture for visual reference
 */

/**
 * LEARNING:
 * - Page analysis provides context for AI test generation
 * - Multiple selector strategies ensure robust element identification
 * - Metadata helps categorize pages for appropriate test patterns
 *
 * ONE LINER:
 * "Understanding the page structure is the first step to testing it effectively."
 */

export { PageAnalyzer, PageAnalysis, PageElement, FormAnalysis };

