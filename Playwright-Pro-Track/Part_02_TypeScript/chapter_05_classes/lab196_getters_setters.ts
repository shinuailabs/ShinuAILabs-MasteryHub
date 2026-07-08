/**
 * Lab 196: Getters and Setters
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Property accessors:
 * 
 * - get keyword
 * - set keyword
 * - Computed properties
 * - Validation in setters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create getters and setters
 * 2. Add validation logic
 * 3. Use computed properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Getter and Setter
console.log("--- Basic Getter/Setter ---");

class Person {
    private _name: string = "";
    
    get name(): string {
        return this._name;
    }
    
    set name(value: string) {
        this._name = value;
    }
}

const person = new Person();
person.name = "John";  // Uses setter
console.log("Name:", person.name);  // Uses getter

// Solution 2: Validation in Setter
console.log("\n--- Validation ---");

class User {
    private _age: number = 0;
    private _email: string = "";
    
    get age(): number {
        return this._age;
    }
    
    set age(value: number) {
        if (value < 0 || value > 150) {
            throw new Error("Invalid age");
        }
        this._age = value;
    }
    
    get email(): string {
        return this._email;
    }
    
    set email(value: string) {
        if (!value.includes("@")) {
            throw new Error("Invalid email");
        }
        this._email = value;
    }
}

const user = new User();
user.age = 30;
user.email = "john@example.com";
console.log("Age:", user.age);
console.log("Email:", user.email);

// Solution 3: Computed Properties
console.log("\n--- Computed Properties ---");

class Rectangle {
    constructor(public width: number, public height: number) {}
    
    get area(): number {
        return this.width * this.height;
    }
    
    get perimeter(): number {
        return 2 * (this.width + this.height);
    }
    
    get isSquare(): boolean {
        return this.width === this.height;
    }
}

const rect = new Rectangle(10, 5);
console.log("Area:", rect.area);
console.log("Perimeter:", rect.perimeter);
console.log("Is square:", rect.isSquare);

// Solution 4: Read-only Getter
console.log("\n--- Read-only Getter ---");

class Counter {
    private _count: number = 0;
    
    get count(): number {
        return this._count;
    }
    
    increment(): void {
        this._count++;
    }
    
    decrement(): void {
        this._count--;
    }
}

const counter = new Counter();
counter.increment();
counter.increment();
console.log("Count:", counter.count);
// counter.count = 10; // Error: no setter

// Solution 5: Lazy Initialization
console.log("\n--- Lazy Initialization ---");

class ExpensiveResource {
    private _data: string[] | null = null;
    
    get data(): string[] {
        if (this._data === null) {
            console.log("Loading data...");
            this._data = ["item1", "item2", "item3"];
        }
        return this._data;
    }
}

const resource = new ExpensiveResource();
console.log("First access:", resource.data);
console.log("Second access:", resource.data);

// Solution 6: Derived Values
console.log("\n--- Derived Values ---");

class FullName {
    constructor(
        private _firstName: string,
        private _lastName: string
    ) {}
    
    get firstName(): string {
        return this._firstName;
    }
    
    set firstName(value: string) {
        this._firstName = value;
    }
    
    get lastName(): string {
        return this._lastName;
    }
    
    set lastName(value: string) {
        this._lastName = value;
    }
    
    get fullName(): string {
        return `${this._firstName} ${this._lastName}`;
    }
    
    set fullName(value: string) {
        const parts = value.split(" ");
        this._firstName = parts[0] || "";
        this._lastName = parts.slice(1).join(" ") || "";
    }
}

const name = new FullName("John", "Doe");
console.log("Full name:", name.fullName);
name.fullName = "Jane Smith";
console.log("First:", name.firstName);
console.log("Last:", name.lastName);

// Solution 7: Type Conversion
console.log("\n--- Type Conversion ---");

class Temperature {
    private _celsius: number = 0;
    
    get celsius(): number {
        return this._celsius;
    }
    
    set celsius(value: number) {
        this._celsius = value;
    }
    
    get fahrenheit(): number {
        return (this._celsius * 9/5) + 32;
    }
    
    set fahrenheit(value: number) {
        this._celsius = (value - 32) * 5/9;
    }
    
    get kelvin(): number {
        return this._celsius + 273.15;
    }
}

const temp = new Temperature();
temp.celsius = 100;
console.log("Celsius:", temp.celsius);
console.log("Fahrenheit:", temp.fahrenheit);
console.log("Kelvin:", temp.kelvin);

// Solution 8: Practical Example
console.log("\n--- Practical Example ---");

class BankAccount {
    private _balance: number;
    private _transactions: string[] = [];
    
    constructor(initialBalance: number) {
        this._balance = initialBalance;
        this.logTransaction("Initial deposit", initialBalance);
    }
    
    get balance(): number {
        return this._balance;
    }
    
    get transactions(): readonly string[] {
        return this._transactions;
    }
    
    private logTransaction(type: string, amount: number): void {
        this._transactions.push(`${type}: $${amount}`);
    }
    
    deposit(amount: number): void {
        if (amount <= 0) throw new Error("Invalid amount");
        this._balance += amount;
        this.logTransaction("Deposit", amount);
    }
    
    withdraw(amount: number): void {
        if (amount <= 0) throw new Error("Invalid amount");
        if (amount > this._balance) throw new Error("Insufficient funds");
        this._balance -= amount;
        this.logTransaction("Withdrawal", amount);
    }
}

const account = new BankAccount(1000);
account.deposit(500);
account.withdraw(200);
console.log("Balance:", account.balance);
console.log("Transactions:", account.transactions);

