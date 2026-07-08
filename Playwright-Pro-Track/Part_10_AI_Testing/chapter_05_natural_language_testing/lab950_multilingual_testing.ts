/**
 * Lab 950: Multilingual Test Generation
 *
 * CONCEPT:
 * AI can understand test descriptions in multiple languages and generate
 * tests accordingly. This enables global teams to write tests in their
 * native language while producing consistent code.
 *
 * BULLET POINTS:
 * - Write tests in any language
 * - AI translates to code
 * - Support global teams
 * - Consistent output regardless of input language
 * - Localization testing support
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Multilingual test descriptions
const testDescriptions = {
  english: 'Test that user can login with valid credentials',
  spanish: 'Probar que el usuario puede iniciar sesión con credenciales válidas',
  french: "Tester que l'utilisateur peut se connecter avec des identifiants valides",
  german: 'Testen, dass der Benutzer sich mit gültigen Anmeldedaten anmelden kann',
  japanese: '有効な認証情報でユーザーがログインできることをテストする',
  chinese: '测试用户可以使用有效凭据登录',
};

// Example 2: Language detection and translation
interface LanguageDetection {
  language: string;
  confidence: number;
}

function detectLanguage(text: string): LanguageDetection {
  const patterns: { lang: string; chars: RegExp }[] = [
    { lang: 'japanese', chars: /[\u3040-\u309F\u30A0-\u30FF]/ },
    { lang: 'chinese', chars: /[\u4E00-\u9FFF]/ },
    { lang: 'korean', chars: /[\uAC00-\uD7AF]/ },
    { lang: 'russian', chars: /[\u0400-\u04FF]/ },
    { lang: 'arabic', chars: /[\u0600-\u06FF]/ },
  ];

  for (const { lang, chars } of patterns) {
    if (chars.test(text)) {
      return { language: lang, confidence: 0.9 };
    }
  }

  // Check for Spanish/French/German specific characters
  if (/[áéíóúñ¿¡]/i.test(text)) return { language: 'spanish', confidence: 0.8 };
  if (/[àâçéèêëîïôùûü]/i.test(text)) return { language: 'french', confidence: 0.8 };
  if (/[äöüß]/i.test(text)) return { language: 'german', confidence: 0.8 };

  return { language: 'english', confidence: 0.7 };
}

// Example 3: Keyword mapping for multiple languages
const actionKeywords: Record<string, Record<string, string[]>> = {
  click: {
    english: ['click', 'press', 'tap'],
    spanish: ['clic', 'pulsar', 'presionar'],
    french: ['cliquer', 'appuyer'],
    german: ['klicken', 'drücken'],
  },
  fill: {
    english: ['enter', 'type', 'fill', 'input'],
    spanish: ['ingresar', 'escribir', 'rellenar'],
    french: ['entrer', 'saisir', 'remplir'],
    german: ['eingeben', 'ausfüllen'],
  },
  verify: {
    english: ['verify', 'check', 'should see', 'expect'],
    spanish: ['verificar', 'comprobar', 'debería ver'],
    french: ['vérifier', 'devrait voir'],
    german: ['überprüfen', 'sollte sehen'],
  },
};

function findAction(text: string): string | null {
  const textLower = text.toLowerCase();

  for (const [action, translations] of Object.entries(actionKeywords)) {
    for (const keywords of Object.values(translations)) {
      if (keywords.some((kw) => textLower.includes(kw))) {
        return action;
      }
    }
  }

  return null;
}

// Example 4: Localization testing
interface LocaleTestConfig {
  locale: string;
  language: string;
  expectedTexts: Record<string, string>;
}

const localeConfigs: LocaleTestConfig[] = [
  {
    locale: 'en-US',
    language: 'English',
    expectedTexts: { loginButton: 'Log in', welcomeMessage: 'Welcome' },
  },
  {
    locale: 'es-ES',
    language: 'Spanish',
    expectedTexts: { loginButton: 'Iniciar sesión', welcomeMessage: 'Bienvenido' },
  },
  {
    locale: 'fr-FR',
    language: 'French',
    expectedTexts: { loginButton: 'Se connecter', welcomeMessage: 'Bienvenue' },
  },
];

// Example 5: Generate localization tests
test.describe('Localization Tests', () => {
  for (const config of localeConfigs) {
    test(`UI displays correctly in ${config.language}`, async ({ page }) => {
      // Set locale
      await page.goto(`/?locale=${config.locale}`);

      // Verify localized text
      for (const [element, expectedText] of Object.entries(config.expectedTexts)) {
        await expect(page.locator(`[data-testid="${element}"]`)).toContainText(
          expectedText
        );
      }
    });
  }
});

// Example 6: Multilingual test generator
function generateMultilingualTest(description: string): string {
  const detected = detectLanguage(description);
  const action = findAction(description);

  console.log(`Detected language: ${detected.language} (${detected.confidence * 100}%)`);
  console.log(`Detected action: ${action}`);

  // Generate test in English regardless of input language
  return `
test('${description}', async ({ page }) => {
  // Original description (${detected.language}): ${description}
  // TODO: Implement test based on detected intent
});`;
}

/**
 * EXERCISE:
 * 1. Write a test description in your language
 * 2. Detect the language automatically
 * 3. Generate the test code
 * 4. Create localization tests
 *
 * LEARNING:
 * - AI understands multiple languages
 * - Global teams can contribute
 * - Localization testing is essential
 * - Consistent code from any language
 *
 * ONE LINER:
 * "Write tests in your language - AI speaks code fluently in all of them."
 */

export { detectLanguage, findAction, generateMultilingualTest, localeConfigs };

