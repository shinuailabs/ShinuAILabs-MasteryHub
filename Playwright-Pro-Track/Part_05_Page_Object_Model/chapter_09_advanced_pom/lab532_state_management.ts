/**
 * Lab 532: State Management
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing page state:
 * 
 * - Page state tracking
 * - State transitions
 * - State validation
 * - State persistence
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Track page state
 * 2. Handle transitions
 * 3. Validate state
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, expect } from '@playwright/test';

// Solution 1: Page State Enum
enum PageState {
    LOADING = 'loading',
    READY = 'ready',
    ERROR = 'error',
    SUBMITTING = 'submitting',
}

// Solution 2: Stateful Page
class StatefulPage {
    private currentState: PageState = PageState.LOADING;
    
    constructor(readonly page: Page) {}
    
    async waitForReady() {
        await this.page.waitForLoadState('networkidle');
        this.currentState = PageState.READY;
    }
    
    getState(): PageState {
        return this.currentState;
    }
    
    isReady(): boolean {
        return this.currentState === PageState.READY;
    }
    
    protected setState(state: PageState) {
        this.currentState = state;
    }
}

// Solution 3: Form with State
class StatefulFormPage extends StatefulPage {
    async fillForm(data: Record<string, string>) {
        for (const [name, value] of Object.entries(data)) {
            await this.page.fill(`[name="${name}"]`, value);
        }
    }
    
    async submit() {
        this.setState(PageState.SUBMITTING);
        await this.page.click('button[type="submit"]');
        
        // Wait for response
        try {
            await this.page.waitForSelector('.success', { timeout: 5000 });
            this.setState(PageState.READY);
        } catch {
            this.setState(PageState.ERROR);
        }
    }
    
    async getErrorMessage() {
        if (this.getState() === PageState.ERROR) {
            return await this.page.locator('.error').textContent();
        }
        return null;
    }
}

// Solution 4: State Machine
interface StateTransition {
    from: PageState;
    to: PageState;
    action: string;
}

class PageStateMachine {
    private state: PageState;
    private transitions: StateTransition[] = [];
    
    constructor(initialState: PageState) {
        this.state = initialState;
    }
    
    addTransition(from: PageState, to: PageState, action: string) {
        this.transitions.push({ from, to, action });
    }
    
    canTransition(action: string): boolean {
        return this.transitions.some(t => t.from === this.state && t.action === action);
    }
    
    transition(action: string): boolean {
        const transition = this.transitions.find(
            t => t.from === this.state && t.action === action
        );
        
        if (transition) {
            this.state = transition.to;
            return true;
        }
        return false;
    }
    
    getState(): PageState {
        return this.state;
    }
}

// Solution 5: Checkout Flow State
enum CheckoutState {
    CART = 'cart',
    SHIPPING = 'shipping',
    PAYMENT = 'payment',
    REVIEW = 'review',
    COMPLETE = 'complete',
}

class CheckoutFlow {
    private state: CheckoutState = CheckoutState.CART;
    
    constructor(readonly page: Page) {}
    
    getState(): CheckoutState {
        return this.state;
    }
    
    async proceedToShipping() {
        if (this.state !== CheckoutState.CART) {
            throw new Error('Can only proceed to shipping from cart');
        }
        await this.page.click('#proceed-to-shipping');
        this.state = CheckoutState.SHIPPING;
    }
    
    async proceedToPayment() {
        if (this.state !== CheckoutState.SHIPPING) {
            throw new Error('Can only proceed to payment from shipping');
        }
        await this.page.click('#proceed-to-payment');
        this.state = CheckoutState.PAYMENT;
    }
    
    async proceedToReview() {
        if (this.state !== CheckoutState.PAYMENT) {
            throw new Error('Can only proceed to review from payment');
        }
        await this.page.click('#proceed-to-review');
        this.state = CheckoutState.REVIEW;
    }
    
    async placeOrder() {
        if (this.state !== CheckoutState.REVIEW) {
            throw new Error('Can only place order from review');
        }
        await this.page.click('#place-order');
        this.state = CheckoutState.COMPLETE;
    }
}

// Solution 6: State Persistence
class PersistentState {
    constructor(private page: Page) {}
    
    async saveState(key: string, value: unknown) {
        await this.page.evaluate(([k, v]) => {
            localStorage.setItem(k, JSON.stringify(v));
        }, [key, value]);
    }
    
    async loadState<T>(key: string): Promise<T | null> {
        return await this.page.evaluate((k) => {
            const value = localStorage.getItem(k);
            return value ? JSON.parse(value) : null;
        }, key);
    }
    
    async clearState(key: string) {
        await this.page.evaluate((k) => {
            localStorage.removeItem(k);
        }, key);
    }
}

// Solution 7: Export
export {
    PageState,
    StatefulPage,
    StatefulFormPage,
    PageStateMachine,
    CheckoutState,
    CheckoutFlow,
    PersistentState,
};

