/**
 * Lab 177: Class Type Annotations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Typing classes in TypeScript:
 * 
 * - Property types
 * - Method types
 * - Constructor types
 * - Access modifiers
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Add types to class members
 * 2. Use access modifiers
 * 3. Implement interfaces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Class Types
console.log("--- Basic Class Types ---");

class User {
    name: string;
    age: number;
    email: string;
    
    constructor(name: string, age: number, email: string) {
        this.name = name;
        this.age = age;
        this.email = email;
    }
    
    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}

const user = new User("John", 30, "john@example.com");
console.log(user.greet());

// Solution 2: Access Modifiers
console.log("\n--- Access Modifiers ---");

class BankAccount {
    public accountNumber: string;
    private balance: number;
    protected owner: string;
    
    constructor(accountNumber: string, owner: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.owner = owner;
        this.balance = initialBalance;
    }
    
    public deposit(amount: number): void {
        this.balance += amount;
    }
    
    public getBalance(): number {
        return this.balance;
    }
    
    private validateAmount(amount: number): boolean {
        return amount > 0;
    }
}

const account = new BankAccount("123456", "John", 1000);
account.deposit(500);
console.log("Balance:", account.getBalance());

// Solution 3: Readonly Properties
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
// config.host = "other"; // Error!

// Solution 4: Parameter Properties
console.log("\n--- Parameter Properties ---");

class Product {
    constructor(
        public readonly id: number,
        public name: string,
        private price: number,
        protected category: string
    ) {}
    
    getPrice(): number {
        return this.price;
    }
}

const product = new Product(1, "Widget", 29.99, "Electronics");
console.log("Product:", product.name, product.getPrice());

// Solution 5: Static Members
console.log("\n--- Static Members ---");

class Counter {
    private static count: number = 0;
    
    static increment(): void {
        Counter.count++;
    }
    
    static getCount(): number {
        return Counter.count;
    }
    
    static reset(): void {
        Counter.count = 0;
    }
}

Counter.increment();
Counter.increment();
console.log("Count:", Counter.getCount());

// Solution 6: Getters and Setters
console.log("\n--- Getters and Setters ---");

class Person {
    private _age: number = 0;
    
    constructor(public name: string, age: number) {
        this._age = age;
    }
    
    get age(): number {
        return this._age;
    }
    
    set age(value: number) {
        if (value < 0) {
            throw new Error("Age cannot be negative");
        }
        this._age = value;
    }
    
    get isAdult(): boolean {
        return this._age >= 18;
    }
}

const person = new Person("John", 25);
console.log("Age:", person.age);
console.log("Is adult:", person.isAdult);

// Solution 7: Implementing Interfaces
console.log("\n--- Implementing Interfaces ---");

interface Printable {
    print(): void;
}

interface Serializable {
    serialize(): string;
}

class Document implements Printable, Serializable {
    constructor(public title: string, public content: string) {}
    
    print(): void {
        console.log(`Title: ${this.title}\nContent: ${this.content}`);
    }
    
    serialize(): string {
        return JSON.stringify({ title: this.title, content: this.content });
    }
}

const doc = new Document("Report", "This is the content");
doc.print();
console.log("Serialized:", doc.serialize());

// Solution 8: Abstract Classes
console.log("\n--- Abstract Classes ---");

abstract class Shape {
    abstract getArea(): number;
    abstract getPerimeter(): number;
    
    describe(): string {
        return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
    }
}

class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }
    
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
    
    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

const circle = new Circle(5);
console.log(circle.describe());

// Solution 9: Generic Classes
console.log("\n--- Generic Classes ---");

class Container<T> {
    private items: T[] = [];
    
    add(item: T): void {
        this.items.push(item);
    }
    
    get(index: number): T | undefined {
        return this.items[index];
    }
    
    getAll(): T[] {
        return [...this.items];
    }
}

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
console.log("Container:", numberContainer.getAll());

// Solution 10: Class Type
console.log("\n--- Class Type ---");

// Type of class instance
type UserType = InstanceType<typeof User>;

// Type of class constructor
type UserConstructor = typeof User;

function createInstance<T>(ctor: new (...args: any[]) => T, ...args: any[]): T {
    return new ctor(...args);
}

const newUser = createInstance(User, "Jane", 25, "jane@example.com");
console.log("New user:", newUser.name);

