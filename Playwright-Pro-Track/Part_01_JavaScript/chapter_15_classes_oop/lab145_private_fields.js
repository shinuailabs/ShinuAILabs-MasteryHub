/**
 * Lab 145: Private Fields and Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * True private members in classes:
 * 
 * - # prefix for private fields
 * - Private methods
 * - Private static members
 * - Encapsulation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create private fields
 * 2. Use private methods
 * 3. Implement encapsulation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Private Fields
console.log("--- Private Fields ---");

class BankAccount {
    #balance = 0;
    #accountNumber;
    
    constructor(accountNumber, initialBalance) {
        this.#accountNumber = accountNumber;
        this.#balance = initialBalance;
    }
    
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
        }
        return this.#balance;
    }
    
    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            return amount;
        }
        return 0;
    }
    
    getBalance() {
        return this.#balance;
    }
    
    getAccountInfo() {
        return `Account: ${this.#accountNumber}, Balance: $${this.#balance}`;
    }
}

const account = new BankAccount("123456", 1000);
console.log("Info:", account.getAccountInfo());
account.deposit(500);
console.log("After deposit:", account.getBalance());
// console.log(account.#balance); // SyntaxError: Private field

// Solution 2: Private Methods
console.log("\n--- Private Methods ---");

class PasswordManager {
    #passwords = new Map();
    
    #encrypt(password) {
        // Simple "encryption" for demo
        return Buffer.from(password).toString("base64");
    }
    
    #decrypt(encrypted) {
        return Buffer.from(encrypted, "base64").toString();
    }
    
    #validate(password) {
        return password.length >= 8;
    }
    
    store(site, password) {
        if (!this.#validate(password)) {
            throw new Error("Password must be at least 8 characters");
        }
        this.#passwords.set(site, this.#encrypt(password));
    }
    
    retrieve(site) {
        const encrypted = this.#passwords.get(site);
        return encrypted ? this.#decrypt(encrypted) : null;
    }
}

const pm = new PasswordManager();
pm.store("example.com", "mySecurePassword123");
console.log("Retrieved:", pm.retrieve("example.com"));

// Solution 3: Private Static Members
console.log("\n--- Private Static ---");

class IdGenerator {
    static #counter = 0;
    static #prefix = "ID";
    
    static #formatId(num) {
        return `${this.#prefix}_${num.toString().padStart(6, "0")}`;
    }
    
    static generate() {
        return this.#formatId(++this.#counter);
    }
    
    static getCount() {
        return this.#counter;
    }
}

console.log("ID 1:", IdGenerator.generate());
console.log("ID 2:", IdGenerator.generate());
console.log("ID 3:", IdGenerator.generate());
console.log("Count:", IdGenerator.getCount());

// Solution 4: Private with Getters/Setters
console.log("\n--- Private with Accessors ---");

class Person {
    #name;
    #age;
    
    constructor(name, age) {
        this.#name = name;
        this.#age = age;
    }
    
    get name() {
        return this.#name;
    }
    
    set name(value) {
        if (typeof value !== "string" || value.length === 0) {
            throw new Error("Invalid name");
        }
        this.#name = value;
    }
    
    get age() {
        return this.#age;
    }
    
    set age(value) {
        if (typeof value !== "number" || value < 0) {
            throw new Error("Invalid age");
        }
        this.#age = value;
    }
}

const person = new Person("John", 30);
console.log("Name:", person.name);
person.name = "Jane";
console.log("New name:", person.name);

// Solution 5: Private in Inheritance
console.log("\n--- Private in Inheritance ---");

class Animal {
    #name;
    
    constructor(name) {
        this.#name = name;
    }
    
    getName() {
        return this.#name;
    }
    
    #makeSound() {
        return "Some sound";
    }
    
    speak() {
        return `${this.#name} says: ${this.#makeSound()}`;
    }
}

class Dog extends Animal {
    #breed;
    
    constructor(name, breed) {
        super(name);
        this.#breed = breed;
    }
    
    getBreed() {
        return this.#breed;
    }
    
    // Cannot access parent's #name or #makeSound
    describe() {
        return `${this.getName()} is a ${this.#breed}`;
    }
}

const dog = new Dog("Rex", "German Shepherd");
console.log("Describe:", dog.describe());
console.log("Speak:", dog.speak());

// Solution 6: Private Field Checking
console.log("\n--- Private Field Checking ---");

class MyClass {
    #privateField = 42;
    
    static hasPrivateField(obj) {
        return #privateField in obj;
    }
    
    getPrivate() {
        return this.#privateField;
    }
}

const obj1 = new MyClass();
const obj2 = {};

console.log("obj1 has private:", MyClass.hasPrivateField(obj1));
console.log("obj2 has private:", MyClass.hasPrivateField(obj2));

// Solution 7: Encapsulated State Machine
console.log("\n--- State Machine ---");

class TrafficLight {
    #state = "red";
    #transitions = {
        red: "green",
        green: "yellow",
        yellow: "red"
    };
    
    #isValidState(state) {
        return ["red", "green", "yellow"].includes(state);
    }
    
    getState() {
        return this.#state;
    }
    
    next() {
        this.#state = this.#transitions[this.#state];
        return this.#state;
    }
}

const light = new TrafficLight();
console.log("Initial:", light.getState());
console.log("Next:", light.next());
console.log("Next:", light.next());
console.log("Next:", light.next());

// Solution 8: Private Event Emitter
console.log("\n--- Private Event Emitter ---");

class EventEmitter {
    #events = new Map();
    
    on(event, callback) {
        if (!this.#events.has(event)) {
            this.#events.set(event, []);
        }
        this.#events.get(event).push(callback);
    }
    
    emit(event, ...args) {
        const callbacks = this.#events.get(event) || [];
        callbacks.forEach(cb => cb(...args));
    }
    
    off(event, callback) {
        const callbacks = this.#events.get(event) || [];
        this.#events.set(event, callbacks.filter(cb => cb !== callback));
    }
}

const emitter = new EventEmitter();
emitter.on("message", (msg) => console.log("Received:", msg));
emitter.emit("message", "Hello!");

