/**
 * Lab 192: Access Modifiers
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript access modifiers:
 * 
 * - public (default)
 * - private
 * - protected
 * - readonly
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use different access modifiers
 * 2. Understand visibility rules
 * 3. Combine modifiers
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Public Modifier
console.log("--- Public Modifier ---");

class PublicExample {
    public name: string;
    public age: number;
    
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    public greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}

const pub = new PublicExample("John", 30);
console.log(pub.name);  // Accessible
console.log(pub.greet());

// Solution 2: Private Modifier
console.log("\n--- Private Modifier ---");

class BankAccount {
    private balance: number;
    private transactions: string[] = [];
    
    constructor(initialBalance: number) {
        this.balance = initialBalance;
        this.logTransaction("Initial deposit", initialBalance);
    }
    
    private logTransaction(type: string, amount: number): void {
        this.transactions.push(`${type}: $${amount}`);
    }
    
    public deposit(amount: number): void {
        this.balance += amount;
        this.logTransaction("Deposit", amount);
    }
    
    public getBalance(): number {
        return this.balance;
    }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log("Balance:", account.getBalance());
// account.balance; // Error: private
// account.logTransaction(); // Error: private

// Solution 3: Protected Modifier
console.log("\n--- Protected Modifier ---");

class Animal {
    protected name: string;
    protected age: number;
    
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    protected makeSound(): void {
        console.log("Some sound");
    }
}

class Dog extends Animal {
    private breed: string;
    
    constructor(name: string, age: number, breed: string) {
        super(name, age);
        this.breed = breed;
    }
    
    public describe(): string {
        // Can access protected members
        return `${this.name} is a ${this.age} year old ${this.breed}`;
    }
    
    public bark(): void {
        this.makeSound();  // Can call protected method
        console.log("Woof!");
    }
}

const dog = new Dog("Rex", 3, "German Shepherd");
console.log(dog.describe());
// dog.name; // Error: protected

// Solution 4: Readonly Modifier
console.log("\n--- Readonly Modifier ---");

class Config {
    public readonly host: string;
    public readonly port: number;
    private readonly secret: string;
    
    constructor(host: string, port: number, secret: string) {
        this.host = host;
        this.port = port;
        this.secret = secret;
    }
    
    public getConnectionString(): string {
        return `${this.host}:${this.port}`;
    }
}

const config = new Config("localhost", 3000, "secret123");
console.log("Host:", config.host);
// config.host = "other"; // Error: readonly

// Solution 5: Parameter Properties with Modifiers
console.log("\n--- Parameter Properties ---");

class User {
    constructor(
        public readonly id: number,
        public name: string,
        private password: string,
        protected role: string = "user"
    ) {}
    
    public validatePassword(input: string): boolean {
        return this.password === input;
    }
}

const user = new User(1, "John", "secret123", "admin");
console.log("User:", user.id, user.name);
console.log("Valid password:", user.validatePassword("secret123"));

// Solution 6: Private vs # Private Fields
console.log("\n--- Private vs # Fields ---");

class ModernClass {
    private tsPrivate: string = "TypeScript private";
    #jsPrivate: string = "JavaScript private";
    
    public getTsPrivate(): string {
        return this.tsPrivate;
    }
    
    public getJsPrivate(): string {
        return this.#jsPrivate;
    }
}

const modern = new ModernClass();
console.log("TS Private:", modern.getTsPrivate());
console.log("JS Private:", modern.getJsPrivate());

// Solution 7: Access Modifiers in Inheritance
console.log("\n--- Inheritance Access ---");

class Base {
    public publicProp = "public";
    protected protectedProp = "protected";
    private privateProp = "private";
    
    public publicMethod(): void {
        console.log("Public method");
    }
    
    protected protectedMethod(): void {
        console.log("Protected method");
    }
    
    private privateMethod(): void {
        console.log("Private method");
    }
}

class Derived extends Base {
    public accessMembers(): void {
        console.log(this.publicProp);      // OK
        console.log(this.protectedProp);   // OK
        // console.log(this.privateProp);  // Error
        
        this.publicMethod();     // OK
        this.protectedMethod();  // OK
        // this.privateMethod(); // Error
    }
}

const derived = new Derived();
derived.accessMembers();

// Solution 8: Getters and Setters
console.log("\n--- Getters and Setters ---");

class Person {
    private _age: number = 0;
    
    constructor(public name: string, age: number) {
        this._age = age;
    }
    
    public get age(): number {
        return this._age;
    }
    
    public set age(value: number) {
        if (value < 0) {
            throw new Error("Age cannot be negative");
        }
        this._age = value;
    }
}

const person = new Person("John", 30);
console.log("Age:", person.age);
person.age = 31;
console.log("New age:", person.age);

// Solution 9: Static with Access Modifiers
console.log("\n--- Static Access ---");

class Counter {
    private static count: number = 0;
    public static readonly MAX_COUNT: number = 100;
    
    public static increment(): void {
        if (Counter.count < Counter.MAX_COUNT) {
            Counter.count++;
        }
    }
    
    public static getCount(): number {
        return Counter.count;
    }
}

Counter.increment();
Counter.increment();
console.log("Count:", Counter.getCount());
console.log("Max:", Counter.MAX_COUNT);

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

class SecureStorage {
    private data: Map<string, string> = new Map();
    private readonly encryptionKey: string;
    
    constructor(key: string) {
        this.encryptionKey = key;
    }
    
    private encrypt(value: string): string {
        // Simplified encryption
        return Buffer.from(value).toString("base64");
    }
    
    private decrypt(value: string): string {
        return Buffer.from(value, "base64").toString();
    }
    
    public set(key: string, value: string): void {
        this.data.set(key, this.encrypt(value));
    }
    
    public get(key: string): string | undefined {
        const encrypted = this.data.get(key);
        return encrypted ? this.decrypt(encrypted) : undefined;
    }
}

const storage = new SecureStorage("my-key");
storage.set("password", "secret123");
console.log("Retrieved:", storage.get("password"));

