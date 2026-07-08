/**
 * Lab 191: Class Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript classes:
 * 
 * - Class declaration
 * - Properties and methods
 * - Constructors
 * - Type annotations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic classes
 * 2. Add properties and methods
 * 3. Use constructors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Class
console.log("--- Basic Class ---");

class Person {
    name: string;
    age: number;
    
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
    
    describe(): string {
        return `${this.name} is ${this.age} years old`;
    }
}

const person = new Person("John", 30);
console.log(person.greet());
console.log(person.describe());

// Solution 2: Property Initialization
console.log("\n--- Property Initialization ---");

class Counter {
    count: number = 0;  // Default value
    
    increment(): void {
        this.count++;
    }
    
    decrement(): void {
        this.count--;
    }
    
    reset(): void {
        this.count = 0;
    }
}

const counter = new Counter();
counter.increment();
counter.increment();
console.log("Count:", counter.count);

// Solution 3: Parameter Properties
console.log("\n--- Parameter Properties ---");

class User {
    constructor(
        public id: number,
        public name: string,
        public email: string
    ) {}
    
    toString(): string {
        return `User(${this.id}, ${this.name}, ${this.email})`;
    }
}

const user = new User(1, "John", "john@example.com");
console.log(user.toString());

// Solution 4: Readonly Properties
console.log("\n--- Readonly Properties ---");

class Config {
    readonly host: string;
    readonly port: number;
    
    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }
}

const config = new Config("localhost", 3000);
console.log("Config:", config.host, config.port);
// config.host = "other"; // Error: readonly

// Solution 5: Optional Properties
console.log("\n--- Optional Properties ---");

class Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    
    constructor(id: number, name: string, price: number, description?: string) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
    }
}

const product1 = new Product(1, "Widget", 9.99);
const product2 = new Product(2, "Gadget", 19.99, "A useful gadget");

console.log("Product 1:", product1.name);
console.log("Product 2:", product2.description);

// Solution 6: Methods with Return Types
console.log("\n--- Method Return Types ---");

class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
    
    subtract(a: number, b: number): number {
        return a - b;
    }
    
    multiply(a: number, b: number): number {
        return a * b;
    }
    
    divide(a: number, b: number): number | null {
        if (b === 0) return null;
        return a / b;
    }
}

const calc = new Calculator();
console.log("Add:", calc.add(10, 5));
console.log("Divide:", calc.divide(20, 4));

// Solution 7: Method Chaining
console.log("\n--- Method Chaining ---");

class StringBuilder {
    private value: string = "";
    
    append(str: string): this {
        this.value += str;
        return this;
    }
    
    appendLine(str: string): this {
        this.value += str + "\n";
        return this;
    }
    
    toString(): string {
        return this.value;
    }
}

const builder = new StringBuilder();
const result = builder
    .append("Hello")
    .append(" ")
    .appendLine("World")
    .append("TypeScript!")
    .toString();

console.log("Built string:", result);

// Solution 8: Class with Array Property
console.log("\n--- Array Property ---");

class TodoList {
    private items: string[] = [];
    
    add(item: string): void {
        this.items.push(item);
    }
    
    remove(item: string): boolean {
        const index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
    
    getAll(): string[] {
        return [...this.items];
    }
}

const todos = new TodoList();
todos.add("Learn TypeScript");
todos.add("Build project");
console.log("Todos:", todos.getAll());

// Solution 9: Class Type
console.log("\n--- Class Type ---");

// Class can be used as a type
function createPerson(name: string, age: number): Person {
    return new Person(name, age);
}

// Array of class instances
const people: Person[] = [
    new Person("Alice", 25),
    new Person("Bob", 30)
];

console.log("People:", people.map(p => p.name));

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

class BankAccount {
    private balance: number;
    
    constructor(
        public readonly accountNumber: string,
        public readonly owner: string,
        initialBalance: number = 0
    ) {
        this.balance = initialBalance;
    }
    
    deposit(amount: number): boolean {
        if (amount <= 0) return false;
        this.balance += amount;
        return true;
    }
    
    withdraw(amount: number): boolean {
        if (amount <= 0 || amount > this.balance) return false;
        this.balance -= amount;
        return true;
    }
    
    getBalance(): number {
        return this.balance;
    }
}

const account = new BankAccount("123456", "John", 1000);
account.deposit(500);
account.withdraw(200);
console.log("Balance:", account.getBalance());

