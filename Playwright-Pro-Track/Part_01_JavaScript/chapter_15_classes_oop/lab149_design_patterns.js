/**
 * Lab 149: Design Patterns
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Common OOP design patterns:
 * 
 * - Singleton
 * - Factory
 * - Observer
 * - Decorator
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement design patterns
 * 2. Understand use cases
 * 3. Apply patterns correctly
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Singleton Pattern
console.log("--- Singleton Pattern ---");

class Database {
    static #instance = null;
    
    constructor() {
        if (Database.#instance) {
            return Database.#instance;
        }
        this.connection = "Connected";
        Database.#instance = this;
    }
    
    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }
        return Database.#instance;
    }
    
    query(sql) {
        return `Executing: ${sql}`;
    }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log("Same instance:", db1 === db2);

// Solution 2: Factory Pattern
console.log("\n--- Factory Pattern ---");

class Animal {
    speak() { return "Some sound"; }
}

class Dog extends Animal {
    speak() { return "Woof!"; }
}

class Cat extends Animal {
    speak() { return "Meow!"; }
}

class Bird extends Animal {
    speak() { return "Tweet!"; }
}

class AnimalFactory {
    static create(type) {
        const animals = { dog: Dog, cat: Cat, bird: Bird };
        const AnimalClass = animals[type.toLowerCase()];
        
        if (!AnimalClass) {
            throw new Error(`Unknown animal type: ${type}`);
        }
        
        return new AnimalClass();
    }
}

const dog = AnimalFactory.create("dog");
const cat = AnimalFactory.create("cat");
console.log("Dog:", dog.speak());
console.log("Cat:", cat.speak());

// Solution 3: Observer Pattern
console.log("\n--- Observer Pattern ---");

class EventEmitter {
    #listeners = new Map();
    
    on(event, callback) {
        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, []);
        }
        this.#listeners.get(event).push(callback);
        return () => this.off(event, callback);
    }
    
    off(event, callback) {
        const callbacks = this.#listeners.get(event) || [];
        this.#listeners.set(event, callbacks.filter(cb => cb !== callback));
    }
    
    emit(event, ...args) {
        const callbacks = this.#listeners.get(event) || [];
        callbacks.forEach(cb => cb(...args));
    }
}

const emitter = new EventEmitter();
const unsubscribe = emitter.on("message", (msg) => console.log("Received:", msg));
emitter.emit("message", "Hello!");
unsubscribe();
emitter.emit("message", "This won't be logged");

// Solution 4: Decorator Pattern
console.log("\n--- Decorator Pattern ---");

class Coffee {
    cost() { return 5; }
    description() { return "Coffee"; }
}

class MilkDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }
    cost() { return this.coffee.cost() + 1; }
    description() { return `${this.coffee.description()} + Milk`; }
}

class SugarDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }
    cost() { return this.coffee.cost() + 0.5; }
    description() { return `${this.coffee.description()} + Sugar`; }
}

let myCoffee = new Coffee();
myCoffee = new MilkDecorator(myCoffee);
myCoffee = new SugarDecorator(myCoffee);
console.log("Order:", myCoffee.description());
console.log("Cost:", myCoffee.cost());

// Solution 5: Strategy Pattern
console.log("\n--- Strategy Pattern ---");

class PaymentContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    pay(amount) {
        return this.strategy.pay(amount);
    }
}

const creditCard = { pay: (amount) => `Paid $${amount} with Credit Card` };
const paypal = { pay: (amount) => `Paid $${amount} with PayPal` };

const payment = new PaymentContext(creditCard);
console.log(payment.pay(100));
payment.setStrategy(paypal);
console.log(payment.pay(50));

// Solution 6: Builder Pattern
console.log("\n--- Builder Pattern ---");

class QueryBuilder {
    #query = { select: "*", from: "", where: [], orderBy: "" };
    
    select(fields) { this.#query.select = fields; return this; }
    from(table) { this.#query.from = table; return this; }
    where(condition) { this.#query.where.push(condition); return this; }
    orderBy(field) { this.#query.orderBy = field; return this; }
    
    build() {
        let sql = `SELECT ${this.#query.select} FROM ${this.#query.from}`;
        if (this.#query.where.length) {
            sql += ` WHERE ${this.#query.where.join(" AND ")}`;
        }
        if (this.#query.orderBy) {
            sql += ` ORDER BY ${this.#query.orderBy}`;
        }
        return sql;
    }
}

const query = new QueryBuilder()
    .select("name, email")
    .from("users")
    .where("active = true")
    .where("age > 18")
    .orderBy("name")
    .build();

console.log("Query:", query);

// Solution 7: Adapter Pattern
console.log("\n--- Adapter Pattern ---");

// Old interface
class OldAPI {
    getUsers() { return [{ name: "John" }]; }
}

// New interface expected
class NewAPIAdapter {
    constructor(oldAPI) {
        this.oldAPI = oldAPI;
    }
    
    fetchUsers() {
        const users = this.oldAPI.getUsers();
        return Promise.resolve({ data: users, status: 200 });
    }
}

const oldAPI = new OldAPI();
const adapter = new NewAPIAdapter(oldAPI);
adapter.fetchUsers().then(res => console.log("Adapted:", res));

// Solution 8: Proxy Pattern
console.log("\n--- Proxy Pattern ---");

class ExpensiveObject {
    constructor() {
        console.log("Creating expensive object...");
        this.data = "Expensive data";
    }
    
    getData() { return this.data; }
}

class LazyProxy {
    #instance = null;
    
    getData() {
        if (!this.#instance) {
            this.#instance = new ExpensiveObject();
        }
        return this.#instance.getData();
    }
}

const proxy = new LazyProxy();
console.log("Proxy created, object not yet created");
console.log("Data:", proxy.getData());

