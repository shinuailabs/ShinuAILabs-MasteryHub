/**
 * Lab 200: Class Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for classes:
 * 
 * - Single responsibility
 * - Encapsulation
 * - Composition over inheritance
 * - SOLID principles
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply class best practices
 * 2. Use proper encapsulation
 * 3. Prefer composition
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Single Responsibility
console.log("--- Single Responsibility ---");

// Bad: Multiple responsibilities
class BadUser {
    save(): void { /* save to DB */ }
    sendEmail(): void { /* send email */ }
    generateReport(): void { /* generate report */ }
}

// Good: Single responsibility
class User {
    constructor(public name: string, public email: string) {}
}

class UserRepository {
    save(user: User): void {
        console.log("Saving user:", user.name);
    }
}

class EmailService {
    send(to: string, message: string): void {
        console.log(`Sending email to ${to}`);
    }
}

const user = new User("John", "john@example.com");
const repo = new UserRepository();
repo.save(user);

// Solution 2: Encapsulation
console.log("\n--- Encapsulation ---");

class BankAccount {
    private _balance: number;
    
    constructor(initialBalance: number) {
        this._balance = initialBalance;
    }
    
    get balance(): number {
        return this._balance;
    }
    
    deposit(amount: number): boolean {
        if (amount <= 0) return false;
        this._balance += amount;
        return true;
    }
    
    withdraw(amount: number): boolean {
        if (amount <= 0 || amount > this._balance) return false;
        this._balance -= amount;
        return true;
    }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log("Balance:", account.balance);

// Solution 3: Composition Over Inheritance
console.log("\n--- Composition Over Inheritance ---");

// Bad: Deep inheritance
// class Animal -> class Mammal -> class Dog -> class GermanShepherd

// Good: Composition
interface CanBark {
    bark(): void;
}

interface CanRun {
    run(): void;
}

class Barker implements CanBark {
    bark(): void {
        console.log("Woof!");
    }
}

class Runner implements CanRun {
    run(): void {
        console.log("Running...");
    }
}

class Dog {
    private barker = new Barker();
    private runner = new Runner();
    
    bark(): void {
        this.barker.bark();
    }
    
    run(): void {
        this.runner.run();
    }
}

const dog = new Dog();
dog.bark();
dog.run();

// Solution 4: Dependency Injection
console.log("\n--- Dependency Injection ---");

interface Logger {
    log(message: string): void;
}

class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(`[LOG] ${message}`);
    }
}

class UserService {
    constructor(private logger: Logger) {}
    
    createUser(name: string): void {
        this.logger.log(`Creating user: ${name}`);
    }
}

const logger = new ConsoleLogger();
const service = new UserService(logger);
service.createUser("John");

// Solution 5: Interface Segregation
console.log("\n--- Interface Segregation ---");

// Bad: Fat interface
interface BadWorker {
    work(): void;
    eat(): void;
    sleep(): void;
}

// Good: Segregated interfaces
interface Workable {
    work(): void;
}

interface Eatable {
    eat(): void;
}

class Human implements Workable, Eatable {
    work(): void {
        console.log("Working...");
    }
    
    eat(): void {
        console.log("Eating...");
    }
}

class Robot implements Workable {
    work(): void {
        console.log("Working...");
    }
}

// Solution 6: Immutable Objects
console.log("\n--- Immutable Objects ---");

class ImmutablePoint {
    constructor(
        public readonly x: number,
        public readonly y: number
    ) {}
    
    move(dx: number, dy: number): ImmutablePoint {
        return new ImmutablePoint(this.x + dx, this.y + dy);
    }
}

const p1 = new ImmutablePoint(10, 20);
const p2 = p1.move(5, 5);
console.log("P1:", p1.x, p1.y);
console.log("P2:", p2.x, p2.y);

// Solution 7: Factory Pattern
console.log("\n--- Factory Pattern ---");

interface Product {
    name: string;
    price: number;
}

class ProductFactory {
    static create(type: "basic" | "premium"): Product {
        switch (type) {
            case "basic":
                return { name: "Basic Product", price: 9.99 };
            case "premium":
                return { name: "Premium Product", price: 29.99 };
        }
    }
}

const basic = ProductFactory.create("basic");
const premium = ProductFactory.create("premium");
console.log("Basic:", basic);
console.log("Premium:", premium);

// Solution 8: Builder Pattern
console.log("\n--- Builder Pattern ---");

class QueryBuilder {
    private query: string[] = [];
    
    select(fields: string[]): this {
        this.query.push(`SELECT ${fields.join(", ")}`);
        return this;
    }
    
    from(table: string): this {
        this.query.push(`FROM ${table}`);
        return this;
    }
    
    where(condition: string): this {
        this.query.push(`WHERE ${condition}`);
        return this;
    }
    
    build(): string {
        return this.query.join(" ");
    }
}

const query = new QueryBuilder()
    .select(["name", "email"])
    .from("users")
    .where("active = true")
    .build();

console.log("Query:", query);

// Solution 9: Summary Checklist
console.log("\n--- Best Practices Checklist ---");

const checklist = [
    "✓ Single Responsibility Principle",
    "✓ Encapsulate internal state",
    "✓ Prefer composition over inheritance",
    "✓ Use dependency injection",
    "✓ Keep interfaces small and focused",
    "✓ Prefer immutable objects",
    "✓ Use factory/builder patterns",
    "✓ Document public APIs",
    "✓ Write testable code",
    "✓ Follow naming conventions"
];

checklist.forEach(item => console.log(item));

