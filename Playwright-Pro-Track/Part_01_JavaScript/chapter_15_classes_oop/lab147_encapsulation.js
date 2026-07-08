/**
 * Lab 147: Encapsulation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Encapsulation principles:
 * 
 * - Data hiding
 * - Public interface
 * - Information hiding
 * - Controlled access
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Hide internal state
 * 2. Expose public API
 * 3. Control data access
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Encapsulation
console.log("--- Basic Encapsulation ---");

class BankAccount {
    #balance;
    #transactions = [];
    
    constructor(initialBalance = 0) {
        this.#balance = initialBalance;
        this.#logTransaction("OPEN", initialBalance);
    }
    
    #logTransaction(type, amount) {
        this.#transactions.push({
            type,
            amount,
            balance: this.#balance,
            timestamp: new Date()
        });
    }
    
    deposit(amount) {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive");
        }
        this.#balance += amount;
        this.#logTransaction("DEPOSIT", amount);
        return this.#balance;
    }
    
    withdraw(amount) {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be positive");
        }
        if (amount > this.#balance) {
            throw new Error("Insufficient funds");
        }
        this.#balance -= amount;
        this.#logTransaction("WITHDRAW", amount);
        return amount;
    }
    
    getBalance() {
        return this.#balance;
    }
    
    getStatement() {
        return this.#transactions.map(t => 
            `${t.type}: $${t.amount} (Balance: $${t.balance})`
        );
    }
}

const account = new BankAccount(1000);
account.deposit(500);
account.withdraw(200);
console.log("Balance:", account.getBalance());
console.log("Statement:", account.getStatement());

// Solution 2: Module Pattern (Closure)
console.log("\n--- Module Pattern ---");

const Counter = (function() {
    let count = 0; // Private
    
    return {
        increment() {
            return ++count;
        },
        decrement() {
            return --count;
        },
        getCount() {
            return count;
        },
        reset() {
            count = 0;
            return count;
        }
    };
})();

console.log("Increment:", Counter.increment());
console.log("Increment:", Counter.increment());
console.log("Count:", Counter.getCount());
// console.log(Counter.count); // undefined - private

// Solution 3: Factory with Encapsulation
console.log("\n--- Factory Pattern ---");

function createUser(name, email) {
    // Private state
    let password = null;
    const createdAt = new Date();
    
    // Public interface
    return {
        getName() { return name; },
        getEmail() { return email; },
        getCreatedAt() { return createdAt; },
        
        setPassword(pwd) {
            if (pwd.length < 8) {
                throw new Error("Password too short");
            }
            password = pwd;
        },
        
        validatePassword(pwd) {
            return password === pwd;
        },
        
        updateEmail(newEmail) {
            if (!newEmail.includes("@")) {
                throw new Error("Invalid email");
            }
            email = newEmail;
        }
    };
}

const user = createUser("John", "john@example.com");
user.setPassword("securepass123");
console.log("Name:", user.getName());
console.log("Valid password:", user.validatePassword("securepass123"));

// Solution 4: Immutable Objects
console.log("\n--- Immutable Objects ---");

class ImmutablePoint {
    #x;
    #y;
    
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
        Object.freeze(this);
    }
    
    get x() { return this.#x; }
    get y() { return this.#y; }
    
    // Returns new instance instead of modifying
    move(dx, dy) {
        return new ImmutablePoint(this.#x + dx, this.#y + dy);
    }
    
    scale(factor) {
        return new ImmutablePoint(this.#x * factor, this.#y * factor);
    }
    
    toString() {
        return `(${this.#x}, ${this.#y})`;
    }
}

const p1 = new ImmutablePoint(3, 4);
const p2 = p1.move(1, 2);
console.log("Original:", p1.toString());
console.log("Moved:", p2.toString());

// Solution 5: Controlled Property Access
console.log("\n--- Controlled Access ---");

class Configuration {
    #settings = {};
    #locked = false;
    
    set(key, value) {
        if (this.#locked) {
            throw new Error("Configuration is locked");
        }
        this.#settings[key] = value;
        return this;
    }
    
    get(key) {
        return this.#settings[key];
    }
    
    lock() {
        this.#locked = true;
        return this;
    }
    
    isLocked() {
        return this.#locked;
    }
    
    getAll() {
        return { ...this.#settings }; // Return copy
    }
}

const config = new Configuration();
config.set("debug", true).set("port", 3000).lock();
console.log("Config:", config.getAll());
console.log("Locked:", config.isLocked());

// Solution 6: Proxy for Encapsulation
console.log("\n--- Proxy Encapsulation ---");

function createSecureObject(target, allowedProps) {
    return new Proxy(target, {
        get(obj, prop) {
            if (!allowedProps.includes(prop)) {
                throw new Error(`Access denied to property: ${prop}`);
            }
            return obj[prop];
        },
        set(obj, prop, value) {
            if (!allowedProps.includes(prop)) {
                throw new Error(`Cannot set property: ${prop}`);
            }
            obj[prop] = value;
            return true;
        }
    });
}

const data = { name: "John", secret: "hidden", age: 30 };
const secure = createSecureObject(data, ["name", "age"]);

console.log("Name:", secure.name);
console.log("Age:", secure.age);
// console.log(secure.secret); // Error: Access denied

// Solution 7: State Machine Encapsulation
console.log("\n--- State Machine ---");

class OrderStateMachine {
    #state = "pending";
    #history = [];
    
    #validTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: []
    };
    
    #canTransition(newState) {
        return this.#validTransitions[this.#state].includes(newState);
    }
    
    #transition(newState) {
        if (!this.#canTransition(newState)) {
            throw new Error(`Cannot transition from ${this.#state} to ${newState}`);
        }
        this.#history.push({ from: this.#state, to: newState, at: new Date() });
        this.#state = newState;
    }
    
    confirm() { this.#transition("confirmed"); return this; }
    ship() { this.#transition("shipped"); return this; }
    deliver() { this.#transition("delivered"); return this; }
    cancel() { this.#transition("cancelled"); return this; }
    
    getState() { return this.#state; }
    getHistory() { return [...this.#history]; }
}

const order = new OrderStateMachine();
order.confirm().ship().deliver();
console.log("State:", order.getState());
console.log("History:", order.getHistory().map(h => `${h.from} -> ${h.to}`));

