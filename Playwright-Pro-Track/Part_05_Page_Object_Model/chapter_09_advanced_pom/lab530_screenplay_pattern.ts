/**
 * Lab 530: Screenplay Pattern
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing screenplay pattern:
 * 
 * - Actors
 * - Tasks
 * - Questions
 * - Abilities
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create actors
 * 2. Define tasks
 * 3. Implement questions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, expect } from '@playwright/test';

// Solution 1: Ability Interface
interface Ability {
    name: string;
}

class BrowseTheWeb implements Ability {
    name = 'BrowseTheWeb';
    
    constructor(readonly page: Page) {}
    
    static using(page: Page): BrowseTheWeb {
        return new BrowseTheWeb(page);
    }
}

// Solution 2: Actor
class Actor {
    private abilities: Map<string, Ability> = new Map();
    
    constructor(readonly name: string) {}
    
    static named(name: string): Actor {
        return new Actor(name);
    }
    
    whoCan(...abilities: Ability[]): this {
        for (const ability of abilities) {
            this.abilities.set(ability.name, ability);
        }
        return this;
    }
    
    abilityTo<T extends Ability>(abilityType: string): T {
        const ability = this.abilities.get(abilityType);
        if (!ability) {
            throw new Error(`Actor ${this.name} doesn't have ability ${abilityType}`);
        }
        return ability as T;
    }
    
    async attemptsTo(...tasks: Task[]): Promise<void> {
        for (const task of tasks) {
            await task.performAs(this);
        }
    }
    
    async asks<T>(question: Question<T>): Promise<T> {
        return await question.answeredBy(this);
    }
}

// Solution 3: Task Interface
interface Task {
    performAs(actor: Actor): Promise<void>;
}

// Solution 4: Concrete Tasks
class Navigate implements Task {
    constructor(private url: string) {}
    
    static to(url: string): Navigate {
        return new Navigate(url);
    }
    
    async performAs(actor: Actor): Promise<void> {
        const browse = actor.abilityTo<BrowseTheWeb>('BrowseTheWeb');
        await browse.page.goto(this.url);
    }
}

class Login implements Task {
    constructor(private username: string, private password: string) {}
    
    static withCredentials(username: string, password: string): Login {
        return new Login(username, password);
    }
    
    async performAs(actor: Actor): Promise<void> {
        const browse = actor.abilityTo<BrowseTheWeb>('BrowseTheWeb');
        await browse.page.fill('#username', this.username);
        await browse.page.fill('#password', this.password);
        await browse.page.click('button[type="submit"]');
    }
}

class Click implements Task {
    constructor(private selector: string) {}
    
    static on(selector: string): Click {
        return new Click(selector);
    }
    
    async performAs(actor: Actor): Promise<void> {
        const browse = actor.abilityTo<BrowseTheWeb>('BrowseTheWeb');
        await browse.page.click(this.selector);
    }
}

class Fill implements Task {
    constructor(private selector: string, private value: string) {}
    
    static field(selector: string): { with: (value: string) => Fill } {
        return {
            with: (value: string) => new Fill(selector, value),
        };
    }
    
    async performAs(actor: Actor): Promise<void> {
        const browse = actor.abilityTo<BrowseTheWeb>('BrowseTheWeb');
        await browse.page.fill(this.selector, this.value);
    }
}

// Solution 5: Question Interface
interface Question<T> {
    answeredBy(actor: Actor): Promise<T>;
}

// Solution 6: Concrete Questions
class Text implements Question<string | null> {
    constructor(private selector: string) {}
    
    static of(selector: string): Text {
        return new Text(selector);
    }
    
    async answeredBy(actor: Actor): Promise<string | null> {
        const browse = actor.abilityTo<BrowseTheWeb>('BrowseTheWeb');
        return await browse.page.locator(this.selector).textContent();
    }
}

class Visibility implements Question<boolean> {
    constructor(private selector: string) {}
    
    static of(selector: string): Visibility {
        return new Visibility(selector);
    }
    
    async answeredBy(actor: Actor): Promise<boolean> {
        const browse = actor.abilityTo<BrowseTheWeb>('BrowseTheWeb');
        return await browse.page.locator(this.selector).isVisible();
    }
}

// Solution 7: Usage Example
async function screenplayExample(page: Page) {
    const john = Actor.named('John')
        .whoCan(BrowseTheWeb.using(page));
    
    await john.attemptsTo(
        Navigate.to('/login'),
        Login.withCredentials('john', 'password123')
    );
    
    const welcomeText = await john.asks(Text.of('.welcome'));
    const isLoggedIn = await john.asks(Visibility.of('.user-menu'));
}

// Solution 8: Export
export {
    Actor,
    BrowseTheWeb,
    Navigate,
    Login,
    Click,
    Fill,
    Text,
    Visibility,
    Task,
    Question,
    Ability,
};

