/**
 * Lab 1007: Self-Healing Framework - Introduction
 *
 * CONCEPT:
 * Self-healing tests automatically recover from locator failures by using
 * AI to find alternative selectors when the original ones break.
 *
 * BULLET POINTS:
 * - What is self-healing in test automation
 * - Why locators break and how to detect failures
 * - ML-based locator recovery strategies
 * - Healing vs failing: when to use each
 * - Integration with existing test frameworks
 */

import { Page, Locator } from 'playwright';

interface HealingResult {
  healed: boolean;
  originalSelector: string;
  newSelector: string;
  confidence: number;
  method: 'attribute' | 'text' | 'position' | 'ai';
}

interface ElementFingerprint {
  tagName: string;
  text: string;
  attributes: Record<string, string>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  xpath: string;
  cssPath: string;
}

class SelfHealingLocator {
  private page: Page;
  private fingerprints: Map<string, ElementFingerprint> = new Map();
  private healingHistory: HealingResult[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  // Store element fingerprint for future healing
  async captureFingerprint(selector: string, name: string): Promise<void> {
    const element = await this.page.locator(selector).first();
    
    const fingerprint = await element.evaluate((el): ElementFingerprint => {
      const rect = el.getBoundingClientRect();
      const attrs: Record<string, string> = {};
      
      Array.from(el.attributes).forEach(attr => {
        attrs[attr.name] = attr.value;
      });

      return {
        tagName: el.tagName.toLowerCase(),
        text: el.textContent?.trim() || '',
        attributes: attrs,
        position: { x: rect.x, y: rect.y },
        size: { width: rect.width, height: rect.height },
        xpath: getXPath(el),
        cssPath: getCssPath(el)
      };

      function getXPath(element: Element): string {
        if (element.id) return `//*[@id="${element.id}"]`;
        const parts: string[] = [];
        let current: Element | null = element;
        while (current && current.nodeType === Node.ELEMENT_NODE) {
          let index = 1;
          let sibling = current.previousElementSibling;
          while (sibling) {
            if (sibling.tagName === current.tagName) index++;
            sibling = sibling.previousElementSibling;
          }
          parts.unshift(`${current.tagName.toLowerCase()}[${index}]`);
          current = current.parentElement;
        }
        return '/' + parts.join('/');
      }

      function getCssPath(element: Element): string {
        const parts: string[] = [];
        let current: Element | null = element;
        while (current && current.nodeType === Node.ELEMENT_NODE) {
          let selector = current.tagName.toLowerCase();
          if (current.id) {
            selector = `#${current.id}`;
            parts.unshift(selector);
            break;
          }
          if (current.className) {
            selector += '.' + current.className.trim().split(/\s+/).join('.');
          }
          parts.unshift(selector);
          current = current.parentElement;
        }
        return parts.join(' > ');
      }
    });

    this.fingerprints.set(name, fingerprint);
  }

  // Try to locate element, heal if necessary
  async locate(selector: string, name: string): Promise<Locator> {
    try {
      const locator = this.page.locator(selector);
      await locator.waitFor({ timeout: 5000 });
      return locator;
    } catch {
      console.log(`⚠️ Selector failed: ${selector}`);
      return this.heal(selector, name);
    }
  }

  private async heal(originalSelector: string, name: string): Promise<Locator> {
    const fingerprint = this.fingerprints.get(name);
    if (!fingerprint) {
      throw new Error(`No fingerprint found for ${name}`);
    }

    // Try healing strategies in order
    const strategies = [
      () => this.healByAttribute(fingerprint),
      () => this.healByText(fingerprint),
      () => this.healByPosition(fingerprint)
    ];

    for (const strategy of strategies) {
      const result = await strategy();
      if (result) {
        this.healingHistory.push({
          healed: true,
          originalSelector,
          newSelector: result,
          confidence: 0.8,
          method: 'attribute'
        });
        console.log(`✅ Healed: ${originalSelector} -> ${result}`);
        return this.page.locator(result);
      }
    }

    throw new Error(`Could not heal selector: ${originalSelector}`);
  }

  private async healByAttribute(fp: ElementFingerprint): Promise<string | null> {
    const attrs = ['data-testid', 'name', 'aria-label', 'placeholder'];
    for (const attr of attrs) {
      if (fp.attributes[attr]) {
        const selector = `[${attr}="${fp.attributes[attr]}"]`;
        if (await this.selectorExists(selector)) return selector;
      }
    }
    return null;
  }

  private async healByText(fp: ElementFingerprint): Promise<string | null> {
    if (fp.text) {
      const selector = `${fp.tagName}:has-text("${fp.text.slice(0, 50)}")`;
      if (await this.selectorExists(selector)) return selector;
    }
    return null;
  }

  private async healByPosition(fp: ElementFingerprint): Promise<string | null> {
    // Find elements at similar position
    return null; // Simplified for this lab
  }

  private async selectorExists(selector: string): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  getHealingReport(): HealingResult[] {
    return this.healingHistory;
  }
}

/**
 * EXERCISE:
 * 1. Implement position-based healing
 * 2. Add AI-powered healing using LLMs
 * 3. Create a healing confidence threshold
 * 4. Build a healing report dashboard
 */

/**
 * LEARNING:
 * - Self-healing reduces test maintenance
 * - Multiple strategies increase healing success
 * - Fingerprints capture element identity
 *
 * ONE LINER:
 * "Self-healing tests adapt to change instead of breaking."
 */

export { SelfHealingLocator, HealingResult, ElementFingerprint };
